'use strict'

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios'); 
const weatherData = require('./data/weather.json');

const app = express();

app.use(cors());

const PORT = process.env.PORT || 3002;

app.get('/', async (request, response, next) => {
    response.status(200).send('Default Route Working');
});


app.get('/api/location', async (req, res, next) => {
    try {
        const { searchQuery } = req.query;
        const locationIQApiKey = process.env.VITE_LOCATIONIQ_API_KEY; // Load the LocationIQ API key from an environment variable

        //const locationIQResponse = await axios.get(`https://us1.locationiq.com/v1/search?key=${locationIQApiKey}&q=${searchQuery}&format=json`);
        const locationIQResponse = await axios.get(`https://us1.locationiq.com/v1/search?q=${searchQuery}&format=json&addressdetails=1&limit=1&normalizeaddress=1&key=${locationIQApiKey}`)
        console.log(locationIQResponse.data);
        res.status(200).json(locationIQResponse.data);

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            error: {
                code: 500,
                message: 'Something went wrong. Please try again later.',
            },
        });
    }
});


app.get('/api/mapurl', async (req, res, next) => {

    try {const { lat, lon } = req.query;
    const locationIQApiKey = process.env.VITE_LOCATIONIQ_API_KEY; 

    const mapIQResponse = await axios.get(`https://maps.locationiq.com/v3/staticmap?key=${locationIQApiKey}&center=${lat},${lon}&zoom=11&size=450x450&format=jpg&maptype=streets&markers=icon:small-purple-cutout|${lat},${lon}`, { responseType: 'stream' });

    const mapurl = mapIQResponse.data.responseUrl;
    console.log(mapurl);
    res.status(200).json(mapurl); 

    
} catch (error) {
    console.error('Error:', error);
    res.status(500).json({
        error: {
            code: 500,
            message: 'Something went wrong. Please try again later.',
        },
    });
}
}); 


app.get('/weather', (req, res, next) => {
    try {
        const { lat, lon, searchQuery } = req.query;

        const latitude = parseFloat(lat);
        const longitude = parseFloat(lon);

        console.log('Search Query:', searchQuery);
        console.log('Latitude:', lat);
        console.log('Longitude:', lon);
        
        const whichcity = weatherData.find((city) => { return city.city_name === searchQuery && lon === lon && lat === lat});

        console.log('Found City:', whichcity);

        if (!whichcity) {
            return res.status(400).json({ error: 'City data only available for Seattle, Paris, or Amman' });
          }

        const formattedData = whichcity.data.map((weather) => new Forecast(weather));
        // throw new Error('Hey this isnt working properly');
        res.status(200).send(formattedData);
    }
    catch (error) {
        next(error);
    }


})

app.get('/weatherbits', (req, res, next) => {
    const { lat, lon } = req.query;
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lon);
  
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
  });
  


  app.get('/movies', (req, res, next) => {
    const { code } = req.query;
  
    console.log('Country Code:', code);
    
  
    const MovieKey = process.env.MOVIE_READ_ACCESS;

  
      axios.get(`https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&region=${code}&sort_by=popularity.desc`, {
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${MovieKey}`
        }
      })
      .then((MovieResponse) => {
        const dataArray = MovieResponse.data.results;
  
        const NowPlayingList = dataArray.map(data => new NowPlaying(data));
        res.status(200).send(NowPlayingList);
      })
      .catch((error) => {
        console.error('Error:', error);
        res.status(500).json({
          error: {
            code: 500,
            message: 'Something went wrong. Please try again later.',
          },
        });
        next(error);
      });
  });


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

class NowPlaying {
    constructor(obj) {
      this.id = obj.id;
      this.language = obj.original_language;
      this.overview = obj.overview;
      this.poster = obj.poster_path;
      this.release_date = obj.release_date;
      this.title = obj.title;
      this.rating = obj.vote_average;
      this.votercount = obj.vote_count;
    }
}


app.use((error, req, res, next) => {
    console.error(error); 
  
    
    res.status(500).json({
      error: {
        code: 500,
        message: 'Something went wrong. Please try again later.',
      },
    });
  });

app.listen(PORT, () => console.log(`listening on ${PORT}`));

