/**
 *
 * Auth Controller
 *
 */

(function(){
  'use strict';

  angular.module('neuralquestApp')
    .controller('AuthCtrl', AuthCtrl);

    function AuthCtrl(Auth, $state, Users, $rootScope, $firebaseAuth, FirebaseUrl, $firebaseObject) {
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
      authCtrl.init = init;

      authCtrl.init();
      /*=============================================
      =            METHOD IMPLEMENTATION            =
      =============================================*/

      function init() {
        Auth.$onAuth(createUserIfNew);
      }

      function createUserIfNew(authData){
        var ref = new Firebase(FirebaseUrl);

        if(authData){
          console.log('User '+authData.uid + ' is logged in with ' + authData.provider); 
          authCtrl.isLoggedIn = true;
          var user = $firebaseObject(ref.child('users').child(authData.uid));
          user.$loaded().then(function() {
            //if the user does not exsit, create one.
            if(user.displayName === undefined){
              var newUser = {
                /**
                  TODO:
                  - may add additional properties here later.
                 */
              };
              if(authData.google){
                newUser.displayName = authData.google.displayName;
              } else if(authData.facebook){
                newUser.displayName = authData.facebook.displayName;
              } else {
                newUser.displayName = authCtrl.user.fullname;
              }

              user.$ref().set(newUser);
            }
          })
        } else {
          console.log('user is not signed in.')
        }
      }

      function login() {
        Auth.$authWithPassword(authCtrl.user).then(function(auth) {
          //todo: change this
          console.log('logging in with user:',auth);
          Users.currentUser = auth;
          $state.go('accordion');
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
          // console.log("authdata in controller", authData);
          Users.currentUser = authData;
          $state.go('accordion');  
          $rootScope.$broadcast('evt_userSigningIn');
        });
      };

      function loginWithGoogle() {
        Auth.OAuthLogin('google').then(function (authData){
          // console.log("authdata in controller", authData);
          Users.currentUser = authData;
          $rootScope.$broadcast('evt_userSigningIn');
          $state.go('accordion');  
        }); 
      };

  };
})();
