'use strict'

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios'); 
const weatherData = require('./data/weather.json');

const getMap = require('./modules/map');
const getWeather = require('./modules/weather');
const getMovies = require('./modules/movies');
const getFood = require('./modules/food');

const app = express();

app.use(cors());

const PORT = process.env.PORT || 3002;

app.get('/', async (request, response, next) => {
    response.status(200).send('Default Route Working');
});


app.get('/api/location', async (req, res, next) => {
    
        const { searchQuery } = req.query;
        const locationIQApiKey = process.env.VITE_LOCATIONIQ_API_KEY; // Load the LocationIQ API key from an environment variable

       
        axios.get(`https://us1.locationiq.com/v1/search?q=${searchQuery}&format=json&addressdetails=1&limit=1&normalizeaddress=1&key=${locationIQApiKey}`)
        .then((locationIQResponse)=> {
            console.log(locationIQResponse.data);
            res.status(200).json(locationIQResponse.data);})
        .catch((error) => {
        console.error('Error:', error);
        res.status(500).json({
            error: {
                code: 500,
                message: 'Something went wrong. Please try again later.',
            },
        });
        })
})

app.get('/api/mapurl', getMap)

app.get('/weatherbits', getWeather)

app.get('/movies', getMovies)

app.get('/food', getFood)

/*
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


}) */ 


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

