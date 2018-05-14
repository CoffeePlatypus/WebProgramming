
var state = {
  userid : 0,
  email : "",
  gid : 0,
  view : "login",
  default : {},
}

function playGame(game) {
  changeView("modal");
  makeGameView(game);
  state.gid = game.gid;
}

function exitGame() {
  state.gid = null;
  //setDefaults();
  changeView("content");
  getGames();
}

//**************** AJAX *********************************
function init() {
  getFonts();
  changeView("login");
  $.ajax({
    url : '/wordgame/api/v2/init',
    method : 'GET',
    success : function(response) {
      if(response) {
        state.sid = response.id;
        state.email = response.email;
        $('#user').text(response.email.split('@')[0]);
        getMeta(response.id);
        exitGame();
      }
    }
  });
}

function login() {
  var email = $('#email').val();
  var pass = $('#userPassword').val();
  $('#userPassword').val('');
  var bod = { email : email, password : pass };
  $.ajax({
    url : '/wordgame/api/v2/login',
    method : 'POST',
    data : bod,
    success : function (response) {
      if(response.msg) {
        $('#logErr').empty();
        $('#logErr').text(response.msg);
      }else{
        state.userid = response.id;
        $('#logErr').empty();
        $('#user').text(response.email.split('@')[0]);
        getMeta(response.id);
        exitGame();
      }
    }
  });
}

function logout() {
  $.ajax({
    url : '/wordgame/api/v2/logout',
    method : 'POST',
    success : function() {
      state.userid = 0;
      changeView("login");
    }
  });
}

function updateDefaults() {
  var font = $('#fontSelect').find(":selected").val();
  var level = $('#levelSelect').find(":selected").text();
  var wordColor = $('#wordColor').val();
  var guessColor = $('#guessColor').val();
  var foreColor = $('#foreColor').val();

  var colors = {guessBackground : guessColor, textBackground : foreColor, wordBackground : wordColor};
  var def = { font : font, level : level, colors : JSON.stringify(colors)};

  $.ajax( {
     url : '/wordgame/api/v2/'+state.userid+'/defaults',
     method : 'PUT',
     data : def,
     success : function (response) {
       console.log(response);
     }
  } );
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
      url : '/wordgame/api/v2/'+state.userid+"?level="+level,
      method : 'POST',
      data : color,
      headers : {"X-font" : font, font : font},
      query : {level : level},
      success : function (response) {
        playGame(response);
      }
   } );
};

function getFonts() {
  $.ajax( {
     url : '/wordgame/api/v2/meta/fonts',
     method : 'GET',
     success : function(response){
       addFonts(response);
     },
     error: function() {console.log("error: failed to get fonts")}
  });
}

function getMeta(id) {
  $.ajax( {
     url : '/wordgame/api/v2/'+id+'/meta',
     method : 'GET',
     success : function(response){
       addLevels(response.levels);
       state.default = response.default;
       setDefaults(response.default);
     },
     error: function() {console.log("error: failed to get meta")}
  });
}

function makeGuess() {
  var guess = $('#guess').val();
  $('#guess').val('');
  $.ajax( {
     url : '/wordgame/api/v2/'+state.userid+'/'+state.gid+'/guesses?guess='+guess,
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
     url : '/wordgame/api/v2/'+state.userid,
     method : 'GET',
     success : function(response){
       displayGames(response);
     },
     error: function() {console.log("error: failed to get games")}
  });
}

function resumeGame(gid) {
  $.ajax( {
     url : '/wordgame/api/v2/'+state.userid+'/'+gid,
     method : 'GET',
     success : function(response){
       playGame(response);
     },
     error: function() {console.log("error: failed to get game")}
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
    $('#login').hide();
  }else if(view == "modal") {
    $('#content').hide();
    $('#modal').show();
    $('#login').hide();
  }else if(view == "login") {
    $('#content').hide();
    $('#modal').hide();
    $('#login').show();
    var pictNum = Math.floor(Math.random() * 8); // 4 num of picts
    $('body').css('background-image',"url(/images/background/"+pictNum+".jpg)");
    $('body').css('background-size',"1600px 900px");
    $('body').css('background-repeat', "no-repeat");
    $('body').css('background-attachment',"fixed");
  }
}

function setDefaults(def) {
  var colors = JSON.parse(def.colors);
  $("#fontSelect option[value='"+JSON.stringify(def.font)+"']").attr('selected', 'selected');
  $('#levelSelect option[value="'+def.level+'"').attr('selected', 'selected');
  $('#wordColor').val(colors.wordBackground);
  $('#guessColor').val(colors.guessBackground);
  $('#foreColor').val(colors.textBackground);
}

function makeGameView(game) {
  console.log(game);
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
