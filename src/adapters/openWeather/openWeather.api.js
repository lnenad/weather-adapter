const request = require("request"),
    APIKey = "5dc0281e7a74f8caa67b7407e4c94cc7",
    units = "metric",
    host = "http://api.openweathermap.org",
    path = "/data/2.5/forecast?appid="+APIKey+"&units="+units;

const sendRequest = function (lat, lng, callback) {
    return request({
        url: host + path + "&lat=" + lat + "&lon=" + lng,
        method: "GET"
    }, function (error, response, body) {
        if (!error && response.statusCode < 299) {
            var parsedBody;

            try {
                parsedBody = JSON.parse(body);
            } catch (err) {
                console.error("Unable to parse response body", JSON.stringify(body));
                throw err;
            }

            return callback(parsedBody);
        }

        throw error;
    });
};

module.exports = {
    host: host,
    sendRequest: sendRequest
};