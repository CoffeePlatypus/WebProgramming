

function getLevel(level) {
  if(level == "easy") {
    return {name: "easy", minLength : 3, maxLength : 5, rounds : 8 };
  }else if(level == "medium") {
    return {name: "medium", minLength : 4, maxLength : 10, rounds : 7 };
  }else{
    return {name: "hard", minLength : 9, maxLength : 300, rounds : 6 };
  }
}
module.exports.getLevel = getLevel;

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

module.exports.getFonts = getFonts;
