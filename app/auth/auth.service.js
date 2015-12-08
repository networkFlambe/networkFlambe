/**
 *
 * Auth Service
 *
 */

(function(){
  'use strict';

  angular.module('neuralquestApp')
    .factory('Auth', Auth);

    function Auth($firebaseAuth, FirebaseUrl, $q) {
      var ref = new Firebase(FirebaseUrl);
      var auth = $firebaseAuth(ref);

      auth.OAuthLogin = OAuthLogin;

      return auth;

      /*=============================================
      =            METHOD IMPLEMENTATION            =
      =============================================*/
      function OAuthLogin(provider){
        var defer = $q.defer();
        console.log("OAuthLogin called for provider, ", provider);
        auth.$authWithOAuthPopup(provider)
            .then(function (authData){
              console.log("Login with ", authData);
              defer.resolve(authData);
            })
            .catch(function (err){
              console.error("Facebook Authentication Failed with an Error:", err);
            });
        return defer.promise;
      }

    };
})();
