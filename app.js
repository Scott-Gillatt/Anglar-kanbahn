(function () {

	var app = angular.module('ngKanban', ['ui.bootstrap']);

	app.controller('appController', ['storageService', '$uibModal', function (storageService, $uibModal) {
		
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
						// return results.map(function (item){

						// return Object.assign({}, item);
						// })
						return results;
					},
					term: function () {
						return ac.searchTerm
					}
				}
			});

			modalInstance.result.then(
				function () {

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

		results = results.map(function (item) {
			item.summary = $sce.trustAsHtml(markTerms(item.summary, term));
			item.detail = $sce.trustAsHtml(markTerms(item.detail, term));

			return item;
		});

		rm.results = results;

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