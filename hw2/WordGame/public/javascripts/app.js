/* Questions
-favicon?
*/

var state = {
  sid : null,
  gid : null,
  view : "content",
  default : null
}

function playGame(game) {
  changeView("modal");
  makeGameView(game);
  state.gid = game.gid;
}

function exitGame() {
  state.gid = null;
  setDefaults();
  changeView("content");
  getGames();
}

//**************** AJAX *********************************
function init() {
  getSID();
  getMeta();
  getFonts();
  changeView("content");

}

function createGame() {
   var font = $('#fontSelect').find(":selected").val();
   var level = $('#levelSelect').find(":selected").text();
   var wordColor = $('#wordColor').val();
   var guessColor = $('#guessColor').val();
   var foreColor = $('#foreColor').val();

   var color = {guessBackground : guessColor,
     textBackground : foreColor,
     wordBackground : wordColor};
   $.ajax( {
      url : '/wordgame/api/v1/'+state.sid+"?level="+level,
      method : 'POST',
      data : color,
      headers : {"X-font" : font, font : font},
      query : {level : level},
      success : function (response) {
        console.log(response);
        playGame(response);
      }
   } );
};

function getSID() {
  $.ajax( {
     url : '/wordgame/api/v1/sid',
     method : 'GET',
     success : function(response){
       state.sid = response.headers["x-sid"];
     },
     error: function() {console.log("error: failed to get SID")}
  });
}

function getFonts() {
  $.ajax( {
     url : '/wordgame/api/v1/meta/fonts',
     method : 'GET',
     success : function(response){
       addFonts(response);
     },
     error: function() {console.log("error: failed to get fonts")}
  });
}

function getMeta() {
  $.ajax( {
     url : '/wordgame/api/v1/meta',
     method : 'GET',
     success : function(response){
       console.log("here");
       addLevels(response.levels);
       state.default = response.default;
       setDefaults();
     },
     error: function() {console.log("error: failed to get meta")}
  });
}

function makeGuess() {
  var guess = $('#guess').val();
  $('#guess').val('');
  $.ajax( {
     url : '/wordgame/api/v1/'+state.sid+'/'+state.gid+'/guesses?guess='+guess,
     method : 'POST',
     success : function(response){
       if(response.msg) {
         alert(response.msg);
       }else{
         playGame(response);
       }
     },
     error: function() {console.log("error: failed to make guess")}
  });
}

function getGames() {
  $.ajax( {
     url : '/wordgame/api/v1/'+state.sid,
     method : 'GET',
     success : function(response){
       displayGames(response);
     },
     error: function() {console.log("error: failed to get games")}
  });
}

function resumeGame(gid) {
  $.ajax( {
     url : '/wordgame/api/v1/'+state.sid+'/'+gid,
     method : 'GET',
     success : function(response){
       playGame(response);
     },
     error: function() {console.log("error: failed to get games")}
  });
}

//***************************DOM********************************************
function addFonts(fonts) {
  fonts.forEach(x=>{
    $('#fontSelect').append($('<option>', {
      value: JSON.stringify(x),
      text: x.category
    }).css('font-family', x.category+", "+x.family));
    $('<link href='+x.url+' rel="stylesheet">').appendTo('head');
  });
}

function addLevels(levels) {
  levels.forEach(x=>{
    $('#levelSelect').append($('<option>', {
    value: x,
    text: x
    }));
  });
}

function changeView(view) {
  if(view == "content") {
    $('#content').show();
    $('#modal').hide();
  }else if(view == "modal") {
    $('#content').hide();
    $('#modal').show();
  }
}

function setDefaults() {
  var colors = JSON.parse(state.default.colors);
  $("#fontSelect option[value='"+JSON.stringify(state.default.font)+"']").attr('selected', 'selected');
  $('#levelSelect option[value="'+state.default.level+'"').attr('selected', 'selected');
  $('#wordColor').val(colors.wordBackground);
  $('#guessColor').val(colors.guessBackground);
  $('#foreColor').val(colors.textBackground);
}

function makeGameView(game) {
  if(game.status == "unfinished") {
    $('#gleft').text(game.remaining);
    $('#hider').show();
    $('#modal').css('background-image', 'none');
  }else{
    $('#hider').hide();
    if(game.status == "victory") {
      $('#modal').css("background-image", "url(/images/winner.gif)");
    }else{
      $('#modal').css("background-image", "url(/images/cry.gif)");
    }
  }
  var font = game.font;
  font = JSON.parse(font);
  showGuesses(game.guesses, game.colors.textBackground, game.colors.guessBackground,font.category, font.family);
  showWordView(game.view,game.colors.textBackground, game.colors.wordBackground,font.category, font.family);
}

function showWordView(view,textColor,backColor,fontName, fontFamily) {
  $("#wordView").empty();
  view = view.split("");
  view.forEach(x=>{
    var box = $("<div class='viewBox inline'>"+x+"</div>");
    box.css('color',textColor);
    box.css('background-color', backColor);
    box.css('font-family', fontName+", "+fontFamily);
    box.appendTo('#wordView');
  });
}

function showGuesses(guesses,textColor, backColor,fontName, fontFamily) {
  $("#guessView").empty();
  guesses = guesses.split("");
  guesses.forEach(x=>{
    var box = $("<div class='guessBox inline'>"+x+"</div>");
    box.css('color',textColor);
    box.css('background-color', backColor);
    box.css('font-family', fontName+", "+fontFamily);
    box.appendTo('#guessView');
    // $("<div class='guessBox inline' style='color:"+textColor+"; background-color:"+backColor+";'>"+x+"</div>").appendTo("#guessView");
  });
}

function displayGames(gameList) {
  $("#tableBody").empty();
  for(var x in gameList) {
    var game = gameList[x];
    var answer = game.target || " ";
    $("<tr onclick=resumeGame('"+game.gid+"')><td>"+game.level+"</td><td> <div id="+game.gid+"></div> </td><td>"+game.remaining+"</td><td>"+ answer+
        "</td><td>"+game.status+"</td></tr>").appendTo('#tableBody');
    var font = JSON.parse(game.font);
    littleWordView(game.view,game.colors.textBackground, game.colors.wordBackground,game.gid, font.category, font.family);
  }
}

function littleWordView(view,textColor,backColor,gid, fontName, fontFamily) {
  view = view.split("");
  view.forEach(x=>{
    var box = $("<div class='guessBox inline'>"+x+"</div>");
    box.css('color',textColor);
    box.css('background-color', backColor);
    box.css('font-family', fontName+", "+fontFamily);
    box.appendTo('#'+gid);
  });
}
