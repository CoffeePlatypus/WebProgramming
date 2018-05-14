// var test = 'GET HTTP:\/\/charity.cs.uwlax.edu:98\/a\/b?c=d&e=f#ghi HTTP\/1.1\nHost: charity.cs.uwlax.edu\nConnection: keep-alive\nPragma: no-cache\nCache-Control: no-cache\nUpgrade-Insecure-Requests: 1\nUser-Agent: Mozilla\/5.0 (Macintosh; Intel Mac OS X 10_12_2) AppleWebKit\/537.36 (KHTML, like Gecko) Chrome\/55.0.2883.95 Safari\/537.36\nAccept: text\/html,application\/xhtml+xml,application\/xml;q=0.9,image\/webp,*\/*;q=0.8\nAccept-Encoding: gzip, deflate, sdch\nAccept-Language: en-US,en;q=0.8,nb;q=0.6\n\nThis is the body';

function httpRequest(input) {
	var request = input.split("\n");
	var output = {};
	var head = {};
	for(var i = 1; i<request.length; i++) {
		if(!request[i]) {
			output.body = request[++i];
		}else{
			var line = request[i].split(": ");
			head[line[0]] = line[1];
		}
	}
	output.headers = head;

	var firstLine = request[0].split(" ");
	if(firstLine.length != 3) {
		console.log("Error: Request line requires Method, Url, and Version");
		return undefined;
	}
	output.method = firstLine[0];
	output.version = firstLine[2];

	var url = firstLine[1];
	url= url.split("://");
	if(url[0] == "HTTP") {
		output.protocol = "HTTP";
		output.port = "80";
	}else{
		output.protocol = "HTTPS";
		output.port = "443";
	}
	url = url[1];
	url = url.split("@");
	if(url[1]) {
		var temp = url[0].split(":");
		output.user = temp[0];
		output.password = temp[1];
		url = url[1];
	}else{
		url = url[0];
	}

	if(url.indexOf("/")>=0) {
		output.url = "/"+url.split(/\/(.+)/)[1];
	}
	if(url.indexOf("#")>=0) {
		url = url.split("#");
		output.fragment = url[1];
		url = url[0];
	}
	if(url.indexOf("?")>=0) {
		url = url.split("?");
		output.querry = getQuerry(url[1]);
		url = url[0];
	}
	if(url.indexOf("/")>=0) {
		url = url.split(/\/(.+)/)
		output.path = "/"+url[1];
		url = url[0];
	}
	if(url) {
		output.host = url;
	}
	return output;
}

function getQuerry(que) {
	que = que.split("&");
	var querryObj = {};
	que.forEach(x=>{
		x = x.split("=");
			querryObj[x[0]]=x[1];
	});
	return querryObj;
}
