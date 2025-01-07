
const ensureAuthenticated = require('../middleware/auth');

const router = require('express').Router();

router.get('/', ensureAuthenticated, (req, res) => {
    console.log('---logged in user details ----', req.user);
    res.status(200).json([
        {
            name: "mobile",
            price: 10000
        },

        {
            name: "laptop",
            price: 50000
        }
    ])

});
 
module.exports = router;   