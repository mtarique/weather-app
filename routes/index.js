const express = require('express'); 
const router = express.Router(); 

router.get('/', (req, res) => res.render('index', {weather: null, error: null})); 
router.post('/', (req, res) => {
    let city = req.body.city; 

    let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${process.env.API_KEY}`;

}); 

module.exports = router; 