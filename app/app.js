(function(){

  'use strict';

  /**
   * @ngdoc overview
   * @name neuralquestApp
   * @description
   * # neuralquestApp
   *test
   * Main module of the application.
   */
  angular
    .module('neuralquestApp', [
      'firebase',
      'angular-md5',
      'ngSanitize',
      'ui.router',
      'ui.ace',
      'ui.bootstrap',
      'ngStorage',
      'ngAnimate',
      'toaster',
      'youtube-embed',
      'chart.js',
      'jsxGraph'
    ])

    .run(["$rootScope", "$window", '$location', scrollToTop]);

      function scrollToTop($rootScope, $window,  $location) {

      $rootScope.$on('$stateChangeSuccess', function() {
         document.body.scrollTop = document.documentElement.scrollTop = 30;
      });
    }


})();

