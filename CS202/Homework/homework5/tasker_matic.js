var currentUser = null;
var currentTasks = null;

function login(event){
  event.preventDefault();
  var username = document.getElementById("usernameInput").value;
  var password = document.getElementById("passwordInput").value;

  tasker.login(username,password,(user,error) => {
    if(error) {
      console.log(error);
    }else{
      document.getElementById("login").setAttribute("class","off");
      document.getElementById("home").setAttribute("class","on");
      tasker.tasks(user.id,(tasks,error)=>{
        if(error) {
          console.log(error);
        }else{
          currentUser=user;
          currentTasks=tasks;
          tableMaker(tasks);
          var greeting = document.createTextNode("Welcome "+user.name);
          document.getElementById('logout').appendChild(greeting);
        }
      });
    }
  });
  return false;
}

function tableMaker(tasks) {
  var table=document.getElementById("tasks");
  var header=document.createElement("tr");
  header.appendChild(makeLeaf("th","Discription"));
  header.appendChild(makeLeaf("th","Color"));
  header.appendChild(makeLeaf("th","Due"));
  header.appendChild(makeLeaf("th","Completed"));
  header.appendChild(makeLeaf("th",""));
  table.appendChild(header);
  for(var task in tasks) {
    var row = document.createElement("tr");
    row.appendChild(makeLeaf("td",tasks[task].desc));
    var cell = document.createElement("td");
    cell.appendChild(makeInput("color",tasks[task].color));
    row.appendChild(cell);

    cell = document.createElement("td");
    cell.appendChild(makeInput("date",tasks[task].due));
    row.appendChild(cell);

    cell = document.createElement("td");
    cell.appendChild(makeInput("checkbox",tasks[task].complete,cell,tasks[task].due));
    if((new Date().getTime() > tasks[task].due.getTime()) && !(tasks[task].complete)) {
      var exc = document.createElement("span");
      exc.setAttribute("class","glyphicon glyphicon-exclamation-sign red");
      cell.appendChild(exc);
    }

    row.appendChild(cell);

    cell = document.createElement("td");
    var trash = document.createElement("span");
    trash.setAttribute("class","glyphicon glyphicon-trash red btn btn-sm btn-danger");
    //trash.setAttribute("onclick","delete(event)");
    trash.addEventListener( 'click',() => deleteTask( tasks[task].id ) );
    cell.appendChild(trash);
    row.appendChild(cell);

    table.appendChild(row);
  }
}

function makeLeaf(type,text) {
  var node = document.createElement(type);
  node.appendChild(document.createTextNode(text));
  return node;
}

function makeInput(type,value) {
  var input = document.createElement("input");
  input.setAttribute("type",type);
  if(type == "checkbox" && value) {
    input.setAttribute("checked",value);
  }else if(type == "date"){
    input.setAttribute("value",datify(value));
  }else{
    input.setAttribute("value",value);
  }
  return input;
}

function datify(date) {
  var temp = date.getFullYear();
  if((date.getMonth()+1)>=10) {
    temp+="-"+(date.getMonth()+1);
  }else{
    temp+="-0"+(date.getMonth()+1);
  }
  if(date.getDate()>= 10) {
    temp+="-"+date.getDate();
  }else{
    temp+="-0"+date.getDate();
  }
  return temp;
}

function addTask() {
  event.preventDefault();
  var desc = document.getElementById("descField").value;
  var color = document.getElementById("cField").value;
  var date = document.getElementById("dField").value;
  date = date.split("-");
  date = new Date( date[0], --date[1], date[2] );

  tasker.add(currentUser.id, {desc:desc, color:color, due:date,complete:false,ownerId:currentUser.id}, (task,error)=>{
    if(error) {
      console.log(error);
    }else{
      tasker.tasks( currentUser.id, function( tasks, error ) {
         if( error ) {
            console.log(error);
         } else {
           currentTasks=tasks;
           displayedChanged();
         }
      } );
    }
  });
}

function deleteTask(id) {
  //why is this id for a task that i did not click on?
  //deletes the id of the task it was given but it always
  //seems to get the id of the last element
  console.log("find "+id);
  tasker.delete(currentUser.id, id, function(error){
    tasker.tasks( currentUser.id, function( tasks, error ) {
      if(error) {
        console.log(error);
      }else{
        currentTasks=tasks;
        displayedChanged();
      }
    });
  });
}


function searchTextChange() {
  displayedChanged();
}

function overdueChange() {
  displayedChanged();
}

function incompleteChange() {
  displayedChanged();
}

function displayedChanged() {
  console.log("changed");
  var table=document.getElementById("tasks");
  removeChildren(table);
  var text = document.getElementById('searchField').value;
  var onlyOverdue = document.getElementById('overdueBox').checked;
  var onlyIncomplete = document.getElementById('incompleteBox').checked;
  tableMaker(currentTasks.filter(task=>(task.desc.indexOf(text)>=0) &&
                                        checkingCompletion(task, onlyIncomplete) &&
                                        checkDue(task, onlyOverdue)));
}

function checkingCompletion(task, onlyIncomplete){
  if(onlyIncomplete) {
    return !task.complete;
  }else{
    return true;
  }
}

function checkDue(task, onlyOverdue) {
  if(onlyOverdue) {
    return ((new Date().getTime() > task.due.getTime()) && !task.complete);
  }else {
    return true;
  }
}

function getById(id) {
  console.log(currentTasks.filter(t=>t.id==id));
}

function logout() {
  document.getElementById("login").setAttribute("class","on");
  document.getElementById("home").setAttribute("class","off");
  tasker.logout();
  currentUser=null;
  currentTasks=null;
  removeChildren(document.getElementById('logout'));
}

function removeChildren(node) {
  while(node.firstChild) {
    node.removeChild(node.firstChild);
  }
}
