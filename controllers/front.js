var sportsApp = angular.module("sportsApp", []);

sportsApp.controller("frontController", ['$scope', '$http', '$interval', function ($scope, $http, $interval) {
    $scope.firstName = "John";
    $scope.lastName = "Doe";

    fetchDataFromBackend();

    $interval(function () {
        fetchDataFromBackend();
    }, 5000);


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