var rin = require('fs');
var os = require('os');
var Game = require('./gameModel');
var db = require('./db');
var mongo = require('mongodb');

var dictionary = [];

function readDictionary() {
  var dict = rin.readFileSync("./routes/wordlist.txt","utf8");
  dictionary = dict.split(os.EOL);
}
module.exports.readDictionary = readDictionary;

function ResponseGame(game, tar) {
  this.gid = game._id || game.id;
  this.userid = game.userid;
  this.font = game.font;
  this.level = game.level.name;
  this.colors = game.colors;
  this.guesses = game.guesses;
  this.view = game.view;
  this.status = game.status;
  this.remaining = game.remaining;
  if(game.status != "unfinished") {
    this.target = game.target;
  }
}

function getWord(level) {
  var word = "";
  while(word.length > level.maxLenght || word.length < level.minLength) {
    word = dictionary[Math.floor(Math.random() * dictionary.length)];
  }
  return word;
}

function getView(target,guesses) {
  var tar = target.split("");
  var view = "";
  tar.forEach(x=>{
    if(guesses.indexOf(x)>-1) {
      view+=x;
    }else{
      view+="_";
    }
  });
  return view;
}

function getLevel(level) {
  if(level == "easy") {
    return {name: "easy", minLength : 3, maxLength : 5, rounds : 8 };
  }else if(level == "medium") {
    return {name: "medium", minLength : 4, maxLength : 10, rounds : 7 };
  }else{
    return {name: "hard", minLength : 9, maxLength : 300, rounds : 6 };
  }
}

function makeGuess(game, guess) {
  guess = guess.toUpperCase();
  if(game.guesses.indexOf(guess)>-1) {
    return "Invalid Guess. Already Guessed.";
  }
  game.guesses+=guess;
  game.view = getView(game.target, game.guesses);
  if(game.target.indexOf(guess)<0) {
    game.remaining--;
  }
  if(game.remaining == 0){
    game.status = "loss";
  }else if(game.target == game.view) {
    game.status = "victory";
  }
  return game;
}

function findGames(userId, cb, tar) {
  db.collection('games').find().toArray(function(err,games){
    var result = [];
    for( var x in games ) {
      //console.log(games[x]);
      result.push( new ResponseGame(games[ x ]) );
    }
    cb(err,result);
  });
}
module.exports.findGames = findGames;

function findGame(gid, cb) {
  db.collection('games').findOne({"_id" : new mongo.ObjectID(gid) },function(err,game){
    cb(err,new ResponseGame(game));
  });
}
module.exports.findGame = findGame;

function findGameWithTar(gid, cb) {
  console.log("finding game "+gid);
  db.collection('games').findOne({"_id" : new mongo.ObjectID(gid) },function(err,game){
    game.id = game["_id"];
    delete game._id;
    cb(err,game);
  });
}

function guess(guess, gid, cb) {
  findGameWithTar(gid, function(err, game){
    game = makeGuess(game, guess);
    if(typeof(game) == "string") {
      cb(err, {msg : game})
    }else{
      db.collection('games').update(  { '_id' : new mongo.ObjectID(gid) }, {$set : game}, function(err, upgame) {
        cb(err, new ResponseGame(game));
      });
    }
  });
}
module.exports.guess = guess;

function makeGame(userid,level, colors, font,cb) {
  level = getLevel(level);
  var word = getWord(level);
  word = word.toUpperCase();
  var result = new Game(userid, level, colors, font, "", word, getView(word,""), "unfinished");
  db.collection('games').insertOne(result,function( err, writeResult ) {
    var g = new ResponseGame(writeResult.ops[0]);
    cb(err,g);
  });
}
module.exports.makeGame = makeGame;
