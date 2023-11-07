'use strict'
const axios = require('axios')


function getMap (req, res, next) {
    const { lat, lon } = req.query;
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lon);
    
    const locationIQApiKey = process.env.VITE_LOCATIONIQ_API_KEY;

    axios.get(`https://maps.locationiq.com/v3/staticmap?key=${locationIQApiKey}&center=${latitude},${longitude}&zoom=11&size=450x450&format=jpg&maptype=streets&markers=icon:small-purple-cutout|${latitude},${longitude}`, { responseType: 'stream' })
        .then((mapIQResponse) => {
            const mapurl = mapIQResponse.data.responseUrl;
            //console.log(mapurl);
            res.status(200).json(mapurl);
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

module.exports = getMap;