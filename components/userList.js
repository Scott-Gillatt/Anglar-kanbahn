(function () {

    var app = angular.module('ngKanban');

    app.component('userList', {
        templateUrl: 'templates/userList.html',
        controller: userListController,
        controllerAs: 'ul'
    });

    userListController.$inject = ['$scope', '$timeout', 'firebaseService', '$uibModal'];


    function userListController($scope, $timeout, firebaseService, $uibModal) {

        var ul = this;

        $scope.$on('userlist-updated', function (event, users) {
            $timeout(function () {
                $scope.$apply(function () {
                    ul.users = users.filter(function(item){
                    return item.id !== firebase.auth().currentUser.uid;    
                });
                });
            }, 100);
        });

        ul.$onInit = function () {
            updateList();
        }

        function updateList() {
            firebaseService.getOnlineUsers().then(
                function (users) {
                    ul.users = users.filter(function(item){
                        return item.id !== firebase.auth().currentUser.uid;
                });
                    
                    console.log(users);
                }
            );
        }

        ul.userChat = function (user) {
            var modalInstance = $uibModal.open({
                templateUrl: 'userChatModal.html',
                controller: 'userChatController',
                controllerAs: 'ul',
                resolve: {
                    user: function(){
                        return user
                    }
                }
            });

            modalInstance.result.then(
                function () {

                },
                function () {
                    // cancelled
                }
            );
        }

    }
    app.controller('userChatController', userChatController)
    userChatController.$inject = ['firebaseService', '$uibModalInstance', 'user', ]

    function userChatController(firebaseService, $uibModalInstance, user) {
        var ul = this;
        ul.members = [];
        
        ul.members.push(firebase.auth().currentUser);
        ul.members.push(user);

        console.log(ul.members);

        ul.chat = {
            info: 'Hello'
        };

        ul.send = function () {
            $uibModalInstance.close();
        };

        ul.close= function(){
            $uibModalInstance.close();
        }
    }

})();