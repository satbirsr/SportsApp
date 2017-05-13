var myToken = require('../private/myToken');
var StattleshipAPI = require('node-stattleship');
var stattleship = new StattleshipAPI(myToken.token);
//okay i wrote something
var request = require('request');
var headers = {
   'Content-Type': 'application/json',
   'Authorization': 'Token token='+ myToken.token,
   'Accept': 'application/vnd.stattleship.com; version=1',
};


var options = {
   url: 'https://api.stattleship.com/baseball/mlb/games/?on=today',
   headers: headers
};

var gamesToday = {};

function callback(error, response, body) {
   if (!error && response.statusCode == 200) {
      gamesToday = body;
   }
}

request(options, callback);

module.exports = function(app) {

   app.get('/', function(req, res) {
      res.render('sportsApp', {games: gamesToday});
      //console.log(data);
   });

   app.post('/', function(res, req) {

   });

   app.delete('/', function(res, req) {

   });
};
