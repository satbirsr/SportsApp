var express = require('express');
var sportsAppController = require('./controllers/sportsAppController');
var app = express();

app.set('view engine', 'ejs');
app.use(express.static('./public'));
app.use(express.static('./controllers'));

sportsAppController(app);

app.listen(3000);
console.log("listening to port 3000");








//******************WORKING: GAMES ON TODAY WITHOUT NPM MODULE**************





//*************************************************************************



// //******************WORKING: GAMES ON TODAY WITHOUT NPM MODULE**************

// var options = {
//     url: 'https://api.stattleship.com/baseball/mlb/games/?on=today',
//     headers: headers
// };

// function callback(error, response, body) {
//     if (!error && response.statusCode == 200) {
//         console.log(body);
//     }
// }

// request(options, callback);

// //*************************************************************************







// var params = {
// 	on: "today",
// 	team_id: "nhl-tor",
// 	//stat_type: "games_won"
// };

// stattleship.team_game_logs('hockey', 'nhl', params).then(function(team_game_logs) {
//   team_game_logs.forEach(function(element, index, array) {
//     console.log(element.goals_against_average);
//   });
// });




// //***********WORKING: SCHEDULED GAMES AND SCORES ********************
// var params = {
// 	on: "today",
// 	//team_id: "nhl-tor"
// };

// stattleship.games('hockey', 'nhl', params).then(function(games) {
//   games.forEach(function(element, index, array) {
//     console.log(element.name, element.scoreline, element.period);
//   });
// });
// //********************************************************


// //*************WORKING: LIST OF TEAMS *******************************
// //*******(NEED FIXING FOR CITIES WITH MULTIPLE TEAMS [NY, LA, ETC])*******
// var params = {
// 	on: "today",
// };
// stattleship.teams('hockey', 'nhl', params).then(function(teams) {
//   teams.forEach(function(element, index, array) {
// 		console.log(element.name, element.nickname);
//   });
// });
// //********************************************************
