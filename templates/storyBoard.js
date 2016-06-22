(function () {
    'use strict';
    var app = angular.module('ngKanban')

        app.component('storyBoard', {
            templateUrl: 'templates/storyBoard.html',
            controller: storyBoardController,
            controllerAs: 'vm'
        });

    app.controller('listModalController', listModalController())

    storyBoardController.$inject = ['$uibModal', 'storageService']

    function storyBoardController($uibModal, storageService) {
        
        var vm = this;
        vm.addList = function () {

            vm.lists = [];

            var modalInstance = $uibModal.open({
                templateUrl: 'addListModal.html',
                controller: 'listModalController',
                controllerAs: 'vm',
                //This Resolve is if you want to pass data into the modal
                resolve: {
                    list: function () {
                        return null;
                    }
                }
            });

            modalInstance.result.then(
                function (newList) {
                    guidService.getGuid().then(
                        function (response) {

                            // var newStory = angular.copy(vm.newStory);

                            newList.id = response.data;

                            vm.lists.push(newList);
                            // vm.lists = storageService.addList(newList);
                        }
                    ).catch(
                        function (err) {
                            console.log('Something went wrong: ', err);
                        }
                        );
                },
                function () {

                }
            );
        };
    }

    listModalController.$inject = ['$uibModalInstance', 'list']

    function listModalController($uibModalInstance, list) {
        var vm = this;

        vm.isEdit = list ? true : false;
        vm.list = list || {
            name: '',
            description: ''
        };

        vm.ok = function () {
            $uibModalInstance.close(vm.list);
        };
        vm.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }


})()