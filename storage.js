(function () {
	
	var app = angular.module('ngKanban');

	app.factory('storageService', ['$q', function ($q) {
		
		var STORAGE_ID = 'kanban-store';
		var stories = [];

		function addStory(story) {
			
			stories.push(story);
			saveToLocalStorage();

			return stories; 
		}	
		
		function getStories() {

			var deferred = $q.defer();

			stories = JSON.parse(localStorage.getItem(STORAGE_ID) || '[]');
			
			deferred.resolve(stories);
			
			return deferred.promise;
		}

		function saveToLocalStorage() {
			localStorage.setItem(STORAGE_ID, JSON.stringify(stories));
		}

		return {
			addStory: addStory,
			getStories: getStories
		};
	}]);	
})();