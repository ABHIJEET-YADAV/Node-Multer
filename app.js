var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var path = require('path');
var routes = require('./routes/imagefile');

app.use(bodyParser.json());

app.use('/', routes);
app.use('/pre', routes);
app.listen(3000);
console.log('Running on port 3000');