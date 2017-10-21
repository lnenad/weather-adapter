const express = require('express'),
    weatherController = require("../weather/controller"),
    geolocatorController = require("../geolocator/controller"),
    router = express.Router();

router.get('/forecast', weatherController.forecast);
router.get('/geolocator', geolocatorController.locator);

module.exports = router;
