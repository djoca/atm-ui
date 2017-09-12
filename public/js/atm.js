var atmApp = angular.module("atmApp", []);

atmApp.controller("atmController", ["$scope", "$http", function($scope, $http) {

    var currentState = "menu";

    $scope.isPageState = function(state) {
        return state == currentState;
    }

    $scope.showMenu = function() {
        currentState = "menu";
    }

    $scope.showDepositForm = function() {
        currentState = "deposit";
    }

    $scope.showWithdrawForm = function() {
        currentState = "withdraw";
    }

    $scope.deposit = function(form) {
        console.log("deposit %s", JSON.stringify(form));
    }

    $scope.withdraw = function(form) {
        console.log("withdraw %s", JSON.stringify(form));
    }

}]);