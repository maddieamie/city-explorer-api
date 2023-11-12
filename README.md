

# City Explorer API

**Author**: Maddie Lewis
**Version**: 1.0.6 

## Overview
This server will send data about the cities we are searching. They will be able to see the weather, movies, and information about cities that are requested.

## Getting Started
This runs with Vite, React, and Axios.

## Architecture
<!-- Provide a detailed description of the application design. What technologies (languages, libraries, etc) you're using, and any other relevant design information. -->
In this application, we are using Express, Dotenv, and Cors to get our server up and running. This is using Vite and React, as well as Axios from the time of creation.
See versions of installed libraries below: 
- axios@1.5.1
- cors@2.8.5
- dotenv@16.3.1
- express@4.18.2

## Change Log

10-15-2023 14:00 - Application now has a fully-functional express server, with a GET route for the location resource.

10-15-2023 15:32 - Application can run requests for weather information through to a static weather.json file.  

11-02-2023 14:23 - Server sends its own requests to LocationIQ, WeatherBits, and Movies DB.

11-06-2023 17:00 - Server is set up for both the testing and production environment. 

11-07-2023 14.20 - Application is more modular for future functionality.

11-11-2023 17:57 - Application now has a general cache & a movie data cache, as well as API points for Yelp restaurant data. 


## Credit and Collaborations
Thank you to Code Fellows for the project, especially to Adam & Cameron for their instructive feedback. 
