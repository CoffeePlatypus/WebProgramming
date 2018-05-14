var uuid = require('uuid');
var User = require('./userModel');
var db = require('./db');
var mongo = require('mongodb');
var NUM_USERS = 3; // change if add user

function init(cb) {

  var userDb = [];
  var results = [];

  userDb[0] = new User('bilbo@mordor.org','123123123');
  userDb[1] = new User('frodo@mordor.org','234234234');
  userDb[2] = new User('samwise@mordor.org', '345345345');
  db.collection('users').find().toArray(function(err,users){
    if(users.length != NUM_USERS) {
      userDb.forEach(user => {
        db.collection('users').save(user, (err, result) => {
          if (err) {
            console.log(err);

          }else{
            console.log("user");
          }
          cb(err,result);
        });
      });
    }else{
      cb({ msg : 'ok' });
    }
  });
}
module.exports.init = init;

function updateDefaults(id, defaults, cb) {
  db.collection('users').findOne({ '_id' : new mongo.ObjectID(id) }, function(err, user) {
    user.default = defaults;
    db.collection('users').update(  { '_id' : new mongo.ObjectID(id) }, {$set : user}, function(err, upgame) {
      cb(err, user);
    });
  });
}
module.exports.updateDefaults = updateDefaults;

function getDefaults(id, cb) {
  db.collection('users').findOne({ '_id' : new mongo.ObjectID(id) }, function(err, user) {
    cb(err,user.default);
  });
}
module.exports.getDefaults = getDefaults;

function findByEmail( email, cb ) {
  //console.log("findByEmail");
   db.collection('users').findOne({email : email}, function(err,user){
     user = user && { email : user.email, id : user._id, password : user.password };
     cb(err,user);
   });
}
module.exports.findByEmail = findByEmail;
