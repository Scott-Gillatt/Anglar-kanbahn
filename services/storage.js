(function () {
	
	var app = angular.module('ngKanban');

	app.factory('storageService', ['$q', function ($q) {
		
		var LIST_STORAGE_ID = 'kanban-list-store';
		var STORY_STORAGE_ID = 'kanban-story-store';
		var lists = [];
		var stories = [];

		function addList(list) {
			
			lists.push(list);
			saveToLocalStorage();

			return lists; 
		}	

		function updateList(list) {

			var original = lists.find(function (item) {
				return item.id === list.id;
			})

			original.name = list.name;
			original.description = list.description;
			
			saveToLocalStorage();

			return lists;
		}

		function deleteList(list) {

			lists = lists.filter(function (item) {
				return item.id !== list.id;
			});

			saveToLocalStorage();

			return lists;
		}
		
		function getLists() {

			var deferred = $q.defer();

			lists = JSON.parse(localStorage.getItem(LIST_STORAGE_ID) || '[]');
			
			deferred.resolve(lists);
			
			return deferred.promise;
		}

		function addStory(story) {
			
			stories.push(story);
			saveToLocalStorage();

			var filtered = stories.filter(function (item) {
				return item.listId === story.listId;
			});

			return filtered; 
		}	

		function updateStory(story) {

			var original = stories.find(function (item) {
				return item.id === story.id;
			})

			original.summary = story.summary;
			original.detail = story.detail;
			
			saveToLocalStorage();

			var filtered = stories.filter(function (item) {
				return item.listId === story.listId;
			});

			return filtered;
		}

		function deleteStory(story) {

			stories = stories.filter(function (item) {
				return item.id !== story.id;
			});

			saveToLocalStorage();

			var filtered = stories.filter(function (item) {
				return item.listId === story.listId;
			});

			return filtered;
		}
		
		function getStories(listId) {

			var deferred = $q.defer();

			stories = JSON.parse(localStorage.getItem(STORY_STORAGE_ID) || '[]');
			
			var filtered = stories.filter(function (item) {
				return item.listId === listId;
			});

			deferred.resolve(filtered);
			
			return deferred.promise;
		}

		function findStories(term) {

			var found = stories.filter(function (item) {
				
				var data = item.summary.toLowerCase() + ' ' + item.detail.toLowerCase();

				return data.includes(term.toLowerCase());
			});	
			
			return found;
		}

		function saveToLocalStorage() {
			localStorage.setItem(LIST_STORAGE_ID, JSON.stringify(lists));
			localStorage.setItem(STORY_STORAGE_ID, JSON.stringify(stories));
		}

		return {
			addList: addList,
			getLists: getLists,
			updateList: updateList,
			deleteList: deleteList,
			addStory: addStory,
			getStories: getStories,
			updateStory: updateStory,
			deleteStory: deleteStory,
			findStories: findStories
		};
	}]);	
})();