var sportsApp = angular.module("sportsApp", ['ngAnimate', 'ui.bootstrap']);

sportsApp.controller("frontController", ['$scope', '$http', '$interval', function ($scope, $http, $interval) {
    $scope.firstName = "John";
    $scope.lastName = "Doe";

    $scope.myData = {
        firstname: 'John',
        lastname: 'Doe',
        employer: 'Stackoverflow'
    };
    
    fetchDataFromBackend();

    $interval(function () {
        fetchDataFromBackend();
    }, 30000);

    function fetchDataFromBackend() {
        $http({
            method: 'GET',
            url: '/data/games'

        }).then(function (success) {
            $scope.games = success.data;

        }, function (error) {
            console.log("Could not fetch data from /data/games");
        });
    }

}]);