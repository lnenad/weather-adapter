const express = require('express'),
    weatherController = require("../weather/controller");
    router = express.Router();

/* GET home page. */
router.get('/forecast', weatherController.forecast);

module.exports = router;
