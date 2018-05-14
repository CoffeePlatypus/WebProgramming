function Game(userid, level, colors, font, guesses, target, view, status) {
  console.log("got into making game");
  this.userid = userid;
  this.level = level;
  this.font = font;
  this.colors = colors;
  this.guesses = guesses;
  this.target = target;//getWord(this.level).toUpperCase();
  this.view = view;
  this.status = status;
  this.timestamp = Date.now();
  this.remaining = this.level.rounds;
};

module.exports = Game;
