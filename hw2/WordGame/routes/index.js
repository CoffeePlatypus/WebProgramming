var express = require('express');
var router = express.Router();
var uuid = require('uuid');
var rin = require('fs');
var os = require('os');

var sessionGames = [];
// var dictionary = rin.readFileSync("./routes/wordlist.txt","utf8").split("\r\n");
var dictionary = [];

function readDictionary() {
  var dict = rin.readFileSync("./routes/wordlist.txt","utf8");
  dictionary = dict.split(os.EOL);
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
  //console.log(view);
  return view;
}

function Game(sid, lev, colors, font) {
  this.gid = uuid();
  this.sid = sid;
  this.level = getLevel(lev);
  this.font = font;
  this.colors = colors;
  this.guesses = "";
  this.view = "";
  this.target = getWord(this.level).toUpperCase();
  console.log(this.target);
  this.view = getView(this.target, "");
  this.status = "unfinished";
  this.timestamp = Date.now();
  this.remaining = this.level.rounds;
};

function ResponseGame(game) {
  this.gid = game.gid;
  this.sid = game.sid;
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
  return "";
}

function getFonts() {
  var fonts = [];
  fonts.push({category: 'Concert One', family: 'cursive', url: "https://fonts.googleapis.com/css?family=Concert+One"});
  fonts.push({category: 'Monoton', family: 'cursive', url: "https://fonts.googleapis.com/css?family=Monoton"});
  fonts.push({category: 'Nanum Pen Script', family: 'cursive', url: "https://fonts.googleapis.com/css?family=Nanum+Pen+Script"});
  fonts.push({category: 'Open Sans', family: 'sans-serif', url: "https://fonts.googleapis.com/css?family=Open+Sans"});
  fonts.push({category: 'Poiret One', family: 'cursive', url: "https://fonts.googleapis.com/css?family=Poiret+One"});
  fonts.push({category: 'Share Tech Mono', family: 'monospace', url: "https://fonts.googleapis.com/css?family=Share+Tech+Mono"});
  fonts.push({category: 'Slabo 27px', family: 'serif', url: "https://fonts.googleapis.com/css?family=Slabo+27px"});
  fonts.push({category: 'Ubuntu', family: 'sans-serif', url: "https://fonts.googleapis.com/css?family=Ubuntu"});
  fonts.push({category: 'Ubuntu Mono', family: 'monospace', url: "https://fonts.googleapis.com/css?family=Ubuntu+Mono"});
  fonts.push({category: 'VT323', family: 'monospace', url: "https://fonts.googleapis.com/css?family=VT323"});
  return fonts;
}

/////////////////////Routes/////////////////////////
/* GET home page. */
router.get('/wordgame', function(req, res, next) {
  res.sendFile( 'index.html', { root : __dirname + "/../public" } );
});
// GET SID
router.get('/wordgame/api/v1/sid', function(req, res, next) {
  readDictionary();
  var sid = uuid();
  sessionGames[sid] = [];
  var result = { headers : {"x-sid" : sid}};
  res.send( result );
});
// GET metadata
router.get('/wordgame/api/v1/meta', function(req, res, next) {
  var result = {};
  result.levels = ["easy", "medium", "hard"];
  result.fonts = getFonts();
  var colors = {guessBackground : "#ffffff" , textBackground : "#000000", wordBackground : "#888888" };
  result.default = {font : result.fonts[0], level : "medium", colors : JSON.stringify(colors)};
  res.send(result);
});
// GET fonts
router.get('/wordgame/api/v1/meta/fonts', function(req, res, next) {
  var fonts = getFonts();
  res.send(fonts);
});
// GET games
router.get('/wordgame/api/v1/:sid', function(req, res, next) {
  var games = sessionGames[ req.params.sid ];
  var result = [];
  for( var x in games ) {
      result.push( new ResponseGame(games[ x ]) );
  }
  res.send(result);
});
// Post // Make Game
router.post('/wordgame/api/v1/:sid', function(req, res, next) {
  var game = new Game(req.params.sid, req.query.level, req.body, req.headers["x-font"] );
  sessionGames[req.params.sid][game.gid] = game;
  game = new ResponseGame(game);
  res.send(game);
});
// Get Game
router.get('/wordgame/api/v1/:sid/:gid', function(req, res, next) {
  var result = sessionGames[ req.params.sid ] [req.params.gid];
  result = new ResponseGame(result);
  res.send(result);
});
// Make guess
router.post('/wordgame/api/v1/:sid/:gid/guesses', function(req, res, next) {
  var guess = req.query.guess;
  var game = sessionGames[ req.params.sid ] [req.params.gid];
  var err = makeGuess(game,guess);
  if(err) {
    res.send({msg : err});
  }else{
    game = new ResponseGame(game);
    res.send(game);
  }
});

module.exports = router;
