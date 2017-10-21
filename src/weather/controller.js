const openWeather = require("../adapters/openWeather/openWeather.api"),
    worldWeather = require("../adapters/worldWeather/worldWeather.api"),
    sunriseSunset = require("../adapters/sunriseSunset/sunriseSunset.api"),
    openWeatherTransformer = require("../adapters/openWeather/openWeatherTransformer"),
    sunriseSunsetTransformer = require("../adapters/sunriseSunset/sunriseSunsetTransformer"),
    worldWeatherTransformer = require("../adapters/worldWeather/worldWeatherTransformer");

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
 * @param next
 */
const forecast = function (req, res, next) {
    // Round to 2 decimal places to improve cache hits
    const lat = req.query.lat ? parseFloat(req.query.lat).toFixed(2) : null,
        long = req.query.long ? parseFloat(req.query.long).toFixed(2) : null;

    if (!lat || !long) {
        return res.json({
            status: false,
            data: {
                error: "Missing latitude or longitude parameter in request."
            }
        })
    }

    openWeather.sendRequest(lat, long, function (body) {
        const openWeatherData = openWeatherTransformer(body);
        worldWeather.sendRequest(lat, long, function (body) {
            const worldWeatherData = worldWeatherTransformer(body);
            sunriseSunset.sendRequest(lat, long, function (body) {
                const sunriseSunsetData = sunriseSunsetTransformer(body),
                    hourlyData = joinData(openWeatherData, worldWeatherData);

                res.json({
                    success: true,
                    data: {
                        sunriseSunset: sunriseSunsetData,
                        hourlyForecast: hourlyData
                    }
                })
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
joinData = function(openWeatherData, worldWeatherData) {
    var toReturn = [];

    worldWeatherData = [].concat.apply([],worldWeatherData.map(function (item) {
        return item.precipMM;
    }));

    worldWeatherData.forEach(function(val, i) {
        if (!openWeatherData[i]) {
            // This should never happen but as i don't have enough time to test this is a failsafe
            openWeatherData[i] = "0.0";
        }
        toReturn.push(Object.assign({}, openWeatherData[i], {precipitation: worldWeatherData[i]}));
    });

    return toReturn;
};

module.exports = {
    forecast: forecast
};