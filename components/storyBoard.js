(function () {
	
	var app = angular.module('ngKanban');

	app.component('storyBoard', {
		templateUrl: 'templates/storyBoard.html',
		controller: storyBoardController,
		controllerAs: 'sb'
	});

	app.controller('listModalController', listModalController);

	storyBoardController.$inject = ['$uibModal', 'storageService', 'firebaseService', 'guidService'];
	listModalController.$inject = ['$uibModalInstance', 'list'];
	
	function storyBoardController($uibModal, storageService, firebaseService, guidService) {

		var sb = this;
		
		sb.lists = [];
		
		sb.$onInit = function () {
			storageService.getLists().then(
				function (lists) {
					sb.lists = lists;
				}
			);
		}

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

							sb.lists = storageService.addList(newList);

							firebaseService.addList(newList);
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

					sb.lists = storageService.updateList(editedList);					
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