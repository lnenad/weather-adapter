const request = require("request"),
    host = "https://api.sunrise-sunset.org",
    path = "/json?";


const sendRequest = function (lat, long, callback) {
    return request({
        url: host + path + "&lat="+lat+"&lng=" + long,
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