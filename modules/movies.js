'use strict'
const axios = require('axios')
const cache = require('./moviecache');


function getMovies (req, res, next) {
    const { searchQuery } = req.query;
  
    console.log('City:', searchQuery);
    const key = 'City Searched: ' + searchQuery;
    
  
    const MovieKey = process.env.MOVIE_KEY;
    const url = `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&city=${searchQuery}&sort_by=popularity.desc&api_key=${MovieKey}`

    if (cache[key] && (Date.now() - cache[key].timestamp < 604800000)) {
      console.log('cache hit - sending data from cache')
      res.status(200).send(cache[key].data)
      //cache hit for 1 day of time, 60000 is one minute
    }
    else {
    console.log('cache miss - making a new request')
      axios.get(url)
      .then((MovieResponse) => {
        const dataArray = MovieResponse.data.results;
        const NowPlayingList = dataArray.map(data => new NowPlaying(data));
        return NowPlayingList;})

      .then(NowPlayingList => {
        cache[key] = {};
        cache[key].data = NowPlayingList;
        cache[key].timestamp = Date.now()
        res.status(200).send(NowPlayingList)})  
      
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

module.exports = getMovies;