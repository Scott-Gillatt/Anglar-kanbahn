(function () {

	var app = angular.module('ngKanban');

	app.component('userList', {
		templateUrl: 'templates/userList.html',
		controller: userListController,
		controllerAs: 'ul'
	});

	userListController.$inject = ['globals', '$scope', '$timeout', 'usersService', 'chatService', '$uibModal'];

	function userListController(globals, $scope, $timeout, usersService, chatService, $uibModal) {

		var ul = this;

		ul.users = [];
		ul.messages = {};

		ul.$onInit = function () {

			if (globals.user) {
				subscribeToChats();
				subscribeToUsers();
			}
			else {
				ul.users = [];
			}

			$scope.$on('user-updated', function (event) {

				if (globals.user) {
					subscribeToChats();
					subscribeToUsers();
				}
				else {
					ul.users = [];
				}
			});

		}

		ul.userChat = function (user) {

			var modalInstance = $uibModal.open({
				templateUrl: 'userChatModal.html',
				controller: 'userChatController',
				controllerAs: 'uc',
				resolve: {
					user: function () {
						return user;
					},
					messages: function () {
						return ul.messages
					}
				}
			});

			modalInstance.result.then(
				function (user) {
					//$rootScope.$broadcast('edit-story', story);
				},
				function () {
					// cancelled
				}
			);
		}

		function subscribeToChats() {

			$scope.$on('chat-conversations-updated', function (event, conversations) {

				conversations.forEach(function (item) {
					chatService.subscribeToMessages(item);
				});
			});

			$scope.$on('chat-messages-updated', function (event, messages) {
				ul.messages[messages.conversationId] = messages.messages;

				console.log(ul.messages);
			});

			chatService.subscribeToConversations(globals.user.uid);
		}

		function subscribeToUsers() {

			$scope.$on('userlist-updated', function (event, users) {

				if (users && users.length) {
					users = users.filter(function (item) {
						return item.id !== globals.user.uid;
					});
				}

				$timeout(function () {
					$scope.$apply(function () {
						ul.users = users;
					});
				}, 100);
			});

			usersService.subscribeToOnlineUsers();
		}
	}

	app.controller('userChatController', ['$scope', '$timeout', 'globals', '$uibModalInstance', 'chatService', 'user', 'messages', function ($scope, $timeout, globals, $uibModalInstance, chatService, user, messages) {

		var uc = this;
		uc.members = [];
		uc.message = ''

		uc.members.push(globals.user);
		uc.members.push(user);

		var conversationId = globals.user.uid > user.id ? globals.user.uid + '-' + user.id : user.id + '-' + globals.user.uid;

		uc.messages = messages[conversationId];

		$scope.$on('chat-messages-updated', function (event, messages) {

			if (messages.conversationId === conversationId) {
				
				var sorted = messages.messages.sort(function (a, b) {
					return a.timestamp > b.timestamp;
				});

				$timeout(function () {
					$scope.$apply(function () {
						uc.messages = sorted;
					});
				}, 100);
			}
		});

		$scope.$watch('uc.messages', function (newValue, oldValue) {

			$timeout(function () {

				var listItems = $('li.media');
				var last = listItems.length - 1;

				listItems[last].scrollIntoView();

			}, 500);
		});


		uc.postMessage = function () {
			chatService.postMessage(conversationId, globals.user.uid, user.id, angular.copy(uc.message));
			uc.message = '';
		}

		uc.close = function () {
			$uibModalInstance.dismiss('cancel');
		}

	}]);

})();