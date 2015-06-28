var application_root = __dirname,
    express = require('express'),
    path = require('path'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    errorHandler = require('errorhandler'),
    py = require('python-shell'),
    favicon = require('serve-favicon');

var app = express();

app.use(bodyParser.json());
app.use(express.static(path.join(application_root, 'app')));
app.use(errorHandler({ dumpExceptions: true, showStack: true }));
app.use(favicon(path.join(__dirname, 'favicon.ico')));

app.get('/getRoomRegistry', function(req, res) {
	py.run('read_dirs.py', { mode: 'json' }, function (err, results) {
	  	if (err){ 
  	  		throw err;
  	  	}
  	  	res.send(results[0]);
	});
});

app.post('/getRoomInformation', function(req, res) {
    res.send({building: req.body.building, floor: req.body.floor, room: req.body.room});

});

app.post('/getFloorPlan', function(req, res) {

});


app.listen(2627);