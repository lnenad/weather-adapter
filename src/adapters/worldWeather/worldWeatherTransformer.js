const transformer = function (input) {
    const weather = input.data && input.data.weather ? input.data.weather : [];

    return weather.map(function (item) {
        return {
            data: item.hourly.map(function (hourly) {
                return {
                    precipitationMM: hourly.precipMM,
                    weather: {
                        description: hourly.weatherDesc[0].value,
                        icon: {
                            url: hourly.weatherIconUrl[0].value
                        }
                    }
                }
            })
        }
    })
};

module.exports = transformer;