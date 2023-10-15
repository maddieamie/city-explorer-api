'use strict'

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const weatherData = require('./data/weather.json');

const app = express();

app.use(cors());

const PORT = process.env.PORT || 3002;

app.get('/', (request, response, next) => {
    response.status(200).send('Default Route Working');
});

/*
app.get('/weather', (req, res, next) => {
    res.status(200).send(weatherData);
}) */


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
        this.description = obj.weather.description;
       
    }
}


app.use((error, req, res, next) => {
    res.status(500).send(error.message);
})

app.listen(PORT, () => console.log(`listening on ${PORT}`));