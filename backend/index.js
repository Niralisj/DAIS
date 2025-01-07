const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const authrouter = require('./routes/authrouter');
const ProductRouter = require('./routes/productrouter');

require('dotenv').config();
require('./models/db');
const PORT = process.env.PORT || 8080;

app.get('/ping', (req, res) => {
    res.send('PONG');
});

app.use(bodyParser.json());
app.use(cors());
//config objet allow specific sites to access the api
app.use('/auth', authrouter);
app.use('/products', ProductRouter);


app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`)
})