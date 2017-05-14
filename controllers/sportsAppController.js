var myToken = require('../private/myToken');
var dateFormat = require('dateformat');
var StattleshipAPI = require('node-stattleship');
var stattleship = new StattleshipAPI(myToken.token);

var request = require('request');
var headers = {
   'Content-Type': 'application/json',
   'Authorization': 'Token token='+ myToken.token,
   'Accept': 'application/vnd.stattleship.com; version=1',
};


var options = {
   url: '',
   headers: headers
};

var mlbGamesToday, mlbTeams = {};




function callback(error, response, body) {
   if (!error && response.statusCode == 200) {
      mlbGamesToday = storeJSON("https://api.stattleship.com/baseball/mlb/games/?on=today", body);
      // mlbTeams = storeJSON("https://api.stattleship.com/baseball/mlb/teams", body);
      // if (options.url === "https://api.stattleship.com/baseball/mlb/games/?on=today") {
      //    mlbGamesToday = body;
      //    mlbGamesToday = JSON.parse(mlbGamesToday);
      // }
      // if (options.url === "https://api.stattleship.com/baseball/mlb/teams") {
      //    mlbGamesToday = body;
      //    mlbGamesToday = JSON.parse(mlbTeams);
      // }
   }
}



function storeJSON(link, body) {
   if (options.url === link) {
      return JSON.parse(body);
   }
}

options.url = 'https://api.stattleship.com/baseball/mlb/games/?on=today';
request(options, callback);
// options.url = 'https://api.stattleship.com/baseball/mlb/teams';
// request(options, callback);


function identifyTeamById (teamid) {

}

module.exports = function(app) {

   app.get('/', function(req, res) {
      var d = new Date(1494720600*1000);
      d.toLocaleTimeString();
      dateFormat(d, "shortTime");
      console.log(d);
      //console.log(mlbTeams.teams[0].location);
      for (i = 0; i < mlbGamesToday.games.length; i++) {

         if (mlbGamesToday.games[i].status === "upcoming") {
            var gameDate = new Date(mlbGamesToday.games[i].timestamp*1000);
            var timeString = dateFormat(gameDate, "shortTime");
            console.log(mlbGamesToday.games[i].label + ' at ' + timeString + ' status: ' + mlbGamesToday.games[i].status);

         } else if (mlbGamesToday.games[i].status === "in_progress") {
            console.log(mlbGamesToday.games[i].label + ' ' + mlbGamesToday.games[i].away_team_score +
            ' ' + mlbGamesToday.games[i].home_team_score);
         } else {
            console.log(mlbGamesToday.games[i].label + ' ' + mlbGamesToday.games[i].away_team_score +
            ' ' + mlbGamesToday.games[i].home_team_score + ' ' + mlbGamesToday.games[i].status);
         }
      }

      res.render('sportsApp', {mlbGamesToday: mlbGamesToday});
   });

   app.post('/', function(res, req) {

   });

   app.delete('/', function(res, req) {

   });
};
