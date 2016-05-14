var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: "Chirp", user: req.user, views: req.session});
});

module.exports = router;