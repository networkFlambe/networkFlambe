(function() {
  'use strict';
//consider deleteing this.
  angular
    .module('neuralquestApp')
    .factory('AccordionService', ['$q', 'FirebaseUrl', '$firebaseObject', '$firebaseArray', AccordionService]);


  function AccordionService($q, FirebaseUrl, $firebaseObject, $firebaseArray) {

    var service = {
      getLessons: getLessons
    };
    return service;

    ////////////////
    function getLessons(lessonData) {
      // console.log('you are here');
      var defer = $q.defer();
      
      var ref = new Firebase(FirebaseUrl+"/NNFlat");

      ref.on("value", function(snapshot) {
        var allElements = snapshot.val();
        defer.resolve(allElements);
      });

      return defer.promise;

    }
  }
})();