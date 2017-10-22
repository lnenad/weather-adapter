const transformer = function (input) {
    const results = input.results ? input.results : [], //5:07:13 AM
        today = (new Date).toDateString() + " ",
        sunrise = new Date(today + results.sunrise + " GMT+0000"),
        sunset = new Date(today + results.sunset + " GMT+0000");

    if (isNaN(sunrise.getTime()) || isNaN(sunset.getTime())) {
        console.log("Unable to parse service response", JSON.stringify(input));

        return {
            error: "Unable to parse service response"
        }
    }

    return {
        sunrise: {
            timestamp: Math.round(sunrise.getTime() / 1000),
            humanTimestamp: sunrise.toString()
        },
        sunset: {
            timestamp: Math.round(sunset.getTime() / 1000),
            humanTimestamp: sunset.toString()
        }
    };
};

module.exports = transformer;