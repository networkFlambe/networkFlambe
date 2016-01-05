(function() {
    'use strict';

    angular
        .module('neuralquestApp')
        .directive('appHeader', ['Users',appHeader]);


    function appHeader(Users) {
        // Desc: header directive. it will know if a user is logged in or not and show the appropriate header at the top.
        // Usage: add directive in the template
        // e.g. <app-header></app-header> or <div app-header></div>

        var appHeader = {
            controller: Controller,
            link: link,
            restrict: 'EA',
            templateUrl: 'directive/header.directive.html',
            scope: {
            }
        };
        return appHeader;

        function link(scope, element, attrs) {
        }
    }

    function Controller($rootScope, $scope, Users, Auth, $state, $timeout) {

      $scope.isUserSignedIn = isUserSignedIn;
      $scope.logout = logout;
      $scope.loginToggle = loginToggle;
      $scope.getLoginToggle = getLoginToggle;
      $scope.goProfilePage = goProfilePage;
      $scope.$on('evt_userSigningIn', function(){ //auth.controller
        // console.log('checking curerntUser after the event is triggered:',Users.currentUser);
        isUserSignedIn();
      });
      $scope.signInUser = {};
      $scope.isAdmin = isAdmin;
      // $scope.reload = reload;

      init();
      /*=============================================
      =            METHOD IMPLEMENTATION            =
      =============================================*/
      
      function isUserSignedIn() {
        // console.log('checking curerntUser in the directive:',Users.currentUser);

        //check if the current user is logged in
        if(Auth.$getAuth()){
          return true;
        } else {
          return false;
        }
      };

      function init() {
        if(Auth.$getAuth()){
          // console.log('authdata---------',Auth.$getAuth());
          if(Auth.$getAuth().password){
            $scope.signInUser.displayName = Auth.$getAuth().password.email;
            $scope.signInUser.profileImgaeURL = Auth.$getAuth().password.profileImageURL;
            console.log('user------------', $scope.signInUser);
          }
          if(Auth.$getAuth().google){
            $scope.signInUser.displayName = Auth.$getAuth().google.displayName;
            $scope.signInUser.profileImgaeURL = Auth.$getAuth().google.profileImageURL;
            console.log('user------------', $scope.signInUser);
          }
          if(Auth.$getAuth().facebook){
            $scope.signInUser.displayName = Auth.$getAuth().facebook.displayName;
            $scope.signInUser.profileImgaeURL = Auth.$getAuth().facebook.profileImageURL;
            console.log('user------------', $scope.signInUser);
          }
        }
      }

      function setSignedInUser(provider){
        
      }

      function goProfilePage() {
        $timeout(function(){
          $state.go('profile');  
        }, 50);
      }

      function logout(){
        Auth.$unauth();
        Users.currentUser = '';
        $rootScope.loginToggle = false;
        $state.go('login');
      };

      //method for Login/Signup swap
      function loginToggle(){
        $rootScope.loginToggle = !$rootScope.loginToggle;
        // console.log('loginToggle,',$rootScope.loginToggle)
      }
      //method for Login/Signup swap
      function getLoginToggle(){
        return $rootScope.loginToggle;
      }
      
      function isAdmin() {
        var auth = Auth.$getAuth();
        if(auth){
          // console.log(Auth.$getAuth().uid);
          // console.log(Users.getProfile(Auth.$getAuth().uid));
          if(Users.getUserProfile(auth.uid).isAdmin){
            var isAdmin = Users.getUserProfile(Auth.$getAuth().uid).isAdmin;
            return isAdmin;    
          }
        }
        return false;
      }
    }
})();