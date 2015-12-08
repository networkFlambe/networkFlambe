(function() {
    'use strict';

    angular
        .module('neuralquestApp')
        .directive('appHeader', appHeader);


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

    function Controller($rootScope, $scope, Users, Auth, $state) {

      $scope.isUserSignedIn = isUserSignedIn;
      $scope.logout = logout;
      $scope.loginToggle = loginToggle;
      $scope.getLoginToggle = getLoginToggle;
      $scope.$on('evt_userSigningIn', function(){
        // console.log('checking curerntUser after the event is triggered:',Users.currentUser);
        isUserSignedIn();
      });

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

      function logout(){
        Auth.$unauth();
        Users.currentUser = '';
        $rootScope.loginToggle = false;
        $state.go('home');
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
      
    }
})();