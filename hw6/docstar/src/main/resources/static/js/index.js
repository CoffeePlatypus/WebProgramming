var state = {
    username : "",
    admin : "false",
    page : 1
}

function loader() {
    hide('user-view');
    hide('create-user-view');
    $('body').css('background-image',"url(http://wallpaper21.com/wp-content/uploads/2016/06/android-tablet-wallpaper11.jpg)");
    $('body').css('background-size',"cover");
    $('body').css('background-repeat', "no-repeat");
    $('body').css('background-attachment',"fixed");
    // $('#icon').css('background-image',"url()");
    // $('#icon').css('background-size',"cover");
    // $('#icon').css('background-repeat', "no-repeat");
    // $('#icon').css('background-attachment',"fixed");
}

function getCSRF() {
	function getCookie(name) {
	  var value = "; " + document.cookie;
	  var parts = value.split("; " + name + "=");
	  if (parts.length == 2) return parts.pop().split(";").shift();
	}
	
	var cookie = getCookie('XSRF-TOKEN');
	return cookie || null;
}

function getHeaders() {
	return { "X-XSRF-TOKEN" : getCSRF() };
}

/// AJAX

function login() {
    console.log("meow log");
    $.ajax({
        url : '/login',
        method : 'POST',
        headers : getHeaders(),
        data :  { "username" : $('#username').val(), "password" : $('#password').val() },
        success : function(res) {
            console.log(res);
            displayUser(res);
            hide('login');
            show('user-view');
        }
    });
}

function logout() {
    console.log("meow log");
    $.ajax({
        url : '/logout',
        method : 'POST',
        headers : getHeaders(),
        success : function() {
            show('login');
            hide('user-view');
            state.username = "";
            state.admin = "false";
        }
    });
}

function getDoc() {
    state.page = 1;
    $.ajax({
        url : '/api/v1/documents?page='+state.page,
        method : 'GET',
        headers : getHeaders(),
        success : function(res) {
            console.log(res);
            displayDocs(res.results, true);
        }
    });
}

function next() {
    $.ajax({
        url : '/api/v1/documents?page='+state.page++,
        method : 'GET',
        headers : getHeaders(),
        success : function(res) {
            console.log(res);
            displayDocs(res.results, true);
        }
    });
}

function getUsers() {
    $.ajax({
        url : '/api/v1/users',
        method : 'GET',
        success : function(res) {
            console.log(res);
        }
    });
}

///// DOM

function hide(id) {
    $('#'+id).hide();
}

function show(id) {
    $('#'+id).show();
}

function select(title, type, url) {
    console.log(title);
    console.log(type);
    console.log(url);
    $('#documents').hide();
    $('#doc-title').text(title);
}

function assign(x) {
    var title = $('#title'+x).text();
    console.log(title);
    var type = $('#type'+x).text();
    var owner = $('#userSelect'+x).find(":selected").text();
    var url = $('#url'+x).text();
    console.log(owner);
    $.ajax({
        url : '/api/v1/users/'+state.username+'/docs',
        method : 'POST',
        headers : getHeaders(),
        contentType : 'application/json',
        data : JSON.stringify({ title : title, 
                                type : type,
                                owner : owner, 
                                url : url}),
        success : function(res) {
            console.log(res);

        }
    });
}

function rate(x) {
    console.log(x);
    var rating = $('#rating'+x).val();
    $.ajax({
        url : '/api/v1/users/'+state.username+'/docs/'+x+'?rating='+rating,
        method : 'PUT',
        headers : getHeaders(),
        success : function(res) {
            console.log(res);
            getMyDocs();
        }
    });
}

function search() {
    console.log('/api/v1/users/'+state.username+'/docs?query='+$('#queryString').val()+
              '&type='+$('#queryType').find(":selected").val()+
              '&reviewed='+($('#checkbox1').text() == "check_box") ? true : false);
    $.ajax({
        url : '/api/v1/users/'+state.username+'/docs?queryString='+$('#queryString').val()+
              '&type='+$('#queryType').find(":selected").val()+
              '&reviewed='+($('#checkbox1').text() == "check_box" ? true : false),
        method : 'GET',
        headers : getHeaders(),
        success : function(res) {
            console.log(res);
            displayDocs(res, false);
        }
    });
}

function getMyDocs() {
    $.ajax({
        url : '/api/v1/users/'+state.username+'/all/docs',
        method : 'GET',
        headers : getHeaders(),
        success : function(res) {
            console.log(res);
            displayDocs(res, false);
        }
    });
}

function displayDocs(docs, admin) {
    $('#documents').empty();

    if( admin ) {
        $.ajax({
            url : '/api/v1/users',
            method : 'GET',
            success : function(users) {
                console.log(users);
                for(var x in users){
                    users[x] = users[x].username;
                }
                console.log(users)
                $("<tr>"+
                        "<th>Document Title</th><th>Type</th>"+
                        "<th>PDF</th><th>User</th><th><button onclick='next()'>>></button></th>"+
                        "</tr>").appendTo('#documents');
                for(var x in docs){
                    var doc = docs[x];
                    $("<tr>"+
                        "<td><div id=title"+x+">"+doc.title+"</div></td><td ><div id=type"+x+">"+doc.type+"</div></td>"+
                        "<td><a id=url"+x+" target='_blank' href='"+getUrl(doc)+"'><i class='material-icons'>content_paste</i></a></td>"+
                        "<td><select id=userSelect"+x+"></select></td><td><button onclick=assign("+x+")>Assign</button></td>"+
                        "</tr>").appendTo('#documents');
                    users.forEach(u=>{
                        $('#userSelect'+x).append($('<option>', {
                            value: u,
                            text: u
                        }));
                    });
                }
            }
        });
    }else{
        $("<tr>"+
                        "<th>Document Title</th><th>Type</th>"+
                        "<th>PDF</th><th>Reviewed</th><th>Rating</th><th></th>"+
                        "</tr>").appendTo('#documents');
         for(var x in docs){
                    var doc = docs[x];
                    console.log(doc.id)
                    $("<tr>"+
                        "<td><div id=title"+x+">"+doc.title+"</div></td><td ><div id=type"+x+">"+doc.type+"</div></td>"+
                        "<td><a id=url"+x+" target='_blank' href='"+getUrl(doc)+"'><i class='material-icons'>content_paste</i></a></td>"+
                        "<td>"+getReviewed(doc.reviewed)+"</td><td><input type='number' id=rating"+doc.id+"></td>"+
                        "<td><button onclick=rate('"+doc.id+"')>Rate</button></td>"+
                        "</tr>").appendTo('#documents');
                    if(doc.reviewed) {
                        $('#rating'+doc.id).val(doc.rating);
                    }
                }
    }        
}

function getUsers(){
    show('user-view');
    $('#documents').empty();
    $.ajax({
            url : '/api/v1/users',
            method : 'GET',
            success : function(users) {
                console.log(users);
                $("<tr>"+
                        "<th>User</th><th>Role</th>"+
                        "<th>Enabled</th>"+
                        "</tr>").appendTo('#documents');
                for(var x in users){
                    var user = users[x];
                    $("<tr onclick='viewUser("+x+")'>"+
                        "<td><div id=user"+x+">"+user.username+"</div></td><td ><div id=role"+x+">"+user.roles[user.roles.length - 1]+"</div></td>"+
                        "<td><div id=enabled"+x+">"+getReviewed(user.enabled)+"</div></td>"+
                        "</tr>").appendTo('#documents');
                }
            }
    });
}

function getReviewed(rev) {
    if(rev) {
        return "<i class='material-icons'>check_box</i>"
    }
    return "<i class='material-icons'>check_box_outline_blank</i>"
}

function createUserView() {
    hide('user-view');
    show('create-user-view');
    hide('updateButton');
    hide('editButton')
    show('createButton');
    $("#new-user").prop('disabled', false);
}

function editProfile(){
    hide('user-view')
    show('create-user-view');
    hide('updateButton');
    hide('createButton');
    show('editButton');
    $("#new-user").prop('disabled', true);
    $('#new-user').val(state.username);
    $('#new-password').val('');
    $('#checkbox2').text();
    $('#checkbox').text();
}

function viewUser(x) {
    hide('user-view')
    show('create-user-view');
    show('updateButton');
    hide('createButton');
    hide('editButton');
    $("#new-user").prop('disabled', true);
    $('#new-user').val($('#user'+x).text());
    $('#new-password').val('');
    $('#checkbox2').text( $('#enabled'+x).text() );
    $('#checkbox').text( $('#role'+x).text() != "ADMIN" ? "check_box_outline_blank" : "check_box");
}

function updateUser() {
    $.ajax({
        url : '/api/v1/user',
        method : 'Put',
        headers : getHeaders(),
        contentType : 'application/json',
        data : JSON.stringify({
            username : $('#new-user').val(),
            password : $('#new-password').val(),
            role : ($('#checkbox').text() == "check_box") ? "ADMIN" : "USER",
            enabled : $('#checkbox2').text() == "check_box"
        }),
        success : function(res) {
            console.log(res);
            hide('create-user-view');
            getUsers();
        }
    });
}

function editUser() {
    $.ajax({
        url : '/api/v1/user',
        method : 'Put',
        headers : getHeaders(),
        contentType : 'application/json',
        data : JSON.stringify({
            username : $('#new-user').val(),
            password : $('#new-password').val(),
            role : state.admin ? "ADMIN" : "USER",
            enabled : true
        }),
        success : function(res) {
            console.log(res);
            hide('create-user-view');
            getMyDocs();
        }
    });
}

function create() {
    $.ajax({
        url : '/api/v1/user',
        method : 'POST',
        headers : getHeaders(),
        contentType : 'application/json',
        data : JSON.stringify({
            username : $('#new-user').val(),
            password : $('#new-password').val(),
            role : ($('#checkbox').text() == "check_box") ? "ADMIN" : "USER"
        }),
        success : function(res) {
            console.log(res);
            hide('create-user-view');
            getUsers();
        }
    });
}


function exitUserCreate() {
    hide('create-user-view');
    getUsers();
}

function check() {
    var checked = $('#checkbox').text();
    checked = (checked == "check_box") ? "check_box_outline_blank" : "check_box";
    $('#checkbox').text(checked);
}

function check1() {
    var checked = $('#checkbox1').text();
    checked = (checked == "check_box") ? "check_box_outline_blank" : "check_box";
    $('#checkbox1').text(checked);
}

function check2() {
    var checked = $('#checkbox2').text();
    checked = (checked == "check_box") ? "check_box_outline_blank" : "check_box";
    $('#checkbox2').text(checked);
}

function getUrl(doc) {
    return doc.pdf_url || doc.url;
}

function displayUser(user){
    var name = user.username;
    var admin = user.roles[user.roles.length - 1] == "ADMIN";
    state.username = name;
    state.admin = admin;
    $('#name').text(name);
    console.log(state.admin);
    $('#roles').text(user.roles[user.roles.length - 1]);
    if(!admin) {
        hide('admin-control');
    }else{
        show('admin-control');
    }
    getMyDocs();
}