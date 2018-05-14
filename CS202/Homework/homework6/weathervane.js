
var weatherList = [];

//weather obj {discription, name, date, temp, weather}


function addForecast() {
  var lat = document.getElementById("lat").value;
  var lon = document.getElementById("lon").value;
  // var lat=43.81;
  // var lon=-91.21;

  $.ajax({
    url:"http://forecast.weather.gov/MapClick.php",
    data:{lat:lat, lon:lon, FcstType:"json"},
    success: function(wobj) {
      if(wobj.location) {
        addWeather({dis:wobj.location.areaDescription,
                  name:wobj.currentobservation.name,
                  date:wobj.currentobservation.Date,
                  temp:wobj.currentobservation.Temp,
                  weather:wobj.currentobservation.Weather,
                  pict:wobj.currentobservation.Weatherimage,
                  //pict:wobj.data.iconLink[0],
                  id:wobj.creationDate});
        refresh();
      }else{
        alert("Undefined Location");
      }
    },
    error: function() {
      console.log("erorrororor");
    }
  });
}

function refresh() {
  var container = document.getElementById("container");
  removeChildren(container);
  weatherList.forEach(x=>{
    var box = document.createElement("div");
    box.setAttribute("class","outerBox");

    var close = document.createElement("div");
    close.setAttribute("class","delete");
    close.addEventListener( 'click',()=>removeWeather(x));
    box.appendChild(close);

    var discription = document.createElement("h2");
    discription.appendChild(document.createTextNode(x.dis));
    box.appendChild(discription);

    var box2 = document.createElement("div");
    box2.setAttribute("class","innerBox");

    var name = document.createElement("h3");
    name.setAttribute("class","name");
    name.appendChild(document.createTextNode(x.name));
    box2.appendChild(name);

    var date = document.createElement("div");
    name.setAttribute("class","date");
    date.appendChild(document.createTextNode(x.date));
    box2.appendChild(date);

    var temp = document.createElement("div");
    name.setAttribute("class","temp");
    temp.appendChild(document.createTextNode(x.temp+" degrees"));
    box2.appendChild(temp);

    var weather = document.createElement("div");
    name.setAttribute("class","weather");
    weather.appendChild(document.createTextNode(x.weather));
    box2.appendChild(weather);

    var img = document.createElement("img");
    img.setAttribute("src","http://forecast.weather.gov/newimages/medium/"+x.pict);
    box2.appendChild(img);

    box.appendChild(box2);
    container.appendChild(box);
  });
}

function addWeather(weather) {
  weatherList.push(weather);
}

function removeWeather(weather) {
  weatherList=weatherList.filter(x=>x!=weather);
  refresh();
}

function removeChildren(node) {
  while(node.firstChild) {
    node.removeChild(node.firstChild);
  }
}
