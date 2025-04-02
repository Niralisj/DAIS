from fastapi import FastAPI, HTTPException, Query, Request
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
import uuid
import random
import pickle
import os
import logging

# uvicorn main:app --reload

logging.basicConfig(level=logging.INFO)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

try:
    df = pd.read_csv("dais.csv", encoding='latin-1')
except FileNotFoundError:
    raise Exception("dais.csv not found")

skin_columns = ["oily", "dry", "combination", "sensitive", "normal"]
product_types = ["moisturizer", "cleanser", "serum", "toner", "sunscreen", "mask", "treatment", "exfoliator", "face wash"]
categories = ["indian", "global"]

df["product_type"] = df["product_type"].str.lower()
df["category"] = df["category"].str.lower()
df["skintype"] = df["skintype"].str.lower()

df["combined_features"] = df["notable_effects"].fillna("")

tfidf_cache_file = "tfidf_cache.pkl"

if os.path.exists(tfidf_cache_file):
    with open(tfidf_cache_file, "rb") as f:
        tfidf_cache = pickle.load(f)
    logging.info("Loaded TF-IDF from cache.")
else:
    vectorizer = TfidfVectorizer(stop_words="english")
    tfidf_matrix = vectorizer.fit_transform(df["combined_features"])
    tfidf_cache = {"matrix": tfidf_matrix, "vectorizer": vectorizer}
    with open(tfidf_cache_file, "wb") as f:
        pickle.dump(tfidf_cache, f)
    logging.info("Computed and cached TF-IDF.")

recommendation_history = {}

skin_concern_map = {
    "oily": ["acne", "oil control"],
    "dry": ["hydration", "moisturizing"],
    "combination": ["balance", "hydration"],
    "sensitive": ["redness", "soothing"],
    "normal": ["maintenance", "glow"],
}

@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    session_id = request.cookies.get("session_id")
    if not session_id:
        session_id = str(uuid.uuid4())
    response = await call_next(request)
    response.set_cookie(
        key="session_id",
        value=session_id,
        httponly=True,
        secure=False,
        samesite="lax",
    )
    return response

@app.get("/recommendations")
def get_recommendations(
    request: Request,
    skintype: str = Query(..., description="Skin type: oily, dry, combination, sensitive, normal"),
    product_type: str = Query(..., description="Product type: Moisturizer, Cleanser, Serum, etc."),
    category: str = Query(..., description="Category: Indian or Global"),
    concern: str = Query(None, description="Optional: Concern like acne, hydration, wrinkles (comma-separated)"),
    limit: int = Query(6, description="Number of recommendations (default: 6)"), # Changed limit to 6
):
    skintype = skintype.lower()
    product_type = product_type.lower()
    category = category.lower()
    df.columns = df.columns.str.lower()

    if skintype not in skin_columns:
        raise HTTPException(status_code=400, detail="Invalid skin type")
    if product_type not in product_types:
        raise HTTPException(status_code=400, detail="Invalid product type")
    if category not in categories:
        raise HTTPException(status_code=400, detail="Invalid category")

    filtered_df = df[df[skintype] == 1].copy()

    # Corrected product type filtering for global category
    if category == "global" and product_type == "cleanser":
        filtered_df = filtered_df[
            (filtered_df["product_type"] == "face wash") | (filtered_df["product_type"] == product_type)
        ]
    else:
        filtered_df = filtered_df[filtered_df["product_type"] == product_type]

    filtered_df = filtered_df[filtered_df["category"] == category]

    print("After skin type filter:", filtered_df.shape)
    print(filtered_df["category"].unique())

    print("After product type filter:", filtered_df.shape)
    print(filtered_df["category"].unique())

    print("After category filter:", filtered_df.shape)
    print(filtered_df["category"].unique())

    if filtered_df.empty:
        raise HTTPException(status_code=404, detail="No products found matching your criteria.")

    concern_list = []
    if concern:
        concern_list.extend(concern.lower().split(','))
    else:
        concern_list.extend(skin_concern_map.get(skintype, []))

    if concern_list:
        concern_vector = tfidf_cache["vectorizer"].transform(concern_list)
        filtered_tfidf_matrix = tfidf_cache["vectorizer"].transform(filtered_df["combined_features"])

        similarity_scores = cosine_similarity(concern_vector, filtered_tfidf_matrix).mean(axis=0)
        similarity_scores = np.array(similarity_scores).flatten()

        filtered_df["similarity"] = similarity_scores
        top_products = filtered_df.sort_values(by="similarity", ascending=False).head(limit + 3)

        results = top_products[["product_name", "brand", "notable_effects", "product_url", "product_image"]].to_dict(orient="records")

        results = random.sample(results, min(limit, len(results)))
    else:
        results = filtered_df[["product_name", "brand", "notable_effects", "product_url", "product_image"]].head(limit).to_dict(orient="records")

    session_id = request.cookies.get("session_id")
    if session_id:
        if session_id not in recommendation_history:
            recommendation_history[session_id] = []
        recommendation_history[session_id].extend(results)

    return results

@app.get("/history")
def get_history(request: Request):
    session_id = request.cookies.get("session_id")
    if session_id and session_id in recommendation_history:
        return recommendation_history[session_id]
    else:
        return []