var express = require('express');
var router = express.Router();

router.get('/register', function (req, res, next) {
  res.render('account-create');
});

router.get('/login', function (req, res, next) {
  res.render('login');
});

router.get('/password/forget', function (req, res, next) {
  res.render('password-change');
});

module.exports = router;
