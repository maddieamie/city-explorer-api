'use strict'
const axios = require('axios')
const cache = require('./cache');


function getWeather (req, res, next) {
    const { lat, lon } = req.query;
  
    console.log('Latitude:', lat);
    console.log('Longitude:', lon);

    const key = 'City Deets: ' + lat + lon;
  
    const WeatherAPIKey = process.env.WEATHER_API_KEY;
    if (cache[key] && (Date.now() - cache[key].timestamp < 86400000)) {
      console.log('cache hit - sending data from cache')
      res.status(200).send(cache[key].data)
      //cache hit for 1 day of time, 60000 is one minute
    }
    else {
    console.log('cache miss - making a new request')
    axios.get(`https://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lon}&key=${WeatherAPIKey}`)
      .then((WeatherBitsResponse) => {
        console.log(typeof WeatherBitsResponse.data.data);
        const dataArray = WeatherBitsResponse.data.data;
  
        const forecasts = dataArray.map(data => new Forecast(data));
        return forecasts;
      })
      .then(forecasts => {
        cache[key] = {};
        cache[key].data = forecasts;
        cache[key].timestamp = Date.now()
        res.status(200).send(forecasts)
      })
      .catch((error) => {
        console.error('Error:', error);
        next(error);
        res.status(500).json({
          error: {
            code: 500,
            message: 'Something went wrong. Please try again later.',
          },
        });
      });
  };
};

  class Forecast {
    constructor(obj) {
        this.name = obj.city_name;
        this.date = obj.valid_date;
        this.moon = obj.moon_phase_lunation;
        this.description = obj.weather.description;
        this.low = obj.low_temp;
        this.high = obj.high_temp;
        this.temp = obj.temp;
        this.ts = obj.ts;
       
    }
}

module.exports= getWeather;