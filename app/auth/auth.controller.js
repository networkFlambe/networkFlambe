/**
 *
 * Auth Controller
 *
 */

(function(){
  'use strict';

  angular.module('neuralquestApp')
    .controller('AuthCtrl', AuthCtrl);

    function AuthCtrl(Auth, $state, Users, $rootScope) {
      var authCtrl = this;

      authCtrl.user = {
        fullname: '',
        email: '',
        password: ''
      };

      authCtrl.login = login;
      authCtrl.register = register;
      authCtrl.loginWithFacebook = loginWithFacebook;
      authCtrl.loginWithGoogle = loginWithGoogle;
      

      /*=============================================
      =            METHOD IMPLEMENTATION            =
      =============================================*/

      function login() {
        Auth.$authWithPassword(authCtrl.user).then(function(auth) {
          //todo: change this
          console.log('logging in with user:',auth);
          Users.currentUser = auth;
          $state.go('landing');
          $rootScope.$broadcast('evt_userSigningIn');
        }, function(error) {
          authCtrl.error = error;
        })
      };

      function register() {
        Auth.$createUser(authCtrl.user).then(function(auth) {
          console.log('Registered in firebase!');
          authCtrl.login();
        }, function(error) {
          authCtrl.error = error;
        })
      };

      function loginWithFacebook() {
        Auth.OAuthLogin('facebook').then(function (authData){
          console.log("authdata in controller", authData);
          Users.currentUser = authData;
          $state.go('landing');  
          $rootScope.$broadcast('evt_userSigningIn');
        });
      };

      function loginWithGoogle() {
        Auth.OAuthLogin('google').then(function (authData){
          console.log("authdata in controller", authData);
          Users.currentUser = authData;
          $rootScope.$broadcast('evt_userSigningIn');
          $state.go('landing');  
        }); 
      };

  };
})();
