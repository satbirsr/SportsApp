var sportsApp = angular.module("sportsApp", ['ngAnimate', 'ui.bootstrap']);

sportsApp.controller("frontController", ['$scope', '$http', '$interval', function ($scope, $http, $interval) {

    fetchDataFromBackend();

    $interval(function () {
        fetchDataFromBackend();
    }, 60000);

    // $scope.showPopover = false;



    $scope.popoverOpened1 = false;


    $scope.rowNames = ['linear', 'quadratic'];
    $scope.rowData = {
        'linear': [1, 2, 3, 4, 5, 6],
        'quadratic': [1, 4, 9, 16, 25, 36]
    };

    $scope.getRowData = function (row) {
        console.log("getRowData: " + row);
        return $scope.rowData[row];
    }
    
    $scope.filterCells = function (v) {
        return v > 5.0 ? 'true' : 'false';
    };


    //------------------------------------------------------------------------------
    //-------------------------------FUNCTIONS--------------------------------------
    function fetchDataFromBackend() {
        $http({
            method: 'GET',
            url: '/data/games'

        }).then(function (success) {
            $scope.games = success.data;

        }, function (error) {
            console.log("Could not fetch data from /data/games");
        });

        $http({
            method: 'GET',
            url: '/data/logs'

        }).then(function (success) {
            $scope.logs = success.data;

        }, function (error) {
            console.log("Could not fetch data from /data/logs");
        });
        
    }
    
    $scope.filterPopover = function (v) {
        console.log(v);
        
        if ( v === "@ 7:10 PM") {
            // console.log(v);
            
            return true;
        } else {
            console.log('false');
            
            return false;
        }    
    };
}]);