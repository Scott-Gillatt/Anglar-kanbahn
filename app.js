(function () {

	var app = angular.module('ngKanban', ['ui.bootstrap']);

	app.value('auth', {});

	app.controller('appController', ['auth', '$rootScope', 'storageService', '$uibModal', 'firebaseService', function (auth, $rootScope, storageService, $uibModal, firebaseService) {

		var ac = this;

		ac.auth = auth;
		ac.searchTerm = '';

		firebase.auth().onAuthStateChanged(function (user) {
			auth.user = user;

			console.log('ac user: ', ac.auth)
		})

		ac.register = function () {
			var modalInstance = $uibModal.open({
				templateUrl: 'registerModal.html',
				controller: 'registerModalController',
				controllerAs: 'rm'	

			});

			modalInstance.result.then(
				function (newUser) {
					firebaseService.createAccount(newUser);
				},
				function () {
					// cancelled
				}
			);
		};

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

	app.controller('registerModalController', ['$uibModalInstance', function ($uibModalInstance) {

		var rm = this;

		rm.errors = [];

		rm.user = {
			id: '',
			name: '',
			email: '',
			password: ''
		}

		rm.register = function () {
			rm.errors = [];

			if (rm.user.name === '') {
				rm.errors.push('A name is required!');
			}
			if (rm.user.email === '') {
				rm.errors.push('A email address is required!');
			}
			if (rm.user.name === '') {
				rm.errors.push('A password is required!');
			}
			if (rm.errors.length < 1) {
				$uibModalInstance.close(rm.user);
			}
		};

		rm.cancel = function () {
			$uibModalInstance.dismiss('cancel');
		};
	}])

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