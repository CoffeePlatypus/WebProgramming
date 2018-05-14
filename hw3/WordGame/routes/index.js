var express = require('express');
var router = express.Router();
var uuid = require('uuid');
var users = require('./users');
var meta = require('./meta');
var games = require('./games');

var sessionGames = [];

/////////////////////Routes/////////////////////////
/* GET home page. */
router.get('/wordgame', function(req, res, next) {
  res.sendFile( 'index.html', { root : __dirname + "/../public" } );
});

// added -> init users
router.get('/wordgame/api/v2/init', function(req,res,next) {
  games.readDictionary();
  users.init( (err, result) => {
    if(req.session.user) {
      res.json( req.session.user );
    }
  });
});

// login endpoint
router.post('/wordgame/api/v2/login',function(req,res,next){
  req.session.regenerate(function(err){
    users.findByEmail( req.body.email, function(err,user){
      if(user && user.password == req.body.password) {
        req.session.user = user;
        delete user.password;
        res.send( user );
      }else{
        res.send({msg : "Error: invalid user or password"});
      }
    });
  });
});

// logout endpoints
router.post('/wordgame/api/v2/logout', function(req,res,next){
  req.session.regenerate( function(err) { // create a new session id
    res.json( { msg : 'ok' } );
  } );
});

// update user defaults
router.put('/wordgame/api/v2/:userid/defaults',function(req,res,next){
  users.updateDefaults(req.params.userid, req.body, function(err, user){
    res.send(user);
  });
});

// GET metadata
router.get('/wordgame/api/v2/:userid/meta', function(req, res, next) {
  users.getDefaults(req.params.userid, function(err, def) {
    var result = {};
    result.default = def;
    result.levels = ["easy", "medium", "hard"];
    // result.fonts = meta.getFonts();
    res.send(result);
  });
});

// GET fonts
router.get('/wordgame/api/v2/meta/fonts', function(req, res, next) {
  var fonts = meta.getFonts();
  res.send(fonts);
});

// GET games
router.get('/wordgame/api/v2/:userid', function(req, res, next) {
  games.findGames(req.userid, function(err, games){
    if(err) {
      res.status( 500 ).send( { 'msg' : 'Error retriving games' } );
    }
    res.send(games);
  });
});

// Post // Make Game
router.post('/wordgame/api/v2/:userid', function(req, res, next) {
  games.makeGame(req.params.userid, req.query.level, req.body, req.headers["x-font"], function(err,game) {
    if(err) {
      res.status( 500 ).send( { 'msg' : 'Error creating game' } );
    }
    res.send(game);
  } );
  //game = new ResponseGame(game);

});

// Get Game
router.get('/wordgame/api/v2/:userid/:gid', function(req, res, next) {
  games.findGame(req.params.gid, function(err, game){
    if (err) {
      res.status( 500 ).send( { 'msg' : 'Error retriving game' } );
    }
    res.send(game);
  });
});

// Make guess
router.post('/wordgame/api/v2/:userid/:gid/guesses', function(req, res, next) {
  games.guess(req.query.guess, req.params.gid, function(err, game){
    if (err) {
      res.status( 500 ).send( { 'msg' : 'Error retriving game' } );
    }
    res.send(game);
  });
});

module.exports = router;
