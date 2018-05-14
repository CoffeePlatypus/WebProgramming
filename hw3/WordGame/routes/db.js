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
 //  if (err) return console.log(err)
 //  db = database.db('database') // whatever your database name is
 //  app.listen(3000, () => {
 //   console.log('listening on 3000')
 // });
});

module.exports = { collection : (name) => db.collection(name) }
