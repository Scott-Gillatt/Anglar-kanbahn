(function () {

	var app = angular.module('ngKanban', ['ui.bootstrap']);

	app.controller('storyController', ['storageService', 'guidService', '$uibModal', function (storageService, guidService, $uibModal) {

		var vm = this;

		vm.stories = [];


		vm.addStory = function () {

			var modalInstance = $uibModal.open({
				templateUrl: 'addStoryModal.html',
				controller: 'newStoryModalController',
				controllerAs: 'vm',
				//This Resolve is if you want to pass data into the modal
				resolve: {
					story: function () {
						return null;
					}
				}
			});

			modalInstance.result.then(
				function (newStory) {
					guidService.getGuid().then(
						function (response) {

							// var newStory = angular.copy(vm.newStory);

							newStory.id = response.data;

							vm.stories = storageService.addStory(newStory);
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

		vm.editStory = function (story) {
			var modalInstance = $uibModal.open({
				templateUrl: 'addStoryModal.html',
				controller: 'newStoryModalController',
				controllerAs: 'vm',
				//This Resolve is if you want to pass data into the modal
				resolve: {
					story: function () {
						return angular.copy(story);
					}
				}
			});

			modalInstance.result.then(
				function (story) {
					vm.stories = storageService.updateStory(story);
				},
				function () {
					//cancelled
				}
			);
		}

		// vm.deleteStory = function(story){
		// 	let temp = indexOf(story);
		// }

		storageService.getStories().then(
			function (stories) {
				vm.stories = stories;
			}
		);

	}]);

	app.controller('newStoryModalController', ['$uibModalInstance', 'story', function ($uibModalInstance, story) {

		var vm = this;

		vm.newStory = story || {
			name: '',
			details: ''
		};

		vm.ok = function () {
			$uibModalInstance.close(vm.newStory);
		};
		vm.cancel = function () {
			$uibModalInstance.dismiss('cancel');
		};
	}]);

})();
