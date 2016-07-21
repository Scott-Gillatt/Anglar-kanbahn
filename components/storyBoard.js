(function () {
	
	var app = angular.module('ngKanban');

	app.component('storyBoard', {
		templateUrl: 'templates/storyBoard.html',
		controller: storyBoardController,
		controllerAs: 'sb'
	});

	app.controller('listModalController', listModalController);

	storyBoardController.$inject = ['$uibModal', 'storageService', 'guidService','$scope','$timeout'];
	listModalController.$inject = ['$uibModalInstance', 'list'];
	
	function storyBoardController($uibModal, storageService, guidService, $scope, $timeout) {

		var sb = this;
		
		sb.lists = [];

		$scope.$on('lists-updated', function (event, lists) {

			lists.forEach(function (item) {
				storageService.subscribeToStoriesUpdates(item.id);
			});

			$timeout(function () {
				$scope.$apply(function () {
					sb.lists = lists.sort(function (a, b) {
						return a.order > b.order;
					});
				});
			}, 100);
			
		});

		sb.addList = function () {

			var modalInstance = $uibModal.open({
				templateUrl: 'storyListModal.html',
				controller: 'listModalController',
				controllerAs: 'lm',
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

							newList.id = response.data;
							newList.order = sb.lists[sb.lists.length - 1].order + 1;
							
							storageService.saveList(newList);

						}
					).catch(
						function (err) {
							console.log('Something went wrong: ', err);
						}
					);
				},
				function () {
					// cancelled
				}
			);
		};

		sb.editList = function (list) {
			
			var modalInstance = $uibModal.open({
				templateUrl: 'storyListModal.html',
				controller: 'listModalController',
				controllerAs: 'lm',
				resolve: {
					list: function () {
						return angular.copy(list);
					}
				}
			});

			modalInstance.result.then(
				function (editedList) {

					sb.lists = storageService.saveList(editedList);					
				},
				function () {
					// cancelled
				}
			);
		}	
		
		sb.deleteList = function (list) {
			
			sb.lists = storageService.deleteList(list);
		}
	}

	function listModalController($uibModalInstance, list) {

		var lm = this;

		lm.isEdit = list ? true : false;		
		lm.list = list || {
			name: '',
			description: ''
		};

		lm.ok = function () {
			$uibModalInstance.close(lm.list);
		};

		lm.cancel = function () {
			$uibModalInstance.dismiss('cancel');
		};

	}
})();