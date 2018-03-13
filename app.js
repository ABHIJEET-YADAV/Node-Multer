var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var path = require('path');
app.use(bodyParser.json());
 
var routes = require('./routes/imagefile');
 
var mongoDB = 'mongodb://127.0.0.1/multer_db';
mongoose.connect(mongoDB);
 
app.use('/', routes);
 
app.get('/images', function(req, res) {
routes.getImages(function(err, genres) {
if (err) {
throw err;
 
}
res.json(genres);
 
});
});

app.get('/images/:id', function(req, res) {
routes.getImageById(req.params.id, function(err, genres) {
if (err) {
throw err;
}
res.send(genres.path)
});
});
 
app.listen(3000);
 
console.log('Running on port 3000');