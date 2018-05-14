
var state = {
    userid : 0,
    email : "",
    gid : 0,
    view : "login",
    default : {},
    oid : 0,
    csrf : null
}

function playGame(game) {
    changeView("modal");
    makeGameView(game);
    state.gid = game.gid;
}

function exitGame() {
    state.gid = null;
    changeView("content");
    getGames();
}

function exitUserView() {
    changeView("adminContent");
    getUserList(state.userid);
}

//**************** AJAX *********************************
function init() {
    getFonts();
    changeView("login");
    $.ajax({
        url : '/wordgame/api/v3/init',
        method : 'GET',
        success : function(response) {
            console.log(response);
            if(response) {
                state.userid = response.id;
                state.email = response.email;
                if(response.role == "USER") {
                    $('#userg').text(response.name.first);
                    getMeta(response.id);
                    exitGame();
                }else if(response.role == "ADMIN"){
                    $('#userAdmin').text(response.name.first);
                    getUserList(response.id);
                }
            }
        }
    });
}

function login() {
    $.ajax({
        url : '/wordgame/api/v3/login',
        method : 'POST',
        data : { email : $('#email').val(), password : $('#userPassword').val() },
        success : function (response) {
            if(response.msg) {
                $('#logErr').empty();
                $('#logErr').text(response.msg);
            }else{
                console.log(response);
                console.log(response.headers);
                state.userid = response.id;
                $('#logErr').empty();
                if(response.role == "USER") {
                    $('#userg').text(response.name.first);
                    getMeta(response.id);
                    exitGame();
                }else if(response.role == "ADMIN"){
                    $('#userAdmin').text(response.name.first);
                    getUserList(response.id);
                }
            }
        }
    });
    $('#userPassword').val('');
}

function logout() {
    $.ajax({
        url : '/wordgame/api/v3/logout',
        method : 'POST',
        success : function() {
            state.userid = 0;
            changeView("login");
        }
    });
}

function getUserList() {
    var q ="";
    $.ajax({
        url : '/wordgame/api/v3/admins/'+state.userid+'/users?q='+q,
        method : 'GET',
        success : function (response) {
            console.log(response);
            showUserList(response);
        }
    });
}

function search() {
    var q =$('#searchQuery').val();
    $.ajax({
        url : '/wordgame/api/v3/admins/'+state.userid+'/users?q='+q,
        method : 'GET',
        success : function (response) {
            console.log(response);
            showUserList(response);
        }
    });
}

function viewUser(id) {
    $.ajax({
        url : '/wordgame/api/v3/admins/'+state.userid+'/user/'+id,
        method : 'GET',
        success : function (response) {
            console.log(response);
            showUser(response);
        }
    });
}


function addUser() {
    $.ajax({
        url : '/wordgame/api/v3/admins/'+state.userid+'/user',
        method : 'POST',
        data : {
            name : JSON.stringify({first : $('#newNameF').val(), last : $('#newNameL').val()}),
            email : $('#newEmail').val(),
            password : $('#newPassword').val(),
            role : (($('#newAdminCheckbox').prop("checked"))? "ADMIN" : "USER"),
            enabled : $('#newEnabledCheckbox').prop("checked")
        },
        success : function (response) {
            if(response.alert) {
                alert(response.error);
            }else{
                console.log(response);
                showUser(response);
            }
        }
    });
    $('#newNameF').val("");
    $('#newNameL').val("");
    $('#newEmail').val("");
    $('#newPassword').val("");
    $('#newAdminCheckbox').prop("checked", false);
    $('#newEnabledCheckbox').prop("checked", false);
}

function updateUser() {
    if(state.oid) {
        console.log("gonna update "+state.oid);
        var enabled = $("#enabledCheckbox").prop("checked");
        var admin = $("#adminCheckbox").prop("checked") ? "ADMIN" : "USER";
        var body = { enabled : enabled, role : admin};
        $.ajax({
            url : '/wordgame/api/v3/admins/'+state.userid+'/user/'+state.oid,
            method : 'PUT',
            data : body,
            success : function (response) {
                console.log("updated user");
                console.log(response);
                showUser(response);
            }
        });
    }else{
        console.log("why are you here?");
    }
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
        url : '/wordgame/api/v3/'+state.userid+'/defaults',
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
        url : '/wordgame/api/v3/'+state.userid+"?level="+level,
        method : 'POST',
        data : color,
        headers : {"X-font" : font, font : font},
        query : {level : level},
        success : function (response) {
            playGame(response);
        }
    } );
}

function getFonts() {
    $.ajax( {
        url : '/wordgame/api/v3/meta/fonts',
        method : 'GET',
        success : function(response){
            addFonts(response);
        },
        error: function() {console.log("error: failed to get fonts")}
    });
}

function getMeta(id) {
    $.ajax( {
        url : '/wordgame/api/v3/'+id+'/meta',
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
        url : '/wordgame/api/v3/'+state.userid+'/'+state.gid+'/guesses?guess='+guess,
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
        url : '/wordgame/api/v3/'+state.userid,
        method : 'GET',
        success : function(response){
            displayGames(response);
        },
        error: function() {console.log("error: failed to get games")}
    });
}

function resumeGame(gid) {
    $.ajax( {
        url : '/wordgame/api/v3/'+state.userid+'/'+gid,
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
    if(view == "login") {
        $('#content').hide();
        $('#modal').hide();
        $('#login').show();
        $('#adminContent').hide();
        $('#userView').hide();
        $('#addView').hide();
        var pictNum = Math.floor(Math.random() * 10); // 4 num of picts
        $('body').css('background-image',"url(/images/background/"+pictNum+".jpg)");
        $('body').css('background-size',"cover"); // TODO fix resolution
        $('body').css('background-repeat', "no-repeat");
        $('body').css('background-attachment',"fixed");
    }else {
        $('#'+state.view).hide();
        $('#'+view).show();
    }
    state.view = view;
}

function setDefaults(def) {
    var colors = JSON.parse(def.colors);
    $("#fontSelect option[value='"+JSON.stringify(def.font)+"']").attr('selected', 'selected');
    $('#levelSelect option[value="'+def.level+'"').attr('selected', 'selected');
    $('#wordColor').val(colors.wordBackground);
    $('#guessColor').val(colors.guessBackground);
    $('#foreColor').val(colors.textBackground);
}

function showUser(user) {
    console.log(user);
    changeView("userView");
    console.log(user.enabled);
    $("#usernameFirst").val(user.name.first);
    $("#usernameLast").val(user.name.last);
    $("#userEmail").val(user.email);
    if(user.id == state.userid) {
        $('#adminCheckbox').prop('disabled', true);
        $("#enabledCheckbox").prop('disabled', true);
    }else{
        $('#adminCheckbox').prop('disabled', false);
        $("#enabledCheckbox").prop('disabled', false);
    }
    if(user.role == "ADMIN") {
        $("#adminCheckbox").prop('checked', true);
    }else{
        $("#adminCheckbox").prop('checked', false);
    }
    $("#enabledCheckbox").prop('checked', user.enabled);

    state.oid = user.id;
}

function showUserList(users) {
    changeView("adminContent");
    $('#userTableBody').empty();
    users.forEach(x=>{
        var check = x.enabled ? '<span class="glyphicon glyphicon-check black"></span' : '<span class="glyphicon glyphicon-unchecked black"></span'
        $("<tr onclick=viewUser('"+x.id+"')><td>"+x.name.first+" "+x.name.last+"</td><td>"+x.email+"</td><<td>"+x.role+"</td><td>"+ check+"</td></tr>").appendTo('#userTableBody');
    });
    state.oid = 0;
}

function addView() {
    changeView("addView");
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
