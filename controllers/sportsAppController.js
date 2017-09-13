var Promise = require("bluebird");
var request = require('request-promise');
// require('request-debug')(request);
var myToken = require('../private/myToken');
var dateFormat = require('dateformat');
var StattleshipAPI = require('node-stattleship');
var stattleship = new StattleshipAPI(myToken.token);

var headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Token token=' + myToken.token,
    'Accept': 'application/vnd.stattleship.com; version=1',
};

var gameEndpoints = [{
    //MLB GAMES ON TODAY
    url: 'https://api.stattleship.com/baseball/mlb/games/?on=today',
    headers: headers
}, {
    //MLB TEAMS
    url: 'https://api.stattleship.com/baseball/mlb/teams',
    headers: headers
}];

var logEndpoints = [{
    //MLB GAME LOGS
    url: 'https://api.stattleship.com/baseball/mlb/game_logs/?on=today',
    headers: headers
}];

var stattleAPI = [
    { "league": "mlb", "gamesToday": {}, "gamesYesterday": {}, "gamesTomorrow": {}, "teams": {}, "gameLogs": [{}] },
    { "league": "nba", "gamesToday": {}, "gamesYesterday": {}, "gamesTomorrow": {}, "teams": {}, "gameLogs": [{}] },
    { "league": "nfl", "gamesToday": {}, "gamesYesterday": {}, "gamesTomorrow": {}, "teams": {}, "gameLogs": [{}] },
    { "league": "nhl", "gamesToday": {}, "gamesYesterday": {}, "gamesTomorrow": {}, "teams": {}, "gameLogs": [{}] }
];

var leagueNames = ["mlb", "nhl", "nba", "nfl"];

var key = 'mlb';
var games = {}; // empty Object
games[key] = []; // empty Array, which you can push() values into
var logs = {};
logs[key] = [];
var isPaginated, totalItems;

fetchAndOrganizeData();

setInterval(function () {
    // logEndpoints = []; // Clear games and reload data
    games[key] = [];
    logs[key] = [];
    fetchAndOrganizeData();
    console.log("-----------------------------------");
}, 180000);







//----------------------------FUNCTIONS----------------------------------
function fetchAndOrganizeData() {
    //FETCH GAMES
    Promise.map(gameEndpoints, function (obj) {
        return request(obj, function (error, response, body) {
        }).then(function (body) {
            return JSON.parse(body);
        });

    }).then(function (gameResults) {
        stattleAPI[0].gamesToday = gameResults[0];
        stattleAPI[0].teams = gameResults[1];

    }, function (err) {
        // handle all your errors here
    }).then(function () {
        for (i = 0; i < stattleAPI[0].gamesToday.games.length; i++) {

            var gameDate = new Date(stattleAPI[0].gamesToday.games[i].timestamp * 1000);
            var timeString = dateFormat(gameDate, "shortTime");
            var teams = stattleAPI[0].gamesToday.games[i].label.split(" vs ");

            for (j = 0; j < stattleAPI[0].teams.teams.length; j++) {
                if (stattleAPI[0].teams.teams[j].id === stattleAPI[0].gamesToday.games[i].away_team_id) {
                    teams[0] = stattleAPI[0].teams.teams[j].location + " " + stattleAPI[0].teams.teams[j].nickname;
                }
            }
            for (j = 0; j < stattleAPI[0].teams.teams.length; j++) {
                if (stattleAPI[0].teams.teams[j].id === stattleAPI[0].gamesToday.games[i].home_team_id) {
                    teams[1] = stattleAPI[0].teams.teams[j].location + " " + stattleAPI[0].teams.teams[j].nickname;
                }
            }

            console.log(teams[0] + " vs " + teams[1]);



            //Generating Status of each game (Upcoming, In progress, Final)
            if (stattleAPI[0].gamesToday.games[i].status === "upcoming") {
                customStatus = "@ " + timeString;
                stattleAPI[0].gamesToday.games[i].away_team_score = "";
                stattleAPI[0].gamesToday.games[i].home_team_score = "";
                makeGameLog = "false";

            } else if (stattleAPI[0].gamesToday.games[i].status === "in_progress") {

                if (stattleAPI[0].gamesToday.games[i].clock === ":30") {
                    topbottom = "BOT";
                } else {
                    topbottom = "TOP";
                }

                //1st, 2nd, 3rd, Xth... inning
                if (stattleAPI[0].gamesToday.games[i].period === 1) {
                    customStatus = topbottom + " " + stattleAPI[0].gamesToday.games[i].period + "st";
                } else if (stattleAPI[0].gamesToday.games[i].period === 2) {
                    customStatus = topbottom + " " + stattleAPI[0].gamesToday.games[i].period + "nd";
                } else if (stattleAPI[0].gamesToday.games[i].period === 3) {
                    customStatus = topbottom + " " + stattleAPI[0].gamesToday.games[i].period + "rd";
                } else {
                    customStatus = topbottom + " " + stattleAPI[0].gamesToday.games[i].period + "th";
                }

                makeGameLog = "true";

            } else {
                customStatus = "Final";
                makeGameLog = "true";
            }

            //Push game to backend json data
            games[key].push({
                awayTeam: teams[0],
                homeTeam: teams[1],
                awayScore: stattleAPI[0].gamesToday.games[i].away_team_score,
                homeScore: stattleAPI[0].gamesToday.games[i].home_team_score,
                time: timeString,
                status: customStatus,
                id: stattleAPI[0].gamesToday.games[i].id,
                makeGameLog: makeGameLog
            });
        }

        //FETCH GAME LOGS
    }).then(function () {
        return request(logEndpoints[0], function (error, response, body) {

            console.log(response.headers.total);
            totalItems = response.headers.total;

            if (response.headers.link) { //If source has multiple pages
                isPaginated = true;
                linkHeader = response.headers.link;
                console.log("Source has multiple pages");

            }
        }).then(function (body) {
            // console.log(body);            
            return JSON.parse(body);
        }).then(function (results) {

            stattleAPI[0].gameLogs[0] = results; //Store first page

            if (isPaginated) { //If multiple pages, get the other pages as well
                fetchMultiplePages(linkHeader, function () {
                    organizeLogs();
                });
            } else if (totalItems > 0) {
                organizeLogs();
            }

            // for (i = 0; i < logEndpoints.length; i++) {
            //     stattleAPI[0].gameLogs[i] = "c";
            // }
            // console.log(results);
        }).then(function () {
            // setTimeout(function() {
            //     console.log(stattleAPI[0].gameLogs[1]);
            // }, 5000);

        })

    });
}

function fetchMultiplePages(linkHeader, callback) {

    console.log(linkHeader);

    var lastPageString = linkHeader.match(/page=\d*>; rel="last"/);
    var nPages = lastPageString[0].match(/\d+/);
    console.log(nPages[0]);

    logEndpoints = [];

    logEndpoints.push({
        url: 'https://api.stattleship.com/baseball/mlb/game_logs/?on=today',
        headers: headers
    });

    for (i = 2; i <= nPages; i++) {
        logEndpoints.push({
            url: 'https://api.stattleship.com/baseball/mlb/game_logs/?on=today&page=' + i,
            headers: headers
        });
    }

    for (i = 0; i < logEndpoints.length; i++) {
        console.log(logEndpoints[i].url);
    }

    Promise.map(logEndpoints, function (obj) {
        return request(obj, function (error, response, body) {
        }).then(function (body) {
            // console.log("heya");
            return JSON.parse(body);


        });

    }).then(function (logResults) {
        for (i = 1; i < logEndpoints.length; i++) {
            stattleAPI[0].gameLogs[i] = logResults[i];
        }
        // console.log("sup?");

        callback();

        // console.log(stattleAPI[0].gameLogs[1]);

    }, function (err) {
        // handle all your errors here
    })
}

function organizeLogs() {

    for (h = 0; h < stattleAPI[0].gameLogs.length; h++) {

        for (i = 0; i < stattleAPI[0].gameLogs[h].players.length; i++) {

            //Get Player's Team
            for (j = 0; j < stattleAPI[0].teams.teams.length; j++) {
                if (stattleAPI[0].gameLogs[h].players[i].team_id === stattleAPI[0].teams.teams[j].id) {
                    var teamName = stattleAPI[0].teams.teams[j].location + " " + stattleAPI[0].teams.teams[j].nickname;
                }
            }

            // Get Player's Game Stats
            for (j = 0; j < stattleAPI[0].gameLogs[h].game_logs.length; j++) {
                if (stattleAPI[0].gameLogs[h].players[i].id === stattleAPI[0].gameLogs[h].game_logs[j].player_id) {
                    atBats = stattleAPI[0].gameLogs[h].game_logs[j].at_bats;
                    runs = stattleAPI[0].gameLogs[h].game_logs[j].runs;
                    hits = stattleAPI[0].gameLogs[h].game_logs[j].hits;
                    rbi = stattleAPI[0].gameLogs[h].game_logs[j].runs_batted_in;
                    walks = stattleAPI[0].gameLogs[h].game_logs[j].walks;
                    strikeouts = stattleAPI[0].gameLogs[h].game_logs[j].strikeouts;
                    lob = stattleAPI[0].gameLogs[h].game_logs[j].left_on_base;
                    avg = stattleAPI[0].gameLogs[h].game_logs[j].batting_average;
                    onbaseperc = stattleAPI[0].gameLogs[h].game_logs[j].on_base_percentage;
                    onbase_slugging = stattleAPI[0].gameLogs[h].game_logs[j].on_base_plus_slugging;
                    id = stattleAPI[0].gameLogs[h].game_logs[j].player_id;
                    game_id = stattleAPI[0].gameLogs[h].game_logs[j].game_id;
                }
            }

            logs[key].push({
                playerName: stattleAPI[0].gameLogs[h].players[i].first_name + " "
                + stattleAPI[0].gameLogs[h].players[i].last_name,
                position: stattleAPI[0].gameLogs[h].players[i].position_abbreviation,
                teamName: teamName,
                atBats: atBats,
                runs: runs,
                hits: hits,
                rbi: rbi,
                walks: walks,
                strikeouts: strikeouts,
                lob: lob,
                avg: avg,
                onbaseperc: onbaseperc,
                onbase_slugging: onbase_slugging,
                id: id,
                game_id: game_id
            });
        }
    }

}

var identifyTeamById = function (teamid) {
    return new Promise(function (resolve, reject) {
        for (i = 0; i < stattleAPI[0].teams.teams.length; i++) {
            if (stattleAPI[0].teams.teams[i].id === teamid) {
                console.log(teamid);
                resolve(i);
            }
        }
    });
};
//--------------------------------------------------------------------------


//--------------------------------ROUTES-------------------------------------

module.exports = function (app) {

    app.get('/', function (req, res) {
        res.render('sportsApp', {
            //mlbGamesToday: mlbGamesToday
        });
    });

    app.get('/popover.ejs', function (req, res) {
        res.render('popover.ejs', {
            //mlbGamesToday: mlbGamesToday
        });
    });

    app.get('/data/games', function (req, res) {
        res.json(games);
    });

    app.get('/data/logs', function (req, res) {
        // res.json(stattleAPI[0].gameLogs[1]);
        res.json(logs);
    });

    app.get('/data/rawjson', function (req, res) {
        res.json(stattleAPI[0].gamesToday);
        // res.json(stattleAPI[0].gameLogs);
    });

    app.get('/data/teams', function (req, res) {
        res.json(stattleAPI[0].teams);
        // res.json(stattleAPI[0].gameLogs);
    });

    app.post('/', function (res, req) {

    });

    app.delete('/', function (res, req) {

    });
};





//***************PROMISE MAP***************** */
// Promise.map(endpoints, function (obj) {
//     return request(obj).then(function (body) {
//         console.log(response.statusCode);
//         console.log("here");
//         return JSON.parse(body);
//     });

// }).then(function (results) {
//     // stattleAPI.mlbGamesToday = results[0];
//     // stattleAPI.mlbTeams = results[1];
//     stattleAPI[0].gamesToday = results[0];
//     stattleAPI[0].teams = results[1];
//     stattleAPI[0].gameLogs = results[2];

//     //console.log(results[2].headers);

// }, function (err) {