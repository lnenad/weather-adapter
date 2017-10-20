const express = require('express'),
    http = require("http"),
    weather = require("../config/weather.api");
    router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

  weather.sendRequest(3204186, function (body) {
      res.json({success: true, data: JSON.parse(body)})
  });
});

module.exports = router;
