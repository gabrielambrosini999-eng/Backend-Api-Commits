var express = require('express');
var router = express.Router();

router.get('/organizations', function(req, res, next) {
    const organizations = [
        {id: 1, name : "Icaro"},
        {id: 2, name : "Icaro"},
        {id: 3, name : "Icaro"},
        {id: 4, name : "Icaro"},
    ];

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
