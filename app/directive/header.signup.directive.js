(function() {
    'use strict';

    angular
        .module('neuralquestApp')
        .directive('appHeaderSignup', appHeaderSignup);


    function appHeaderSignup(Users) {
        // Usage: header directive. it will know if use is logged in or not and show the appropriate header at the top.
        // don't forget to add directive in the template
        // e.g. <app-header></app-header> or <div app-header></div>

        var appHeaderSignup = {
            controller: Controller,
            link: link,
            restrict: 'EA',
            templateUrl: 'directive/header.signup.directive.html',
            scope: {
            }
        };
        return appHeaderSignup;
    }

    function Controller($scope, Users, Auth, $state) {

      $scope.isUserSignedIn = isUserSignedIn;
      $scope.logout = logout;
      $scope.$on('evt_userSigningIn', function(){
        // console.log('checking curerntUser after the event is triggered:',Users.currentUser);
        isUserSignedIn();
      });

      /*=============================================
      =            METHOD IMPLEMENTATION            =
      =============================================*/
      
      function isUserSignedIn() {
        // console.log('checking curerntUser in the directive:',Users.currentUser);
        if(Users.currentUser){
          return true;
        } else {
          return false;
        }
      };

      function logout(){
        Auth.$unauth();
        Users.currentUser = '';
        $state.go('home');
        
      };
      
    }
})();