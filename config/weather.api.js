const request = require("request"),
    APIKey = "5dc0281e7a74f8caa67b7407e4c94cc7",
    units = "metric",
    host = "http://api.openweathermap.org";
    path = "/data/2.5/forecast?appid="+APIKey+"&units="+units;

const sendRequest = function (id, callback) {
    return request({
        url: host + path + "&id=" + id,
        method: "GET"
    }, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            // Print out the response body
        }
        console.log(arguments);

        callback(body);
    });
};

module.exports = {
    host: host,
    sendRequest: sendRequest
};