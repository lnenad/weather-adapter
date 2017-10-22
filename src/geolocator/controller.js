const googleGeolocator = require("../adapters/google/google.api"),
    geoTransformer = require("../adapters/google/googleTransformer");

/**
 * Endpoint that handles geolocation for a given city
 *
 * @format {
 *     success: BOOL
 *     data: {
 *         location: OBJECT
 *         location_type: STRING
 *     }
 * }
 *
 * @param req
 * @param res
 * @param next
 */
const locator = function (req, res, next) {
    // Round to 2 decimal places to improve cache hits
    const location = req.query.location ? req.query.location : null;

    if (!location) {
        return res.json({
            status: false,
            data: {
                error: "Missing location parameter in request."
            }
        })
    }

    googleGeolocator.sendRequest(location, function (body) {
        const result = geoTransformer(body), status = !result.error ? 200 : 400;

        res.status(status).json({
            success: !result.error,
            data: result
        });
    });
};

module.exports = {
    locator: locator
};