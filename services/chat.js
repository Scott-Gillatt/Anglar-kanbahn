(function () {

    var app = angular.module('ngKanban');

    app.factory('chatService', ['$rootScope', '$q', function ($rootScope, $q) {

        function subscribeToConversations(myUserId) {

            // var uid = firebase.auth().currentUser.uid;

            firebase.database().ref('chat/conversations/' + uid).on('value', function (snapshot) {

                var conversations = [];

                snapshot.forEach(function (childSnapshot) {
                    conversations.push(childSnapshot.key);
                });

                $rootScope.$broadcast('chat-conversations-updated', conversations);
            });
        };

        function subscribeToMessages(conversationId) {
            firebase.database().ref('chat/messages/' + conversationId).on('value', function (snapshot) {

                var messages = [];

                snapshot.forEach(function (childSnapshot) {
                    messages.push(childSnapshot.val());
                });

                console.log('Conversations: ', conversations)

                $rootScope.$broadcast('chat-messages-updated', {
                    conversationId: conversationId,
                    messages: messages
                });
            });
        }

        function getConversationId(otherUserId) {

            var deferred = $q.defer();
            var myUserId = firebase.auth().currentUser.uid;
            var myConversations = [];
            var otherConversations = [];

            firebase.database().ref('/chat/conversations/' + myUserId).once('value')
                .then(
                function (snapshot) {
                    snapshot.forEach(function (childSnapshot) {
                        myConversations.push(childSnapshot.key);
                    })

                    return firebase.database().ref('/chat/conversations' + otherUserId).once('value');
                }
                )
                .then(
                function (snapshot) {
                    snapshot.forEach(function (childSnapshot) {
                        otherConversations.push(childSnapshot.key);
                    });

                    var conversationId = null;
                    myConversations.forEach(function (item) {
                        if (otherConversations.indexOf(item) > -1) {
                            deferred.resolve(item);
                        };
                        deferred.reslove(null);
                    });
                    return deferred.promise;
                }
                );

            return {
                subscribeToConversations: subscribeToConversations,
                subscribeToMessages: subscribeToMessages,
                getConversationId: getConversationId
            };
        }]);
})();