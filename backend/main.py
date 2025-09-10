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
import sys

# Enhanced logging configuration for Render
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(sys.stdout),  # Ensure logs go to stdout for Render
        logging.StreamHandler(sys.stderr)   # Also to stderr for errors
    ]
)

logger = logging.getLogger(__name__)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://your-frontend-domain.netlify.app"],  # Add your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Enhanced CSV loading with detailed logging
def load_data():
    logger.info("=== STARTING DATA LOADING ===")
    logger.info(f"Current working directory: {os.getcwd()}")
    logger.info(f"Directory contents: {os.listdir('.')}")
    
    try:
        if os.path.exists("dais.csv"):
            logger.info("✅ dais.csv found!")
            df = pd.read_csv("dais.csv", encoding='latin-1')
            logger.info(f"✅ CSV loaded successfully! Shape: {df.shape}")
            logger.info(f"✅ Columns: {list(df.columns)}")
            return df
        else:
            logger.error("❌ dais.csv not found!")
            # Look for any CSV files
            csv_files = [f for f in os.listdir('.') if f.endswith('.csv')]
            logger.error(f"Available CSV files: {csv_files}")
            raise FileNotFoundError("dais.csv not found")
            
    except Exception as e:
        logger.error(f"❌ Error loading CSV: {str(e)}")
        raise e

# Load data with enhanced error handling
try:
    logger.info("🚀 Starting application...")
    df = load_data()
    logger.info("✅ Data loaded successfully!")
except Exception as e:
    logger.error(f"💥 CRITICAL: Failed to load data: {str(e)}")
    # Create a dummy DataFrame to prevent app from crashing
    df = pd.DataFrame()
    logger.error("⚠️ Running with empty DataFrame - app will return errors for requests")

# Rest of your configuration
skin_columns = ["oily", "dry", "combination", "sensitive", "normal"]
product_types = ["moisturizer", "cleanser", "serum", "toner", "sunscreen", "mask", "treatment", "exfoliator", "face wash"]
categories = ["indian", "global"]

if not df.empty:
    df["product_type"] = df["product_type"].str.lower()
    df["category"] = df["category"].str.lower()
    df["skintype"] = df["skintype"].str.lower()
    df["combined_features"] = df["notable_effects"].fillna("")
    logger.info("✅ Data preprocessing completed")

# TF-IDF setup with logging
tfidf_cache_file = "tfidf_cache.pkl"
tfidf_cache = None

if not df.empty:
    if os.path.exists(tfidf_cache_file):
        try:
            with open(tfidf_cache_file, "rb") as f:
                tfidf_cache = pickle.load(f)
            logger.info("✅ TF-IDF loaded from cache")
        except Exception as e:
            logger.error(f"❌ Error loading TF-IDF cache: {e}")
    
    if tfidf_cache is None:
        try:
            logger.info("🔄 Computing TF-IDF...")
            vectorizer = TfidfVectorizer(stop_words="english")
            tfidf_matrix = vectorizer.fit_transform(df["combined_features"])
            tfidf_cache = {"matrix": tfidf_matrix, "vectorizer": vectorizer}
            
            with open(tfidf_cache_file, "wb") as f:
                pickle.dump(tfidf_cache, f)
            logger.info("✅ TF-IDF computed and cached")
        except Exception as e:
            logger.error(f"❌ Error computing TF-IDF: {e}")

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
    
    # Log incoming requests
    logger.info(f"📥 REQUEST: {request.method} {request.url}")
    
    response = await call_next(request)
    response.set_cookie(
        key="session_id",
        value=session_id,
        httponly=True,
        secure=False,
        samesite="lax",
    )
    
    logger.info(f"📤 RESPONSE: {response.status_code}")
    return response

@app.get("/")
def root():
    return {"status": "API is running", "data_loaded": not df.empty, "total_products": len(df)}

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "data_loaded": not df.empty,
        "total_products": len(df),
        "tfidf_loaded": tfidf_cache is not None
    }

@app.get("/recommendations")
def get_recommendations(
    request: Request,
    skintype: str = Query(..., description="Skin type: oily, dry, combination, sensitive, normal"),
    product_type: str = Query(..., description="Product type: Moisturizer, Cleanser, Serum, etc."),
    category: str = Query(..., description="Category: Indian or Global"),
    concern: str = Query(None, description="Optional: Concern like acne, hydration, wrinkles (comma-separated)"),
    limit: int = Query(6, description="Number of recommendations (default: 6)"),
):
    logger.info(f"🔍 NEW RECOMMENDATION REQUEST:")
    logger.info(f"   Skintype: {skintype}")
    logger.info(f"   Product Type: {product_type}")
    logger.info(f"   Category: {category}")
    logger.info(f"   Concern: {concern}")
    
    # Check if data is loaded
    if df.empty:
        logger.error("❌ No data loaded - cannot process recommendations")
        raise HTTPException(status_code=500, detail="Server data not loaded properly")
    
    if tfidf_cache is None:
        logger.error("❌ TF-IDF not loaded - cannot process recommendations")
        raise HTTPException(status_code=500, detail="Server TF-IDF not loaded properly")
    
    try:
        skintype = skintype.lower()
        product_type = product_type.lower()
        category = category.lower()
        
        df.columns = df.columns.str.lower()

        # Validation
        if skintype not in skin_columns:
            logger.error(f"❌ Invalid skin type: {skintype}")
            raise HTTPException(status_code=400, detail="Invalid skin type")
        if product_type not in product_types:
            logger.error(f"❌ Invalid product type: {product_type}")
            raise HTTPException(status_code=400, detail="Invalid product type")
        if category not in categories:
            logger.error(f"❌ Invalid category: {category}")
            raise HTTPException(status_code=400, detail="Invalid category")

        # Filter step by step with logging
        logger.info(f"📊 Starting with {len(df)} total products")
        
        filtered_df = df[df[skintype] == 1].copy()
        logger.info(f"📊 After skin type filter: {len(filtered_df)} products")

        if category == "global" and product_type == "cleanser":
            filtered_df = filtered_df[
                (filtered_df["product_type"] == "face wash") | (filtered_df["product_type"] == product_type)
            ]
            logger.info(f"📊 After cleanser/face wash filter: {len(filtered_df)} products")
        else:
            filtered_df = filtered_df[filtered_df["product_type"] == product_type]
            logger.info(f"📊 After product type filter: {len(filtered_df)} products")

        filtered_df = filtered_df[filtered_df["category"] == category]
        logger.info(f"📊 After category filter: {len(filtered_df)} products")

        if filtered_df.empty:
            logger.error("❌ No products found after filtering")
            # Debug info
            available_combos = df.groupby(['category', 'product_type']).size().reset_index(name='count')
            logger.error(f"Available combinations: {available_combos.to_dict('records')}")
            raise HTTPException(status_code=404, detail="No products found matching your criteria.")

        # Process recommendations
        concern_list = []
        if concern:
            concern_list.extend(concern.lower().split(','))
        else:
            concern_list.extend(skin_concern_map.get(skintype, []))

        if concern_list:
            logger.info(f"🔍 Processing with concerns: {concern_list}")
            concern_vector = tfidf_cache["vectorizer"].transform(concern_list)
            filtered_tfidf_matrix = tfidf_cache["vectorizer"].transform(filtered_df["combined_features"])

            similarity_scores = cosine_similarity(concern_vector, filtered_tfidf_matrix).mean(axis=0)
            similarity_scores = np.array(similarity_scores).flatten()

            filtered_df["similarity"] = similarity_scores
            top_products = filtered_df.sort_values(by="similarity", ascending=False).head(limit + 3)

            results = top_products[["product_name", "brand", "notable_effects", "product_url", "product_image"]].to_dict(orient="records")
            results = random.sample(results, min(limit, len(results)))
        else:
            logger.info("🔍 Processing without specific concerns")
            results = filtered_df[["product_name", "brand", "notable_effects", "product_url", "product_image"]].head(limit).to_dict(orient="records")

        logger.info(f"✅ Returning {len(results)} recommendations")
        
        session_id = request.cookies.get("session_id")
        if session_id:
            if session_id not in recommendation_history:
                recommendation_history[session_id] = []
            recommendation_history[session_id].extend(results)

        return results
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"💥 Unexpected error in recommendations: {str(e)}")
        logger.error(f"💥 Error type: {type(e).__name__}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@app.get("/history")
def get_history(request: Request):
    session_id = request.cookies.get("session_id")
    if session_id and session_id in recommendation_history:
        return recommendation_history[session_id]
    else:
        return []