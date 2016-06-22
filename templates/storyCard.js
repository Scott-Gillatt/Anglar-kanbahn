(function (){
    'use strict';
    var app = angular.module('ngKanban')

    .component('storyCard', {
        templateUrl: 'templates/storyCard.html',
        controller: storyCardController,
        controllerAs: 'vm'
    });

    function storyCardController() { 
        
    }
})()