'use strict'
const axios = require('axios')
const cache = require('./cache');


function getFood (req, res, next) {
    const { lat, lon } = req.query;
  
    console.log('Lat & Lon:', lat, lon);
    const key = 'City Searched: ' + lat + lon;
    
  
    const YelpKey = process.env.YELP_KEY;
    const url = `https://api.yelp.com/v3/businesses/search?latitude=47.6061&longitude=-122.3328&term=restaurants&radius=7000&open_now=true&sort_by=best_match&limit=20`

    if (cache[key] && (Date.now() - cache[key].timestamp < 1800000)) {
      console.log('cache hit - sending data from cache')
      res.status(200).send(cache[key].data)
      //cache hit for 1 day of time, 60000 is one minute
    }
    else {
    console.log('cache miss - making a new request')
      axios.get(url, {
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${YelpKey}`
        }})
      .then((FoodResponse) => {
        console.log(FoodResponse);
        const dataArray = FoodResponse.data.businesses;
        const FoodList = dataArray.map(data => new Food(data));
        return FoodList;
      })
      .then(FoodList => {
        cache[key] = {};
        cache[key].data = FoodList;
        cache[key].timestamp = Date.now()
        res.status(200).send(FoodList)})
       
      
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
  };
}
  class Food{
    constructor(obj) {
      this.id = obj.id;
      this.name = obj.name;
      this.img = obj.image_url;
      this.yelp = obj.url;
      this.rating = obj.rating;
      this.price = obj.price;
      this.reviewcount = obj.review_count;
      this.address = obj.location.display_address.join('  ');
      this.phone = obj.display_phone;
      this.categories = obj.categories.map(category => category.title).join(' | ');
    }
}

module.exports = getFood;