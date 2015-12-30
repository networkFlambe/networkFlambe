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

        $.post(apiRoot + path, data, function( results ) {
          var toDisplay;
          console.log(JSON.stringify(results));
          console.log(path);
          if(path === '/api/trainRun') {
            var errorAndIterations = results.result.answer[0];
            console.log('errorAndIterations is ', errorAndIterations);
            toDisplay = 'Error: ' + errorAndIterations.error.toFixed(7) + ' Iterations: ' + errorAndIterations.iterations;
          } else if (path === '/api/runSimpleMNIST') {
            console.log(results);
            var answerArr = results.result.predictedValue;
            toDisplay = '[\n  ' + answerArr.join(',\n  ') + '\n]';
            if(results.result.log !== 'OK') {
              toDisplay = results.result.log;
            }
          } else if (path === '/api/trainRunSimpleMNIST') {
            var errorAndIterations = results.result.answer[0];
            var answerArr = results.result.answer[1];
            console.log('errorAndIterations is ', errorAndIterations);
            toDisplay = 'Error: ' + errorAndIterations.error.toFixed(7) + ' Iterations: ' + errorAndIterations.iterations;
            toDisplay = toDisplay + '\n[\n  ' + answerArr.join(',\n  ') + '\n]';
          }
          aceService.nqConsole.log(toDisplay);
        })
        .fail(function() {
          aceService.nqConsole.alert( "error" );
        });
      };

    };

})();
