(function () {
	var app = angular.module('ngKanban');

	app.factory('notificationService', [function () {

		toastr.options = {
			closeButton: true
		};
		
		function showSuccess(title, message) {
			toastr.success(message, title)
		};

		function showError(title, message) {
			toastr.error(message, title)
		};

		return {
			showSuccess: showSuccess,
			showError: showError
		};
	}]);
})();