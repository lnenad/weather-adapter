const transformer = function (input) {
    const results = input.results && input.results[0] ? input.results[0] : null;

    if (!results) {
        return {
            error: input.status
        }
    }

    return {
        location: results.geometry.location,
        location_type: results.geometry.location_type
    };
};

module.exports = transformer;