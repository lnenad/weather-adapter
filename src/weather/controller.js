const openWeather = require("../adapters/openWeather/openWeather.api"),
    worldWeather = require("../adapters/worldWeather/worldWeather.api"),
    sunriseSunset = require("../adapters/sunriseSunset/sunriseSunset.api"),
    openWeatherTransformer = require("../adapters/openWeather/openWeatherTransformer"),
    sunriseSunsetTransformer = require("../adapters/sunriseSunset/sunriseSunsetTransformer"),
    worldWeatherTransformer = require("../adapters/worldWeather/worldWeatherTransformer"),
    mongoDB = require("../database/mongodb"),
    cacheValid = 60 * 60 * 3; // Cache is valid for 3 hours

/**
 * Endpoint that handles weather forecast for the next 5 days in 3 hour increments
 *
 * @format {
 *     success: BOOL
 *     data: {
 *         sunriseSunset: OBJECT
 *         hourlyForecast: ARRAY
 *     }
 * }
 *
 * @param req
 * @param res
 */
const forecast = function (req, res) {
    // Round to 2 decimal places to improve cache hits
    const lat = req.query.lat ? parseFloat(req.query.lat).toFixed(2) : null,
        long = req.query.long ? parseFloat(req.query.long).toFixed(2) : null;

    if (lat === null || long === null) {
        return res.json({
            status: false,
            data: {
                error: "Missing latitude or longitude parameter in request."
            }
        })
    }

    mongoDB.get({
        location: {
            latitude: lat,
            longitude: long
        }
    }, function (documents, err) {
        if (err) {
            console.log("Error fetching documents", err, documents);

            return res.json({
                success: false,
                data: {
                    error: err
                }
            });
        }

        const cached = documents[0] ? documents[0] : null, currentTimestamp = Math.round(Date.now() / 1000);

        if (cached && (currentTimestamp - cached.timestamp) < cacheValid) {
            delete cached._id;

            return res.json({
                success: true,
                data: cached
            });
        }

        openWeather.sendRequest(lat, long, function (body) {
            const openWeatherData = openWeatherTransformer(body);

            if (openWeatherData.error) {
                return res.json({
                    success: false,
                    error: openWeatherData.error
                })
            }
            worldWeather.sendRequest(lat, long, function (body) {
                const worldWeatherData = worldWeatherTransformer(body);

                if (worldWeatherData.error) {
                    return res.json({
                        success: false,
                        error: worldWeatherData.error
                    })
                }
                sunriseSunset.sendRequest(lat, long, function (body) {
                    const sunriseSunsetData = sunriseSunsetTransformer(body),
                        hourlyData = joinData(openWeatherData, worldWeatherData);

                    if (sunriseSunsetData.error) {
                        return res.json({
                            success: false,
                            error: sunriseSunsetData.error
                        })
                    }

                    const returnData = {
                        location: {
                            latitude: lat,
                            longitude: long
                        },
                        sunriseSunset: sunriseSunsetData,
                        hourlyForecast: hourlyData
                    }, saveData = Object.assign({}, returnData, {timestamp: Math.round(Date.now() / 1000)});

                    mongoDB.createOrUpdate(saveData, cached, function (result, err) {
                        if (err) {
                            return res.json({
                                success: false,
                                data: {
                                    error: err.toString()
                                }
                            });
                        }

                        res.json({
                            success: true,
                            data: returnData
                        });
                    });


                });
            });
        });
    });
};

/**
 * Method will join precipitation data from world weather API to the hourly forecast from
 * open weather API
 *
 * @param openWeatherData
 * @param worldWeatherData
 * @returns {Array}
 */
joinData = function (openWeatherData, worldWeatherData) {
    var toReturn = [];

    worldWeatherData = [].concat.apply([], worldWeatherData.map(function (item) {
        return item.data;
    }));

    worldWeatherData.forEach(function (val, i) {
        if (!openWeatherData[i]) {
            // This should never happen but as i don't have enough time to test this is a failsafe
            openWeatherData[i] = "0.0";
        }
        toReturn.push(Object.assign({}, openWeatherData[i], worldWeatherData[i]));
    });

    return toReturn;
};

module.exports = {
    forecast: forecast
};