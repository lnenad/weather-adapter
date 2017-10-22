# Adi Weather Adapter

Node.js adapter used to convert api.openweathermap data to a more readable format.

## Getting Started

Project is currently hosted on: http://37.139.28.96:3000/

## Installing

Ensure Node and NPM are installed and run ```npm install``` to install all dependencies.

Run ```npm start``` to start a local instance. Ensure mongodb is installed and configured on port 27017.

## Project source directory structure
```
.src
|-- adapters     //Contains adapters and response transformers for different API's
|-- database     //A simple mongodb wrapper
|-- geolocator   //Contains the geolocator controller
|-- routes       //Contains the routes file
|-- weather      //Contains the weather forecast controller
```
## Running the tests

If I have the time to write tests they will be run using ```npm test```

## API

### Full documentation

Documentation is located at: http://docs.adiweather.apiary.io/

### Format

Status codes are used in the following manner. For standard GET requests a successful resolution returns a status code
of 200. For an invalid city provided in the query the API will return 400 indicating a bad client request. If you target
a non-existent endpoint you will receive a 404. And if the server has failed you will receive a 500 status code.

API response is standardized in the following format:
```json
{
    "status": "{bool}",
    "data": "{mixed}"
}
```
Where status indicates if the request was successful and data property contains the actual response data.

### Supported endpoints

To get weather data for the next 5 days in 3 hour increments use the /forecast endpoint.
To get geolocation for the given location use the /geolocator endpoint.

| URL | METHOD | QUERY PARAMS |
|-----|--------|--------------|
|/forecast  | GET | lat, long, refresh|
|/geolocator | GET | location |

For the forecast endpoint results are cached for 3 hours after the last data fetch. To force
a cache reload pass the refresh=true query parameter.

### Example requests

/forecast
```
GET /forecast?lat=43.3&long=23.3&refresh=true HTTP/1.1
Host: 37.139.28.96:3000/
Accept: application/json
Accept-Encoding: gzip, deflate
```

/geolocator
```
GET /geolocator?location=Nuremberg HTTP/1.1
Host: 37.139.28.96:3000/
Accept: application/json
Accept-Encoding: gzip, deflate
```

## Authors

* **Nenad Lukic** - [lnenad](https://github.com/lnenad)

## License

This project is licensed under the MIT License

## Attribution

* OpenWeatherMap API - http://api.openweathermap.org
* WorldWeatherOnline API - http://developer.worldweatheronline.com
* Sunrise Sunset API - https://sunrise-sunset.org
