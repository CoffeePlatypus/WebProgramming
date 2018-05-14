var app = angular.module('Lab.App', ['ngRoute','ngSanitize']);

var strVar ="";
strVar += " <p>";
strVar += "              Every valid email address contains a single '@' character and no spaces.  Text";
strVar += "              before the '@' is known as the <code>username<\/code>.  Text after the '@' character is known as the";
strVar += "              <code>domain<\/code>.  A valid email address must have a non-empty <code>username<\/code> and <code>domain<\/code>.";
strVar += "            <\/p>";
strVar += "";
strVar += "            <p>";
strVar += "              Write a function named <code>parseEmail<\/code> that accepts a single string as input.  If";
strVar += "              the string is a valid email, then return an object having two properties: <code>username<\/code>";
strVar += "              and <code>domain<\/code> that contain the corresponding text from the email.  If the input string";
strVar += "              is not a valid email, then return undefined.";
strVar += "            <\/p>";
strVar += "";

var p1 = {
   id : 'p1',
   title : "Parsing Emails",
   name : "parseEmail",
   description : strVar,
   selectedExample : null,
   examples : [
      { input : "khunt@uwlax.edu",
        output : { username : 'khunt', domain : 'uwlax.edu' }
      },
      { input : 'aaron.rogers@green.bay.packers.com',
        output: { username : 'aaron.rogers', domain : 'green.bay.packers.com' }
      },
      { input : 'khunt',
        output : undefined
      },
      { input : '@uwlax.edu',
        output : undefined
      },
      { input : '@',
        output : undefined
      }
   ],
   "interactionInput" : '',
   "interactionOutput" : ''
}


strVar="";
strVar += "<p>";
strVar += "              Every NFL game involves two teams; each of which is associated with a score. One team";
strVar += "              is known as the <b>home<\/b> team while the other is known as the <b>away<\/b> team.  Each of the two";
strVar += "              teams is said to be an opponent of the other.  A team is said to be a winner if that";
strVar += "              team scores more points than their opponent.";
strVar += "            <\/p>";
strVar += "";
strVar += "            <p>";
strVar += "              Write a function named <code>winners<\/code> that accepts a single input of array type.  The";
strVar += "              array contains objects of the form shown below.  The function must return a list of strings";
strVar += "              that contains the winner of each game.  If a game doesn't have a winner (i.e. it ends in a tie), return the string \"tie\".";
strVar += "            <\/p>";
strVar += "            ";
strVar += "            <div style=\"text-align: center\">";
strVar += "              <code>{ home : { name : &lt;string&gt;, score : &lt;number&gt; }, away : { name : &lt;string&gt;, score : &lt;number&gt; } }<\/code>       ";
strVar += "            <\/div>";

var p2 = {
   id : 'p2',
   title : "Picking Winners",
   name : "winners",
   description : strVar,
   selectedExample : null,
   examples : [
      { input : [{home:{name:'Rams', score:3}, away:{name:'Packers', score:33} }],
        output : ['Packers']
      },
      { input : [{home:{name:'Rams', score:3}, away:{name:'Packers', score:3} }],
        output: ['tie']
      },
      { input: [{home:{name:'Rams', score:3}, away:{name:'Pack', score:33}},
                {home:{name:'Rams', score:13}, away:{name:'Lions', score:3}}],
        output : ['Pack', 'Rams']
      },
      {
         input : [],
         output : []
      }
   ],
   "interactionInput" : '',
   "interactionOutput" : ''
}

 strVar="";
strVar += "<p>";
strVar += "Consider a situation where multiple candidates run for office in a national election.  A system is designed such that a";
strVar += "single vote is submitted as the name of the candidate for which some person voted.";
strVar += "<\/p>";
strVar += "<p>";
strVar += "Write a function named <b>rank<\/b> that accepts a list of names (<i>each name is a vote for that candidate<\/i>) and returns ";
strVar += "a list of the candidates in order of most-votes-received to least-votes-received.  If two-or-more candidates receive the same ";
strVar += "vote total, they should be listed in alphabetical order.  The submitted votes should be treated in a case-insensitive manner.";
strVar += "<\/p>";

var p3 = {
   id : 'p3',
   title : "Counting Votes",
   name : "rank",
   description : strVar,
   selectedExample : null,
   examples : [
      { input : ['Ann', 'jack', 'milo', 'jack', 'jack', 'anN' ],
        output : ['jack', 'ann', 'milo' ]
      },
      {
         input : ['Ann', 'ANN', 'jack', 'milo', 'jack', 'JACK', 'ann' ],
         output : ['ann', 'jack', 'milo']
      },
      {
         input : [],
         output : []
      }
   ],
   "interactionInput" : '',
   "interactionOutput" : ''
}

app.controller('Lab.App.Controller', [ '$scope', '$sce', function( $scope, $sce ) {
   $scope.trusted = function( txt ) {
      return $sce.trustAsHtml( txt );
   }
   $scope.display = function(x) {
      if( _.isArray(x) && x.length == 0 ) return '[]';
      if( x == '' ) return '';
      if( x === null ) return "null";
      if( x === undefined ) return "undefined";
      var x = JSON.stringify( x );
      return x.replace( /"(\w+)":/g, '$1:' );
   };

   $scope.apply = function( lab ) {
      var f = window[lab.name] || function() { return "Function '" + lab.name + "' not found."; };
      try {
         if( lab.selectedExample ) {
            lab.interactionOutput = f( lab.selectedExample.input );
         } else {
            lab.interactionOutput = f( JSON.parse(lab.interactionInput) );
         }
      } catch(e) {
         alert(e);
      }
   }

   $scope.clear = function( lab ) {
      lab.selectedExample = null;
   }

   $scope.validates = function( lab ) {
      if( lab.selectedExample ) {
         return $scope.display(lab.interactionOutput) === $scope.display(lab.selectedExample.output);
      } else {
         return "maybe";
      }
   }

   $scope.selectExample = function( lab, ex ) {
      lab.selectedExample = ex;
      lab.interactionInput = $scope.display(ex.input);
   }
   
   $scope.problems = [ p1, p2, p3 ];
} ] );
