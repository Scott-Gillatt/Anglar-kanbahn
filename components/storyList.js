(function () {

	var app = angular.module('ngKanban');

	app.component('storyList', {
		templateUrl: 'templates/storyList.html',
		controller: storyListController,
		controllerAs: 'sl',
		bindings: {
			list: '<'
		},
		require: {
			board: '^storyBoard'
		}
	});

	app.controller('cardModalController', cardModalController);

	storyListController.$inject = ['$scope', '$uibModal', 'globals', 'storageService', 'guidService', '$timeout'];
	cardModalController.$inject = ['$uibModalInstance', 'globals', 'card', 'lists'];

	function storyListController($scope, $uibModal, globals, storageService, guidService, $timeout) {

		var sl = this;
		sl.cards = [];

		$scope.$on('stories-updated', function (event, stories) {

			$timeout(function () {
				$scope.$apply(function () {

					if (globals.user) {
						globals.user.stories = stories.filter(function (item) {
							return item.members && item.members.length && item.members.indexOf(globals.user.uid) > -1;
						});
					}

					sl.cards = stories.filter(function (item) {
						return item.listId === sl.list.id;
					});

					sl.cards = sl.cards.sort(function (a, b) {
						return a.order > b.order;
					});
				});
			}, 100);

		});

		$scope.$on('edit-story', function (event, data) {
			if (data.listId === sl.list.id) {
				sl.editCard(data);
			}
		});

		sl.$onInit = function () {
			storageService.subscribeToStoriesUpdates();
		};

		sl.editList = function () {
			sl.board.editList(sl.list);
		}

		sl.deleteList = function () {
			sl.board.deleteList(sl.list);

		}

		sl.moveList = function (direction) {
			var thisIndex = sl.board.lists.indexOf(sl.list);
			var otherIndex = thisIndex + direction;

			if (otherIndex > -1 && otherIndex < sl.board.lists.length) {
				var otherList = sl.board.lists[otherIndex];
				var otherOrder = otherList.order;
				otherList.order = sl.list.order;
				sl.list.order = otherOrder;
				storageService.saveList(otherList);
				storageService.saveList(sl.list);
			}
		}

		sl.addCard = function () {

			var modalInstance = $uibModal.open({
				templateUrl: 'storyCardModal.html',
				controller: 'cardModalController',
				controllerAs: 'cm',
				resolve: {
					card: function () {
						return null;
					},
					lists: function () {
						return null;
					}
				}
			});

			modalInstance.result.then(
				function (newCard) {

					guidService.getGuid().then(
						function (response) {

							newCard.id = response.data;
							newCard.listId = sl.list.id;

							if (sl.cards.length) {
								newCard.order = sl.cards[sl.cards.length - 1].order + 1;
							}
							else {
								newCard.order = 1;
							}

							sl.cards = storageService.saveStory(newCard);
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
		}

		sl.editCard = function (card) {

			var modalInstance = $uibModal.open({
				templateUrl: 'storyCardModal.html',
				controller: 'cardModalController',
				controllerAs: 'cm',
				resolve: {
					card: function () {
						return angular.copy(card);
					},
					lists: function () {
						return sl.board.lists;
					}
				}
			});

			modalInstance.result.then(
				function (updatedCard) {

					sl.cards = storageService.saveStory(updatedCard);
				},
				function () {
					// cancelled
				}
			);
		};

		sl.deleteCard = function (card) {
			sl.cards = storageService.deleteStory(card);
		};

		sl.moveCard = function (card, direction) {

			var thisIndex = sl.cards.indexOf(card);
			var otherIndex = thisIndex + direction;

			if (otherIndex > -1 && otherIndex < sl.cards.length) {
				var otherCard = sl.cards[otherIndex];
				var otherOrder = otherCard.order;

				otherCard.order = card.order;
				card.order = otherOrder;
				storageService.saveStory(otherCard);
				storageService.saveStory(card);
			}
		}
		sl.canDrop = function (event) {
			event.preventDefault();
		}
	}

	function cardModalController($uibModalInstance, globals, card, lists) {

		var cm = this;

		cm.isEdit = card ? true : false;
		cm.lists = lists;
		cm.card = card || {
			summary: '',
			detail: ''
		};
		cm.users = globals.users.concat([
			{
				id: globals.user.uid,
				name: globals.user.displayName,
				photoURL: globals.user.photoURL
			}
		]);


		cm.ok = function () {
			$uibModalInstance.close(cm.card);
		};

		cm.cancel = function () {
			$uibModalInstance.dismiss('cancel');

		};

	}
})();