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

		function updateStory(story){
			var orginal = stories.find(function (item){
				return item.id === story.id
			})

			orginal.name = story.name;
			orginal.details = story.details;
			saveToLocalStorage();
			return story;
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
			getStories: getStories,
			updateStory: updateStory
		};
	}]);	
})();