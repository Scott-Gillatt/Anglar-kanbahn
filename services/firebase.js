(function () {

	var app = angular.module('ngKanban');

	app.factory('firebaseService', ['$rootScope', 'notificationServices', '$q', function ($rootScope, notificationServices, $q) {

		function createAccount(user) {

			firebase.auth()
				.createUserWithEmailAndPassword(user.email, user.password)
				.then(function (newUser) {

					newUser.updateProfile({
  						displayName: user.name,
  						photoURL: 'https://api.adorable.io/avatars/100/' + user.email + '.png'
					})
					.then(
						function () {
							$rootScope.$broadcast('profile-updated', newUser);
						}
					)	
					.catch(function (error) {
						// TODO: broadcast error message
						console.log(error);
					});
				})
				.catch(function (error) {
					// TODO: broadcast error message
					console.log(error);
				}
			);
		}

		function authorizeAccount(user) {
			firebase.auth()
				.signInWithEmailAndPassword(user.email, user.password)
				.catch(function (error) {
					notificationServices.showError('Login Failed', error.message)
					console.log(error);
				}
			);
		}

		function addList(list) {

			firebase.database().ref('lists/' + list.id).set(list);
		}

		return {
			createAccount: createAccount,
			authorizeAccount: authorizeAccount,
			addList: addList
		};
	}]);
})();