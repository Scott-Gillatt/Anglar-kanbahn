(function () {

    var app = angular.module('ngKanban');

    app.component('userList', {
        templateUrl: 'templates/userList.html',
        controller: userListController,
        controllerAs: 'ul'
    });

    userListController.$inject = ['$scope', 'firebaseService'];

    function userListController($scope, firebaseService) {

        var ul = this;

        $scope.$on('userlist-updated', function (event, data) {
            updateList();
        })

        ul.$onInit = function () {
            updateList();
        }

        function updateList() {
            firebaseService.getOnlineUsers().then(
                function (users) {
                    ul.users = users;
                    console.log(users)
                }
            );
        }

    }



})()