# Adi Weather Adapter

Node.js adapter used to convert api.openweathermap data to a more readable format.

## Getting Started

Project is hosted on: http://some-digital-ocean-instance-url

## Installing

Ensure Node and NPM are installed and run ```npm install``` to install all dependencies.

Run ```npm start``` to start a local instance. Ensure mongodb is installed and configured on port 27017.

## Running the tests

If I have the time to write tests they will be run using ```npm test```

## API

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

To get weather data for the next 26 hours in 3 hour increments use

| URL | METHOD | QUERY PARAMS |
|-----|--------|--------------|
|/forecast  | GET | lat, long|
|/geolocator | GET | city |


```
GET /forecast?lat=43.3&long=23.3 HTTP/1.1
Host: host.com/
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
