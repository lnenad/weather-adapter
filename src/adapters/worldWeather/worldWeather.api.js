const request = require("request"),
    APIKey = "3ac05726525b4fc6a6c133256172110",
    host = "http://api.worldweatheronline.com",
    path = "/premium/v1/weather.ashx?key="+APIKey;


const sendRequest = function (lat, lng, callback) {
    return request({
        url: host + path + "&num_of_days=5&tp=3&format=json&q=" + lat + "," + lng,
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