function parseEmail(email) {
  var temp = email.split("@");
  temp = {username: temp[0], domain: temp[1]};
  return ((email.indexOf(" ") > 0) || temp.username == "" || temp.domain == "" || email.indexOf("@") == -1)? undefined : temp;
}

function winners(array) {
  var winners = [];
  for(var x in array) {
    var home = array[x].home;
    var away = array[x].away;
    (home.score > away.score) ? winners.push(home.name) : ( (home.score < away.score)? winners.push(away.name) : winners.push("tie"));
  }
  return winners;
}

function rank(list) {
	var temp = count(list);
	function compare(a, b) {
  	if(a[1] == b[1]) {
  		return a[0]<b[0]? -1 : 1 ;
  	}else if (a[1]>b[1]) {
  		return -1;
  	}else{
  		return 1;
  	}
	}
	temp.sort(compare);
	for(var x in temp) {
		console.log(temp[x].pop());
		temp[x] =""+temp[x[0]];
	}
	return temp;
}

function count(list) {
	var result = {};
	for(var x in list) {
		var name = list[x].toLowerCase();
		if(result[name] === undefined) {
			result[name] = 0;
		}
		result[name]++;
	}
	var temp =[];
 	for(var y in result) {
		console.log(y);
		temp.push([y,result[y]]);
	}
	return temp;
}
