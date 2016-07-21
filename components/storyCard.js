(function () {
	
	var app = angular.module('ngKanban');

	app.component('storyCard', {
		templateUrl: 'templates/storyCard.html',
		controller: storyCardController,
		controllerAs: 'sc',
		bindings: {
			card: '<'
		},
		require: {
			list: '^storyList'
		}
	});

	function storyCardController() {

		var sc = this;
	
		sc.editCard = function () {
			sc.list.editCard(sc.card);
		};

		sc.deleteCard = function () {
			sc.list.deleteCard(sc.card);
		};

		sc.moveCard = function (direction) {
			sc.list.moveCard(sc.card, direction);
		};	
	}

})();