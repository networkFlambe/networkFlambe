(function() {
  'use strict';

  angular
    .module('neuralquestApp')
    .factory('TeamInfo', ['$q', 'FirebaseUrl',TeamInfo]);

  /* @ngInject */
  function TeamInfo ($q, FirebaseUrl) {
    return {
      getTeamInfo: getTeamInfo
    };

    ////////////////

    function getTeamInfo() {
      var ref = new Firebase(FirebaseUrl + 'teaminfo/');
      var defer = $q.defer();
      ref.on('value', function(snapshot) {
        defer.resolve(snapshot.val());
      }, function (err) {
        defer.reject(err);
      });
      return defer.promise;
    }
  }
})();