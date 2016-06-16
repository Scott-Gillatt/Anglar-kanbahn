(function () {
	
	var app = angular.module('ngKanban');

	app.factory('guidService', ['$http', function ($http) {

		function getGuid() {

			return $http({
				url: 'http://guid.setgetgo.com/get.php',
				method: 'GET',
				transformResponse: function(value) {
					return value.replace('{', '').replace('}', '');
				}
			});
		}

		return {
			getGuid: getGuid
		};
	}]);
})();