var atmApp = angular.module("atmApp", []);

atmApp.controller("atmController", ["$scope", "$http", "$location", function($scope, $http, $location) {

    var currentState = "menu";

    $scope.isPageState = function(state) {
        return state == currentState;
    }

    $scope.showMenu = function() {
        currentState = "menu";
    }

    $scope.showDepositForm = function() {
        resetDepositForm();
        currentState = "deposit";
    }

    $scope.showWithdrawForm = function() {
        currentState = "withdraw";
    }

    resetDepositForm = function() {
        $scope.amountBills = [
            { value: 2, quantity: 0 },
            { value: 5, quantity: 0 },
            { value: 10, quantity: 0 },
            { value: 20, quantity: 0 },
            { value: 50, quantity: 0 },
            { value: 100, quantity: 0 }
        ]
    }

    $scope.increaseAmount = function(bill) {
        bill.quantity++;
    }

    $scope.decreaseAmount = function(bill) {
        if (bill.quantity > 0) {
            bill.quantity--;
        }
    }
    /*
     * Make a deposit
     */
    $scope.deposit = function(form) {
        console.log("deposit %s", JSON.stringify(form));

        var data = $scope.amountBills;

        httpRequest("/account/" + form.accountNumber + "/deposit", data, function(response) {
            showDepositModal(response.data);
        });
    }

    showDepositModal = function(data) {
        $("#deposit-modal").modal("show");
        console.log(data);
        $scope.depositModalMessage = data;
    }

    /* 
     * Make a withdraw
     */
    $scope.withdraw = function(form) {
        console.log("withdraw %s", JSON.stringify(form));

        var data = {
            amount: form.amount
        };

        httpRequest("/account/" + form.accountNumber + "/withdrawal", data, function(response) {
            showWithdrawalModal(response.data);
        });
    }

    /*
     * Show withdrawal success modal
     */
    showWithdrawalModal = function(data) {
        $("#withdraw-modal").modal("show");
        $scope.withdrawalModalMessage = data;
    }

    $scope.hasErrorMessage = function() {
        return $scope.errorMessage;
    }

    $scope.dismissAlert = function() {
        $scope.errorMessage = null;
    }

    /*
     * Display generic error message
     */
    showGeneralErrorMessage = function(message) {
        $scope.errorMessage = message;
    }

    /*
     * Handles HTTP requests
     */
    var httpRequest = function(service, data, successCallback, errorCallback) {
        $scope.dismissAlert();
        var httpServer = $location.protocol() + "://" + $location.host() + ":9000";

        $http({
            method: "POST",
            url: httpServer + service, 
            data: data 
        }).then( function (response) {
            if (successCallback) {
                successCallback(response);
            }
        }, function (response) {
            if (!errorCallback || !errorCallback(response)) {
                if (response.data.exception) {
                    showGeneralErrorMessage(response.data.exception);
                } else {
                    showGeneralErrorMessage("Problemas ao acessar servidor. Tente mais tarde.");      
                }
            }
        });
    }

}]);