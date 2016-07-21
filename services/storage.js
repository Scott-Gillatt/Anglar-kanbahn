(function () {
	
	var app = angular.module('ngKanban');

	app.factory('storageService', ['$q','$rootScope', function ($q,$rootScope) {
		
		var LIST_STORAGE_ID = 'kanban-list-store';
		var STORY_STORAGE_ID = 'kanban-story-store';
		var lists = [];
		var stories = [];

		// set up firbase subscriptions for lists and stories
		function subscribeToListUpdates() {

			firebase.database().ref('/lists').on('value', function (snapshot) {
			
				var lists = [];

				snapshot.forEach(function (childSnapshot) {
					console.log(childSnapshot.val());
					lists.push(childSnapshot.val());
				});
		
				$rootScope.$broadcast('lists-updated', lists);
			});
		}	

		function subscribeToStoriesUpdates() {

			firebase.database().ref('/stories').on('value', function (snapshot) {
			
				var stories = [];

				snapshot.forEach(function (childSnapshot) {
					
					stories.push(childSnapshot.val());

				});
		
				$rootScope.$broadcast('stories-updated', stories);
			});
		}	

		function saveList(list) {

			firebase.database().ref('/lists/' + list.id).set(list);
			firebase.database().ref('/stories').once('value', function (snapshot) {
			
				var stories = [];

				snapshot.forEach(function (childSnapshot) {
					
					stories.push(childSnapshot.val());

				});
		
				$rootScope.$broadcast('stories-updated', stories);
			});
		}		

		function deleteList(list) {

			firebase.database().ref('/lists/' + list.id).remove();

		}

		function saveStory(story) {
			
			firebase.database().ref('/stories/' + story.id).set(story);			

		}	

		function deleteStory(story) {

			firebase.database().ref('/stories/' + story.id).remove();			

		}

		function findStories(term) {

			var deferred = $q.defer();
			
			firebase.database().ref('/stories').once('value', function (snapshot) {
				
				var stories = [];

				snapshot.forEach(function (childSnapshot) {
					
					var story = childSnapshot.val();
					var data = story.summary.toLowerCase() + ' ' + story.detail.toLowerCase();

					if (data.includes(term.toLowerCase())) {
						stories.push(story);
					}
				});

				deferred.resolve(stories);
			});	
			
			return deferred.promise;
		}

		return {
			saveList: saveList,
			deleteList: deleteList,
			saveStory: saveStory,
			deleteStory: deleteStory,
			findStories: findStories,
			subscribeToListUpdates: subscribeToListUpdates,
			subscribeToStoriesUpdates: subscribeToStoriesUpdates
		};
	}]);	
})();