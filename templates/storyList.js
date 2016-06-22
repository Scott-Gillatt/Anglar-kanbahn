(function (){
    'use strict';
    var app = angular.module('ngKanban')

    .component('storyList', {
        templateUrl: 'templates/storyList.html',
        controller: storyListController,
        controllerAs: 'vm'
    });

    function storyListController() { 
        
    }
})()