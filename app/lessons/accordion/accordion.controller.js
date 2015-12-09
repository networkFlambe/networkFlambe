(function() {
    'use strict';

  angular
    .module('neuralquestApp')
    .controller('AccordionCtrl', AccordionCtrl);

  
  function AccordionCtrl(FirebaseUrl, $firebaseObject, $firebaseArray) {
    var accordionCtrl = this;
    var getLessons = getLessons;

    accordionCtrl.oneAtATime = true;

    accordionCtrl.init = init;
    accordionCtrl.init();
    accordionCtrl.isNotString = isNotString;
    accordionCtrl.firstIndex = firstIndex;

    /*======================================
    =            IMPLEMENTATION            =
    ======================================*/

    function init() {
      getLessons();
    }

    function firstIndex(index) {
      if(index === 0){
        return true;
      } else {
        return false;
      }
    }

    function getLessons() {
      var ref = new Firebase(FirebaseUrl);
      accordionCtrl.lessons = $firebaseObject(ref.child('NeuralNetwork'));
    }

    function isNotString(val) {
      // console.log('val', val);
      if(typeof val === "string"){
        console.log('is string', val);
        return false;
      } else {
        return true;
      }
    }

  }
})();