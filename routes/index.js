var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
  // OK to act as a health check for aws  
  res.send('OK');
});

router.get('/health', function (req, res, next) {
  res.send('OK');
});

module.exports = router;
