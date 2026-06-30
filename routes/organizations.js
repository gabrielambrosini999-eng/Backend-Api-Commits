var express = require('express');
var router = express.Router();

router.get('/organizations', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/organizations/:name', function (req, res, next) {
    res.send(req.params.name)
});

router.post('/organizations', function (req, res, next) {
    res.send('Created')
})

router.put('/organizations/:id', function (req, res, next) {
    res.send('Edited')
})

router.delete('/organizations/:id', function (req, res, next) {
    res.send('Deleted')
})

module.exports = router;
