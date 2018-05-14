function risk(height, weight, sex) {
  var bmi = (weight*.45) / Math.pow((height*.025),2);
  return (sex == "F" && (bmi<19.4 || bmi>27.6)) || (sex == "M" && (bmi<20.4 || bmi>31.9));
}

function roman(num) {
	var roman=["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX","X"];
	if(typeof(num) == "number") {
		return roman[num-1];
	}else if(typeof(num) =="string") {
		num=num.toUpperCase();
		for(var i=0; i<roman.length; i++) {
			if(roman[i]==num) {
				return i+1;
			}
		}
	}
}

function lettersThatFollow(text,ch) {
  var temp=text.split(ch);
  var result="";
  temp.shift();
  for(var x in temp) {
  	if(result.indexOf(temp[x].charAt(0)) == -1) {
  		result+=temp[x].charAt(0);
  	}
  }
  return result;
}

function props(list, propertyName){
  var result=[];
  for(var x in list) {
  	result.push(list[x][propertyName]);
  }
  return result;
}

function listify(item,listType) {
	var result="";
	for(var i=0; i<item.length; i++) {
		if(Array.isArray(item[i])) {
			result=result+"<li>"+item[i].shift()+listify(item[i],listType) +"</li>";
		}else{
			result=result+"<li>"+item[i]+"</li>";
		}
	}
	return "<"+listType+">"+result+"</"+listType+">";
}

function cashier(price,payment) {
	var changeAmount;
	if(price>payment) {
		changeAmount=payment;
	}else{
		changeAmount=payment-price;
	}
	var change = {twenties:0, tens:0, ones:0, quarters:0, dimes:0, nickels:0, pennies:0};
	while(changeAmount-20>=0) {
		change.twenties++;
		changeAmount=changeAmount-20;
	}
	while(changeAmount-10>=0) {
		change.tens++;
		changeAmount=changeAmount-10;
	}
	while(changeAmount-1>=0) {
		change.ones++;
		changeAmount=changeAmount-1;
	}
	while(changeAmount-0.25>=0) {
		change.quarters++;
		changeAmount=changeAmount-0.25;
	}
	while(changeAmount-0.1>=0) {
		change.dimes++;
		changeAmount=changeAmount-0.1;
	}
	while(changeAmount-0.05>=0) {
		change.nickels++;
		changeAmount=changeAmount-0.05;
	}
	while(changeAmount-0.01>=0) {
		change.pennies++;
		changeAmount=changeAmount-0.01;
	}
	return change;
}
//cashier( 10.32, 80 )  // 5 penny diff

function repeat(text,n) {
	result="";
	for(var i=0; i<n;i++) {
		result+=text;
	}
	return result;
}

function repeatf(f,n) {
	if(n<=0) {return "";}
	var result= new Array(n);
	for(var i=0; i<n; i++) {
		result[i]=  f();
	}
	return result;
}
//sequence error because sequence is not defined

function matchmaker(obj) {
	function pred(input) {
		for(var x in obj) {
			if(obj[x]!= input[x]) {
				return false;
			}
		}
		return true;
	}
	return pred;
}

function breakup(list,partitioner) {
	var result = {};
	for(var i=0; i<list.length; i++) {
		var prop=partitioner(list[i]);
		if(!Array.isArray(result[prop])) {
			result[prop] = [];	
		}
		result[prop].push(list[i]);
	}
	return result;
}

function eachOne(list) {
	for(var i=0; i<list.length; i++) {
		if(!list[i]) {
			return list[i];
		}
	}
	return true;
}

function noSql(list, query) {
	var result=[];
	var match = matchmaker(query);
	for(var i=0; i<list.length; i++) {
		var temp = list[i];
		if(match(temp)) {
			result.push(temp);
		}
	}
	return result;
}

function justOnce(f) {
	var called=false;
	var ret;
	return function once() {
		if(called==false) {
			called=true;
		  ret = f.apply(null,arguments);
		}
		return ret;
	}
}




