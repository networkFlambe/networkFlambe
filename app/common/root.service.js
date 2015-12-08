(function() {
    'use strict';

    angular
        .module('neuralquestApp')
        .controller('rootCtrl', rootCtrl);

    function rootCtrl($rootScope) {
        
        $rootScope.loginToggle = true;

    };
})();