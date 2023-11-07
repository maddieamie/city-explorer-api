'use strict'
const axios = require('axios')

function getWeather (req, res, next) {
    const { lat, lon } = req.query;
  
    console.log('Latitude:', lat);
    console.log('Longitude:', lon);
  
    const WeatherAPIKey = process.env.WEATHER_API_KEY;
  
    axios.get(`https://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lon}&key=${WeatherAPIKey}`)
      .then((WeatherBitsResponse) => {
        console.log(typeof WeatherBitsResponse.data.data);
        const dataArray = WeatherBitsResponse.data.data;
  
        const forecasts = dataArray.map(data => new Forecast(data));
        res.status(200).send(forecasts);
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