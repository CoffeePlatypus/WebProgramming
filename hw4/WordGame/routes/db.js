//requiring mongodb causes problems

var mongoClient = require('mongodb').MongoClient;
var User = require('./userModel');
var users = require('./users');
var db;

// Initialize the database
mongoClient.connect("mongodb://localhost:27017", function(err, database) {
  console.log("mongo connected");
  if(err) throw err;
  db = database.db("games");
});

module.exports = { collection : (name) => db.collection(name) }
