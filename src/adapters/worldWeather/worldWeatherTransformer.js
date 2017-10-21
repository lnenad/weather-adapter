const transformer = function (input) {
    const weather = input.data && input.data.weather ? input.data.weather : [];

    return weather.map(function (item) {
        return {
            precipMM: item.hourly.map(function (hourly) {
                return hourly.precipMM
            })
        }
    })
};

module.exports = transformer;