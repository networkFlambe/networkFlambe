/**
 *
 * Auth Service
 *
 */

(function(){
  'use strict';

  angular.module('neuralquestApp')
    .factory('Auth', ['$firebaseAuth','FirebaseUrl','$q',Auth]);

    function Auth($firebaseAuth, FirebaseUrl, $q) {
      var ref = new Firebase(FirebaseUrl);
      var auth = $firebaseAuth(ref);

      auth.OAuthLogin = OAuthLogin;
      auth.validatePwd = validatePwd;

      return auth;

      /*=============================================
      =            METHOD IMPLEMENTATION            =
      =============================================*/
      function OAuthLogin(provider){
        var defer = $q.defer();
        auth.$authWithOAuthPopup(provider)
            .then(function (authData){
              defer.resolve(authData);
            })
            .catch(function (err){
              console.error("Authentication Failed with an Error:", err);
            });
        return defer.promise;
      }

      function validatePwd(password){
        var regEx = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
        var minPwdLength = 6;
        var maxPwdLength = 16;
        if(password.length < minPwdLength || password.length > maxPwdLength){
          return false;
        } else if(!regEx.test(password)){
          return false;
        } else {
          return true;  
        }
      }

    };
})();
