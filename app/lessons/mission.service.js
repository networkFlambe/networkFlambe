/**
 *
 * Mission Service
 *
 */

(function(){
  'use strict';

  angular
    .module('neuralquestApp')
    .factory('Missions', Missions);

    function Missions($firebaseArray, $firebaseObject, FirebaseUrl, $q){
      var ref = new Firebase(FirebaseUrl + '/NNFlat');

      var Mission = {};
      Mission.getShuffleData = getShuffleData;
      Mission.getLastElement = getLastElement;
      Mission.codeEditorApiCall = codeEditorApiCall;

      return Mission;

      /*=============================================
      =            METHOD IMPLEMENTATION            =
      =============================================*/

      function getShuffleData(name) {
        var defer = $q.defer();
        ref.orderByChild("shuffle").equalTo(name).on("value", function(data) {
          defer.resolve(data);
        });
        return defer.promise;
      };

      function getLastElement(){
        var defer = $q.defer();
        ref.orderByChild('sequence').limitToLast(1).on('value', function(snapshot){
          defer.resolve(snapshot.val());
        });

        return defer.promise;
      };

      function codeEditorApiCall(path, data) {
        // Switch to devUrl in the POST req below when developing (and running the API server locally)
        var devUrl = 'http://localhost:1337';
        var apiRoot = 'https://neuralquest.herokuapp.com';

        $.post(devUrl + path, data, function( results ) {
          console.log(JSON.stringify(results));
          var errorAndIterations = results.result.answer[0];
          console.log('errorAndIterations is ', errorAndIterations);
          var toDisplay = 'Error: ' + errorAndIterations.error.toFixed(7) + ' Iterations: ' + errorAndIterations.iterations;
          aceService.nqConsole.log(toDisplay);
        })
        .fail(function() {
          aceService.nqConsole.alert( "error" );
        });
      };

    };

})();
