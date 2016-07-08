(function () {

	var app = angular.module('ngKanban', ['ui.bootstrap']);

	app.controller('appController', ['$rootScope', 'storageService', '$uibModal', function ($rootScope, storageService, $uibModal) {
		
		var ac = this;

		ac.searchTerm = '';

		ac.search = function () {

			var results = storageService.findStories(ac.searchTerm);
			
			var modalInstance = $uibModal.open({
				templateUrl: 'searchResultsModal.html',
				controller: 'searchResultsController',
				controllerAs: 'rm',
				resolve: {
					results: function () {
						return results.map(function (item) {
							return Object.assign({}, item);
						});
					},
					term: function () {
						return ac.searchTerm
					}
				}
			});

			modalInstance.result.then(
				function (story) {
					$rootScope.$broadcast('edit-story', story);
				},
				function () {
					// cancelled
				}
			);			
		};

		//ac.marked = $sce.trustAsHtml(markTerms('Mr. Blue lives in a blue house and wears a blue suite and blue hat.', 'blue'));
	}]);

	app.controller('searchResultsController', ['$sce', '$uibModalInstance', 'results', 'term', function ($sce, $uibModalInstance, results, term) {
		
		var rm = this;

		rm.results = results.map(function (item) {

			var resultItem = angular.copy(item);

			resultItem.summary = $sce.trustAsHtml(markTerms(item.summary, term));
			resultItem.detail = $sce.trustAsHtml(markTerms(item.detail, term));

			return resultItem;
		});

		rm.edit = function (storyId) {
			
			var story = results.find(function (item) {
				return item.id === storyId;
			});

			$uibModalInstance.close(story);
		};
		
		rm.cancel = function () {
			$uibModalInstance.dismiss('cancel');
		};

		function markTerms(text, term) {

			var result = [];
			var buffer = [];		
			var queue = text.split('');

			term = term.toLowerCase();

			while (queue.length) {

				buffer.push(queue.shift());

				if (buffer.length === term.length) {
					
					var word = buffer.join('');

					if (word.toLowerCase() === term) {
						result.push('<mark>' + word + '</mark>');
						buffer = [];
					}
					else {
						result.push(buffer.shift());
					}
				}
			}
			
			return result.join('') + buffer.join('');
		}

	}]);


})();