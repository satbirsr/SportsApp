var sportsApp = angular.module("sportsApp", []);

sportsApp.controller("frontController", ['$scope', '$http', function ($scope, $http) {
    $scope.firstName = "John";
    $scope.lastName = "Doe";

    console.log($scope.firstName + $scope.lastName);

    $http({
        method: 'GET',
        url: '/data/games'
    }).then(function (success) {
        $scope.ninjas = success.data;

    }, function (error) {

    });

}]);