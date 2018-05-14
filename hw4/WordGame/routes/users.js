var uuid = require('uuid');
var User = require('./userModel');
var db = require('./db');
var mongo = require('mongodb');
var bcrypt = require('bcrypt-nodejs');
var NUM_USERS = 2; // change if add user

function init(cb) {

    var userDb = [];
    var results = [];

    userDb[0] = new User('a@b.com',bcrypt.hashSync('123'),'Bilbo','Baggins','ADMIN',true);
    userDb[1] = new User('b@c.com',bcrypt.hashSync('1234'),'Frodo','Baggins','USER',true);
    db.collection('users').find().toArray(function(err,users){
        if(users.length < NUM_USERS){
            console.log("Make starting users");
            userDb.forEach(user => {
                db.collection('users').save(user);
            });
        }
        console.log("send okay")
        cb(err, { msg : 'ok' });
    });
}
module.exports.init = init;

function createUser(user, cb) {
    db.collection('users').find({email : user.email}).toArray(function(err,users){
        if(users.length > 0) {
            // error duplicate email
            console.log("duplicate email");
            cb(err,{alert : "User must have unique email"});
        }else{
            console.log("add new user")
            user.password = bcrypt.hashSync(user.password);
            user.name = JSON.parse(user.name);
            user.enabled = user.enabled == "true"  ? true : false;
            db.collection('users').save(user, function(err,result) {
                db.collection('users').findOne({email : user.email},function(err,newUser) {
                    console.log(newUser);
                    newUser.id = newUser._id;
                    delete newUser._id;
                    delete newUser.password;
                    cb(err,newUser);
                });
            });
        }
    });
}
module.exports.createUser = createUser;

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

function getUserList(q, cb) {
    db.collection('users').find().toArray(function(err,users) {
        var result = [];
        for(var x in users) {
            if(users[x].email.indexOf(q) > -1 || users[x].name.first.indexOf(q) > -1 || users[x].name.last.indexOf(q) > -1) {
                users[x].id = users[x]._id;
                delete users[x]._id;
                delete users[x].password;
                result.push(users[x]);
            }
        }
        cb(err,result);
    });
}
module.exports.getUserList = getUserList;

function updateUser(id, enabled, role, cb) {
    console.log("update user "+id);
    db.collection('users').findOne({ '_id' : new mongo.ObjectID(id) }, function(err, user) {
        console.log(user);
        user.enabled = (enabled == "true") ? true : false;
        user.role = role;
        console.log("updated user");
        console.log(user);
        db.collection('users').update({'_id' : new mongo.ObjectID(user._id)}, {$set : user}, function(err, upuser) {
            cb(err,user);
        });
    });
}
module.exports.updateUser = updateUser;

function findById(id, cb) {
    db.collection('users').findOne({ '_id' : new mongo.ObjectID(id) }, function(err, user) {
        user.id = user._id;
        cb(err,user);
    });
}
module.exports.findById = findById;

function findByEmail( email, cb ) {
    //console.log("findByEmail");
    db.collection('users').findOne({email : email}, function(err,user){
        user = user && { email : user.email, id : user._id, password : user.password, name : user.name, enabled : user.enabled, role : user.role };
        cb(err,user);
    });
}
module.exports.findByEmail = findByEmail;
