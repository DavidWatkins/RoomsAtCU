// Retrieve
var MongoClient = require('mongodb').MongoClient;

function populateDB(data) {

}

function returnBuildings(res) {
	MongoClient.connect("mongodb://localhost:27017/roomsatcu", function(err, db) {
		if(err) return console.dir(err); 
		res.send(db.buildings.distinct("buildingName"));
	}
}

function returnFloors(res, buildingName) {

}

function returnRooms(res, building-floor-id) {

}

function putReview(review) {

}

// Connect to the db
MongoClient.connect("mongodb://localhost:27017/roomsatcu", function(err, db) {
  if(err) { return console.dir(err); }

  db.collection('test', function(err, collection) {});

  db.collection('test', {w:1}, function(err, collection) {});

  db.createCollection('test', function(err, collection) {});

  db.createCollection('test', {w:1}, function(err, collection) {});
});