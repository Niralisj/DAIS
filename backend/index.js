// server/index.js
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
require('./models/db');

const authRouter = require('./routes/authrouter');
const productRouter = require('./routes/productrouter');
const postsRouter = require('./routes/PostRoute'); // Corrected line

const PORT = process.env.PORT || 8080;

app.get('/ping', (req, res) => {
    res.send('PONG');
});

app.use(bodyParser.json());
app.use(cors());

app.use('/auth', authRouter);
app.use('/products', productRouter);
app.use('/api/posts', postsRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});