const transformer = function (input) {
    const list = input.list ? input.list : [];

    return list.map(function (item) {
        return {
            units: "celsius",
            temperature: {
                current: item.main.temp,
                max: item.main.temp_max,
                min: item.main.temp_min
            },
            wind: item.wind,
            timestamp: item.dt,
            humanTimestamp: (new Date(item.dt * 1000)).toString()
        }
    })
};

module.exports = transformer;