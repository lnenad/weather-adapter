const request = require("request"),
    APIkey = "AIzaSyB6iTXD4aAwG1gBM0jJBPtirZwizqrHgw0",
    host = "https://maps.googleapis.com",
    path = "/maps/api/geocode/json?key=" + APIkey + "&address=";

const sendRequest = function (location, callback) {
    return request({
        url: host + path + location,
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