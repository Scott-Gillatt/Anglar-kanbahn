
(function () {
	
	var app = angular.module('ngKanban');

	app.factory('firebaseService', ['$q', function ($q) {


		function addList(list) {
			
			firebase.database().ref('lists/' + list.id).set(list);
		}	

		return {
			addList: addList
		};
	}]);	
})();