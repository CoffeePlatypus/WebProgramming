var express = require('express');
var router = express.Router();
var uuid = require('uuid');
var users = require('./users');
var meta = require('./meta');
var games = require('./games');
var bcrypt = require('bcrypt-nodejs');

var csrf;

/////////////////////Routes/////////////////////////
/* GET home page. */
router.get('/wordgame', function(req, res, next) {
    res.sendFile( 'index.html', { root : __dirname + "/../public" } );
});

// added -> init users
router.get('/wordgame/api/v3/init', function(req,res,next) {
    games.readDictionary();
    csrf = uuid();
    users.init( (err, result) => {
        if(req.session.user) {
            res.header("csrf", csrf);
            res.json( req.session.user );
        }else{
            res.send(result);
        }
    });
});

// login endpoint - bad req if not email or password
router.post('/wordgame/api/v3/login',function(req,res,next){
    if(req.body.email && req.body.password) {
        req.session.regenerate(function(err){
            users.findByEmail( req.body.email, function(err,user){
                console.log("check login");
                console.log(user);
                if(user && bcrypt.compareSync(req.body.password , user.password) && user.enabled) {
                    res.header("csrf", csrf);
                    req.session.user = user;
                    delete user.password;
                    res.send( user );
                }else{
                    res.send({msg : "Error: invalid user or password"});
                }
            });
        });
    }else{
        res.status('400').send({error: "Bad Request"});
    }
});

// logout endpoints
router.post('/wordgame/api/v3/logout', function(req,res,next) {
    req.session.regenerate( function(err) { // create a new session id
        res.json( { msg : 'ok' } );
    } );
});

// GET userlist - ADMIN - bad req if no admin id
router.get('/wordgame/api/v3/admins/:adminid/users', function(req,res,next) {
    if(req.params.adminid) {
        users.findById(req.params.adminid, function(err,user){
            if(user.role == "ADMIN") {
                users.getUserList(req.query.q, function(err,result){
                    res.send(result);
                });
            }else{
                res.status('403').send({error: "Admin access only :P"});
            }
        });
    }else{
        res.status('400').send({error: "Bad Request"});
    }
});

// POST user - ADMIN - error if no body or missing email and password
router.post('/wordgame/api/v3/admins/:adminid/user/', function(req,res,next){
    console.log(req.body);
    if(req.params.adminid && req.body && req.body.name && req.body.password && req.body.email) {
        users.findById(req.params.adminid, function(err,user){
            if(user.role == "ADMIN") {
                users.createUser(req.body, function(err, user){
                    res.send(user);
                });
            }else{
                res.status('403').send({error: "Admin access only :P"});
            }
        });
    }else{
        res.status('400').send({error: "Bad Request"});
    }
});

// GET user - ADMIN - bad req if no admin or userid
router.get('/wordgame/api/v3/admins/:adminid/user/:userid', function(req,res,next) {
    if(req.params.adminid && req.params.userid) {
        users.findById(req.params.adminid, function(err,user){
            if(user.role == "ADMIN") {
                users.findById(req.params.userid, function(err,result){
                    delete result.password;
                    res.send(result);
                });
            }else{
                res.status('403').send({error: "Admin access only :P"});
            }
        });
    }else{
        res.status('400').send({error: "Bad Request"});
    }
});

// update user - ADMIN - bad req if no admin or userid - this is may be problem method
router.put('/wordgame/api/v3/admins/:adminid/user/:uid', function(req,res,next) {
    console.log("gonna update "+req.params.uid);
    console.log(req.body);
    if(req.params.adminid && req.params.uid && req.body) {
        users.findById(req.params.adminid, function(err,user){
            if(user.role == "ADMIN" && req.params.uid != user.id ) {
                console.log("can update user");
                users.updateUser(req.params.uid, req.body.enabled, req.body.role, function(err, u2){
                    res.send(u2);
                });
            }else{
                res.status('403').send({error: "Invalid permission for updating user"});
            }
        });
    }else{
        res.status('400').send({error: "Bad Request"});
    }
});

// update user defaults - bad req if no userid or body
router.put('/wordgame/api/v3/:userid/defaults',function(req,res,next){
    if(req.params.userid && req.body) {
        users.updateDefaults(req.params.userid, req.body, function(err, user){
            res.send(user);
        });
    }else{
        res.status('400').send({error: "Bad Request"});
    }
});

// GET metadata - bad req if no userid
router.get('/wordgame/api/v3/:userid/meta', function(req, res, next) {
    if(req.params.userid) {
        users.getDefaults(req.params.userid, function(err, def) {
            var result = {};
            result.default = def;
            result.levels = ["easy", "medium", "hard"];
            res.send(result);
        });
    }else{
        res.status('400').send({error: "Bad Request"});
    }
});

// GET fonts - is this even used anymore
router.get('/wordgame/api/v3/meta/fonts', function(req, res, next) {
    var fonts = meta.getFonts();
    res.send(fonts);
});

// GET games - bad req if no userid
router.get('/wordgame/api/v3/:userid', function(req, res, next) {
    if(req.params.userid) {
        games.findGames(req.userid, function(err, games){
            if(err) {
                res.status( 500 ).send( { 'msg' : 'Error retriving games' } );
            }
            res.send(games);
        });
    }else{
        res.status('400').send({error: "Bad Request"});
    }
});

// Post // Make Game - bad req if misssing stuff to make game
router.post('/wordgame/api/v3/:userid', function(req, res, next) {
    if(req.params.userid && req.query.level && req.body && req.headers["x-font"]) {
        games.makeGame(req.params.userid, req.query.level, req.body, req.headers["x-font"], function(err,game) {
            if(err) {
                res.status( 500 ).send( { 'msg' : 'Error creating game' } );
            }
            res.send(game);
        });
    }else{
        res.status('400').send({error: "Bad Request"});
    }
});

// Get Game
router.get('/wordgame/api/v3/:userid/:gid', function(req, res, next) {
    if(req.params.gid) {
        games.findGame(req.params.gid, function(err, game){
            if (err) {
                res.status( 500 ).send( { 'msg' : 'Error retriving game' } );
            }
            res.send(game);
        });
    }else{
        res.status('400').send({error: "Bad Request"});
    }
});

// Make guess
router.post('/wordgame/api/v3/:userid/:gid/guesses', function(req, res, next) {
    if(req.params.gid && req.query.guess) {
        games.guess(req.query.guess, req.params.gid, function(err, game){
            if (err) {
                res.status( 500 ).send( { 'msg' : 'Error retriving game' } );
            }
            res.send(game);
        });
    }else{
        res.status('400').send({error: "Bad Request"});
    }
});

module.exports = router;
