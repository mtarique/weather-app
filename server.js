const express = require('express');
const path = require('path'); 
const request = require('request'); 
const dotenv = require('dotenv'); 
dotenv.config(); 

const app = express(); 

const indexRouter = require('./routes/index'); 

// Setup view engine
app.set('views', path.join(__dirname, 'views')); 
app.set('view engine', 'ejs'); 

app.use(express.json()); 
app.use(express.urlencoded({extended: true})); 
app.use(express.static(path.join(__dirname, '/public'))); 

// app.use('/', indexRouter); 
app.get('/', (req, res) => res.render('index', {weather: null, error: null})); 
app.post('/', (req, res) => {
    let city = req.body.city; 

    let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${process.env.API_KEY}`;

    request(url, function(err, response, body) {
        if(err) {
            res.render('index', {weather: null, error: 'Please try again.'});
        } else {
            let weather = JSON.parse(body); 

            if(weather.main == undefined) {
                res.render('index', {weather: null, error: 'Undefined error occurred.'}); 
            } else {
                let place = `${weather.name}, ${weather.sys.country}`; 
                let weatherTimezone = `${new Date(weather.dt*1000 - weather.timezone*1000)}`; 
                let weatherTemp = `${weather.main.temp}`; 
                let weatherPressure = `${weather.main.pressure}`; 
                let weatherIcon = `http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`; 
                let weatherDescription = `${weather.weather[0].description}`; 
                let humidity = `${weather.main.humidity}`; 
                let clouds = `${weather.clouds.all}`; 
                let visibility = `${weather.visibility}`; 
                let main = `${weather.weather[0].main}`; 
                let weatherFahrenheit = (weatherTemp * 9) / 5 + 32;

                function roundToTwo(num) {
                    return +(Math.round(num + "e+2") + "e-2");
                }

                weatherFahrenheit = roundToTwo(weatherFahrenheit);

                res.render("index", {
                    weather: weather,
                    place: place,
                    temp: weatherTemp,
                    pressure: weatherPressure,
                    icon: weatherIcon,
                    description: weatherDescription,
                    timezone: weatherTimezone,
                    humidity: humidity,
                    fahrenheit: weatherFahrenheit,
                    clouds: clouds,
                    visibility: visibility,
                    main: main,
                    error: null,
                });
            }
        }
    }); 

}); 

app.listen(process.env.PORT, () => console.log(`Weather application running on ${process.env.PORT}`)); 