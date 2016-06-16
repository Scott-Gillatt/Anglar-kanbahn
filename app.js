(function () {
	
	var app = angular.module('ngKanban', []);

	app.controller('storyController', ['storageService', 'guidService', function (storageService, guidService) {
		
		var vm = this;

		vm.stories = [];
		vm.newStory = {
			name: '',
			details: ''
		};

		vm.addStory = function () {

			guidService.getGuid().then(
				function (response) {
					
					var newStory = angular.copy(vm.newStory);

					newStory.id = response.data;

					vm.stories = storageService.addStory(newStory);

					vm.newStory.name = '';
					vm.newStory.details = '';
				}
			).catch(
				function (err) {
					console.log('Something went wrong: ', err);
				}
			);	
		};	
		
		storageService.getStories().then(
			function (stories) {
				vm.stories = stories;
			}
		);

	}]);	
})();
