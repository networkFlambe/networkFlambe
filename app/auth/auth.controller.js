/**
 *
 * Auth Controller
 *
 */

(function(){
  'use strict';

  angular.module('neuralquestApp')
    .controller('AuthCtrl', AuthCtrl);

    function AuthCtrl(Auth, $state, Users, $rootScope, $timeout, $firebaseAuth, FirebaseUrl, $firebaseObject, TeamInfo) {
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
      authCtrl.loginBtnToggle = loginBtnToggle;
      authCtrl.init = init;
      authCtrl.resetPwd = resetPwd;
      authCtrl.nqVideoId = 'https://www.youtube.com/embed/rur-GW4snR4?rel=0'

      authCtrl.init();
      /*=============================================
      =            METHOD IMPLEMENTATION            =
      =============================================*/

      function init() {
        Auth.$onAuth(createUserIfNew);
        TeamInfo.getTeamInfo().then(function (teamInfo) {
          authCtrl.teamInfo = teamInfo;
        });
      }

      function createUserIfNew(authData){
        var ref = new Firebase(FirebaseUrl);

        if(authData){
          authCtrl.isLoggedIn = true;
          var user = $firebaseObject(ref.child('users').child(authData.uid));
          user.$loaded().then(function() {
            //if the user does not exsit, create one.
            if(!user.displayName){
              var newUser = {
                /**
                  TODO:
                  - may add additional properties here later.
                 */
                currentSequence: 10
              };
              if(authData.google){
                newUser.displayName = authData.google.displayName;
                newUser.profileImageURL = authData.google.profileImageURL;
                // newUser.emailAddress = authData.google.email;
              }
              if(authData.facebook){
                newUser.displayName = authData.facebook.displayName;
                newUser.profileImageURL = authData.facebook.profileImageURL;
                // newUser.emailAddress = authData.facebook.email;
              } 
              if(authData.password) {
                newUser.displayName = authCtrl.user.fullname;
                newUser.emailAddress = authCtrl.user.email;
                newUser.profileImageURL = 'http://www.gravatar.com/avatar/';
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
          Users.currentUser = auth;
          $state.go('accordion');
          $rootScope.$broadcast('evt_userSigningIn');
        }, function(error) {
          authCtrl.error = error;
        })
      };

      function register() {
        if(Auth.validatePwd(authCtrl.user.password)){
          Auth.$createUser(authCtrl.user).then(function(auth) {
            console.log('Registered in firebase!');
            authCtrl.login();
          }, function(error) {
            authCtrl.error = error;
          });
        } else {
          authCtrl.error = {message: "The password should contain at least one number and special character. Please try again."};
          $timeout(function(){
            authCtrl.error = null
          }, 3000);
        }
      };

      function resetPwd() {
        var ref = new Firebase(FirebaseUrl);
        ref.resetPassword({
          email: authCtrl.user.email
        }, function(err) {
          if(!err){
            alert("an email has been sent to "+authCtrl.user.email+". \n You will be directed to the sign in page");
            $timeout(function(){
              $state.go('home');
              loginBtnToggle();
            },3000);
          } else {
            console.log("Error sending password reset email:", err);
            alert("You can't find the user in our DB. \n Please try again!");
          }
        });
      }

      function loginWithFacebook() {
        Auth.OAuthLogin('facebook').then(function (authData){
          Users.currentUser = authData;
          $state.go('accordion');  
          $rootScope.$broadcast('evt_userSigningIn');
        });
      };

      function loginWithGoogle() {
        Auth.OAuthLogin('google').then(function (authData){
          Users.currentUser = authData;
          $rootScope.$broadcast('evt_userSigningIn');
          $state.go('accordion');  
        }); 
      };

      function loginBtnToggle() {
        $rootScope.loginToggle = !$rootScope.loginToggle;
      };

  };
})();
