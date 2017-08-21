var Promise = require("bluebird");
var request = require('request-promise');
var myToken = require('../private/myToken');
var dateFormat = require('dateformat');
var StattleshipAPI = require('node-stattleship');
var stattleship = new StattleshipAPI(myToken.token);

var headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Token token=' + myToken.token,
    'Accept': 'application/vnd.stattleship.com; version=1',
};


var endpoints = [{
    //MLB GAMES ON TODAY
    url: 'https://api.stattleship.com/baseball/mlb/games/?on=today',
    headers: headers
}, {
    //MLB TEAMS
    url: 'https://api.stattleship.com/baseball/mlb/teams',
    headers: headers
}];


var sportsAPI = {
    "mlbGamesToday": {}, "mlbTeams": {},
    "nhlGamesToday": {}, "nhlTeams": {},
    "nbaGamesToday": {}, "nbaTeams": {},
    "nflGamesToday": {}, "nflTeams": {}
};

var leagueNames = ["mlb", "nhl", "nba", "nfl"];

var games = {}; // empty Object
var key = 'mlb';
games[key] = []; // empty Array, which you can push() values into

var identifyTeamById = function (teamid) {
    return new Promise(function (resolve, reject) {
        for (i = 0; i < sportsAPI.mlbTeams.teams.length; i++) {
            if (sportsAPI.mlbTeams.teams[i].id === teamid) {
                console.log(teamid);
                resolve(i);
            }
        }
    });
};

//var mlbGamesToday = {};
//var mlbTeams = {};


request(endpoints[0]).then(function (body) {
    sportsAPI.mlbGamesToday = JSON.parse(body);

    return request(endpoints[1]);
}).then(function (body) {
    sportsAPI.mlbTeams = JSON.parse(body);
    //console.log(mlbTeams.teams[0].location);
});




module.exports = function (app) {

    app.get('/', function (req, res) {
        // var d = new Date(1494720600 * 1000);
        // d.toLocaleTimeString();
        // dateFormat(d, "shortTime");

        // console.log(mlbGamesToday.games[0].home_team_id);
        // teamElement = identifyTeamById(mlbGamesToday.games[0].home_team_id);
        // console.log(teamElement);
        // console.log(mlbTeams.teams[teamElement].location + ' ' + mlbTeams.teams[teamElement].nickname);
        //console.log("here");
        //console.log(sportsAPI.mlbGamesToday);

    

        for (i = 0; i < sportsAPI.mlbGamesToday.games.length; i++) {
            // homeTeamElement = identifyTeamById(sportsAPI.mlbGamesToday.games[0].home_team_id);
            // awayTeamElement = identifyTeamById(sportsAPI.mlbGamesToday.games[0].away_team_id);
            // homeTeamName = sportsAPI.mlbTeams.teams[homeTeamElement].location + ' ' + sportsAPI.mlbTeams.teams[homeTeamElement].nickname;
            // awayTeamName = sportsAPI.mlbTeams.teams[awayTeamElement].location + ' ' + sportsAPI.mlbTeams.teams[awayTeamElement].nickname;
            // console.log(homeTeamName + ' vs ' + awayTeamName);
            // console.log(homeTeamName);
            // console.log(awayTeamName);

            //  identifyTeamById(sportsAPI.mlbGamesToday.games[0].away_team_id).then(function(element) {
            //     awayTeamElement = element;
            //     awayTeamName = sportsAPI.mlbTeams.teams[awayTeamElement].location + ' ' + sportsAPI.mlbTeams.teams[awayTeamElement].nickname;
            //     console.log(awayTeamName);

            //     return identifyTeamById(sportsAPI.mlbGamesToday.games[0].home_team_id);
            //  }).then(function(element) {
            //     homeTeamElement = element;
            //     homeTeamName = sportsAPI.mlbTeams.teams[homeTeamElement].location + ' ' + sportsAPI.mlbTeams.teams[homeTeamElement].nickname;
            //     console.log(homeTeamName);

            //  }).catch(function(error) {
            //     console.log(error);
            //  });

            //awayTeamElement = identifyTeamById(sportsAPI.mlbGamesToday.games[i].away_team_id);
            //  homeTeamName = sportsAPI.mlbTeams.teams[homeTeamElement].location + ' ' + sportsAPI.mlbTeams.teams[homeTeamElement].nickname;
            //  awayTeamName = sportsAPI.mlbTeams.teams[awayTeamElement].location + ' ' + sportsAPI.mlbTeams.teams[awayTeamElement].nickname;
            //  console.log(homeTeamName + ' vs ' + awayTeamName);
            //  console.log(homeTeamName);
            //  console.log(awayTeamName);

            if (sportsAPI.mlbGamesToday.games[i].status === "upcoming") {
                var gameDate = new Date(sportsAPI.mlbGamesToday.games[i].timestamp * 1000);
                var timeString = dateFormat(gameDate, "shortTime");                
                
                games[key].push(sportsAPI.mlbGamesToday.games[i].label + ' at ' + timeString +
                    ' status: ' + sportsAPI.mlbGamesToday.games[i].status);
                
            } else if (sportsAPI.mlbGamesToday.games[i].status === "in_progress") {            
                games[key].push(sportsAPI.mlbGamesToday.games[i].label + ' ' + sportsAPI.mlbGamesToday.games[i].away_team_score + ' ' +
                    sportsAPI.mlbGamesToday.games[i].home_team_score);
                                
            } else {                        
                games[key].push(sportsAPI.mlbGamesToday.games[i].label + ' ' + sportsAPI.mlbGamesToday.games[i].away_team_score +
                    ' ' + sportsAPI.mlbGamesToday.games[i].home_team_score + ' ' + sportsAPI.mlbGamesToday.games[i].status);
            }

        }

        console.log(games);


        res.render('sportsApp', {
            //mlbGamesToday: mlbGamesToday
        });
    });
    

    app.get('/data/games', function (req, res) {
        res.json(games);
    });

    app.post('/', function (res, req) {

    });

    app.delete('/', function (res, req) {

    });
};
