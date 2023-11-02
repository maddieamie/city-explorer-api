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

/*
app.get('/weather', (req, res, next) => {
    res.status(200).send(weatherData);
}) */

app.get('/api/location', async (req, res, next) => {
    try {
        const { searchQuery } = req.query;
        const locationIQApiKey = process.env.VITE_LOCATIONIQ_API_KEY; // Load the LocationIQ API key from an environment variable

        const locationIQResponse = await axios.get(`https://us1.locationiq.com/v1/search?key=${locationIQApiKey}&q=${searchQuery}&format=json`);
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

    const mapIQResponse = await axios.get(`https://maps.locationiq.com/v3/staticmap?key=${locationIQApiKey}&center=${lat},${lon}&zoom=11&size=450x450&format=json&maptype=png&markers=icon:small-purple-cutout|${lat},${lon}`);

    const mapurl = mapIQResponse.data.url;
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

/*
app.get('/api/mapurl', async (req, res, next) => {
    try {
      const { lat, lon } = req.query;
      const locationIQApiKey = process.env.VITE_LOCATIONIQ_API_KEY;
  
      const mapIQResponse = await axios.get(`https://maps.locationiq.com/v3/staticmap?key=${locationIQApiKey}&center=${lat},${lon}&zoom=11&size=450x450&format=png&maptype=png&markers=icon:small-purple-cutout|${lat},${lon}`, {
        responseType: 'arraybuffer', // Tell Axios to treat the response as binary data
      });
  
      const imageBuffer = mapIQResponse.data;
      res.setHeader('Content-Type', 'image/png'); // Set the content type to indicate it's an image
      res.status(200).send(imageBuffer); // Send the binary image data
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({
        error: {
          code: 500,
          message: 'Something went wrong. Please try again later.',
        },
      });
    }
  }); */


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

class Forecast {
    constructor(obj) {
        this.city_name = obj.name;
        this.date = obj.datetime;
        this.icon = obj.weather.icon;
        this.description = obj.weather.description;
        this.low = obj.low_temp;
        this.high = obj.max_temp;
        this.temp = obj.temp;
        
       
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

