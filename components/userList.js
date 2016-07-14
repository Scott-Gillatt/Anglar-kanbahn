(function () {

	var app = angular.module('ngKanban');

	app.component('userList', {
		templateUrl: 'templates/userList.html',
		controller: userListController,
		controllerAs: 'ul'
	});

	userListController.$inject = ['$scope', '$timeout', 'firebaseService','$uibModal'];

	function userListController($scope, $timeout, firebaseService, $uibModal) {

		var ul = this;

		$scope.$on('userlist-updated', function (event, users) {
			$timeout(function () {
				$scope.$apply(function () {
					ul.users = users.filter(function (item) {
						return item.id !== firebase.auth().currentUser.uid;
					});
				});
			}, 100);			
		});

		ul.$onInit = function () {
			updateList();
		}

		function updateList() {
			firebaseService.getOnlineUsers().then(
				function (users) {
					ul.users = users.filter(function (item) {
						return item.id !== firebase.auth().currentUser.uid;
					});
					console.log(users);
				}
			);
		}

		ul.userChat = function (user) {
			
			var modalInstance = $uibModal.open({
				templateUrl: 'userChatModal.html',
				controller: 'userChatController',
				controllerAs: 'uc',
				resolve: {
					
					user: function () {
						return user;
					}

				}
			});
			console.log(modalInstance);
			modalInstance.result.then(
				function (user) {
					//$rootScope.$broadcast('edit-story', story);
				},
				function () {
					// cancelled
				}
			);		
		}

	}

	app.controller('userChatController',['$uibModalInstance','firebaseService','user',function($uibModalInstance,firebaseService,user){

		var uc = this;
		uc.members = [];

		uc.members.push(firebase.auth().currentUser);
		uc.members.push(user);

		console.log(uc.members);

		uc.close = function () {
			$uibModalInstance.dismiss('cancel');
		}

	}]);

})();