/* user is an object of type
 * { email : <string>,
 *   password : <string>,
 *   id : <string>
 * }
 */
function User( email, password) {
   this.email = email;
   this.password = password;
   var colors = {guessBackground : "#ffffff" , textBackground : "#000000", wordBackground : "#888888" };
   var font = {category: 'Concert One', family: 'cursive', url: "https://fonts.googleapis.com/css?family=Concert+One"};
   this.default = {font : JSON.stringify(font), level : "medium", colors : JSON.stringify(colors)};
}

module.exports = User;
