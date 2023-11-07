'use strict'
const axios = require('axios')


function getMovies (req, res, next) {
    const { searchQuery } = req.query;
  
    console.log('City:', searchQuery);
    
  
    const MovieKey = process.env.MOVIE_KEY;
    const url = `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&city=${searchQuery}&sort_by=popularity.desc&api_key=${MovieKey}`

  
      axios.get(url)
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
  };

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