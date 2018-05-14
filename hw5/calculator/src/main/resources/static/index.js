
var state = {
    lastOp : ""
}

function check() {
    var checked = $('#checkbox').text();
    checked = (checked == "check_box") ? "check_box_outline_blank" : "check_box";
    $('#checkbox').text(checked);
}

function operate(op) {
    blued(op);
    console.log(op);
    state.lastOp = op;
    $.ajax({ url : '/calculator/api/v1/' + op + '?x=' + $('#x').val() + '&y=' + $('#y').val(),
    		method : ($('#checkbox').text() == "check_box") ? "POST" : "GET",
    		headers : { 'hash-alg' : $('#dropdown').find(":selected").val()},
    		success : function(response){
    			console.log(response);
    			displayResults(response);
    		}});
}

function getOp(op) {
	switch(op) {
    	case "add" : return "+";
    	case "sub" : return "-";
    	case "mul" : return "x";
    	case "div" : return "/";
    	case "exp" : return "^";
    }
	return "";
}

function displayResults(res) {
	$('#result').empty();
    $('#hash').empty();    
    $('#result').text(res.x +" "+getOp(res.op)+" "+res.y+" = "+res.result);
    $('#hash').text(res.hashAlg+" : "+res.hash);
}

function blued(op) {
    $('#'+op).css('color','#0018f9');
    if(state.lastOp) {
        $('#'+state.lastOp).css('color','black');
    }
}

function refresh() {
    if(state.lastOp) {
        $('#'+state.lastOp).css('color','black');
    }
    $('#x').val("");
    $('#y').val("");
    $('#result').empty();
    $('#hash').empty();
}
