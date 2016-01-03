(function() {
    'use strict';

  angular
    .module('neuralquestApp')
    .controller('AccordionCtrl', [
      'FirebaseUrl', '$firebaseObject', '$firebaseArray', 'accordionData', 
      'Users', 'Auth', 'Missions', '$timeout', '$scope', AccordionCtrl
      ]);

  
  function AccordionCtrl(FirebaseUrl, $firebaseObject, $firebaseArray, accordionData, Users, Auth, Missions, $timeout, $scope) {
    var accordionCtrl = this;
    var getLessons = getLessons;
    var ref = new Firebase(FirebaseUrl + '/NNFlat');
    var userRef = new Firebase(FirebaseUrl + '/users');
    var currentUserRef = new Firebase(FirebaseUrl + 'users/'+Auth.$getAuth().uid);

    accordionCtrl.oneAtATime = true;

    accordionCtrl.init = init;
    accordionCtrl.init();
    accordionCtrl.isNotString = isNotString;
    accordionCtrl.openFirstOne = openFirstOne;
    accordionCtrl.updateUserPosition = updateUserPosition;
    accordionCtrl.makeLocalObject = makeLocalObject;
    accordionCtrl.shuffleCompleted = shuffleCompleted;
    /*======================================
    =            IMPLEMENTATION            =
    ======================================*/

    function init() {
      accordionCtrl.allEl = accordionData;
      accordionCtrl.track = makeLocalObject(accordionCtrl.allEl);
      // if(Users.getProfile(Auth.$getAuth())){
        accordionCtrl.currentUser = Users.getProfile(Auth.$getAuth().uid);  
      // }
      $timeout(function(){
        accordionCtrl.currentUser.$loaded().then(function() {
        var currSeq = accordionCtrl.currentUser.currentSequence;
        var maxSeq = accordionCtrl.currentUser.maxSequence;
        // console.log('maxseq',maxSeq);
        ref.orderByChild('sequence')
          .equalTo(currSeq)
          .on('value', function(snapshot) {
            var data = snapshot.val();
            accordionCtrl.currentUser.currentLesson = data[currSeq].course;
            accordionCtrl.currentUser.currentShuffle = data[currSeq].shuffle; 
          });
        ref.orderByChild('sequence')
          .equalTo(maxSeq)
          .on('value', function(snapshot) {
            var data = snapshot.val();
            accordionCtrl.currentUser.maxLesson = data[maxSeq].course;
            accordionCtrl.currentUser.maxShuffle = data[maxSeq].shuffle;
          });
        });  
      }, 500);

      getCurrentUserProgress(accordionCtrl.currentUser);
    };

    function getCurrentUserProgress(user) {
      Missions.getLastElement().then(function(lastEl){
        console.log('lastelement:',lastEl);
        console.log('current user sequence:',user.currentSequence);
        var lastElSeq = Object.keys(lastEl)[0] || 0;
        var userMaxSeq = user.maxSequence || 0;
        // accordionCtrl.currentUser.progress = userSeqNum / lastElSeq;
        accordionCtrl.currentUser.progress = Math.round((userMaxSeq / lastElSeq) * 100);
      });
    }

    function openFirstOne(index) {
      if(index === 0){
        return true;
      } else {
        return false;
      }
    };

    //get a list of step, course or shuffle.
    function getComponent(allElements, targetKey){ 
      var result = {};
      for(var key in allElements){
        if(!allElements[key][targetKey]){
          result[allElements[key][targetKey]] = true;
        }
      }
      return result;
    };

    function updateUserPosition(shuffleName) {
      var authData = userRef.getAuth();
      var refWrite = new Firebase(FirebaseUrl + '/users/' + authData.uid + '/');
      var currentUser = $firebaseObject(refWrite);
      var maxSeq;
      currentUser.$loaded().then(function() {
        maxSeq = currentUser.maxSequence || 0;  
        // console.log('maxSeq',maxSeq);

        ref.orderByChild('shuffle').equalTo(shuffleName)
        .limitToFirst(1)
        .on('value', function(snapshot) {
          var element = snapshot.val();
          for (var key in element) {
            var currentSeq = parseInt(key);
            console.log('currentSeq',currentSeq);
            console.log('maxSeq', maxSeq);
            if(currentSeq > maxSeq){
              maxSeq = currentSeq;    
            }
            
          }
          refWrite.update({
            currentSequence: currentSeq,
            maxSequence: maxSeq
          });
        });
      })
      
      
    };

    function makeLocalObject(allElements) {
      // console.log(allElements);
      var result = {}
      for(var numberKey in allElements) {
        var element = allElements[numberKey];
        var step = element['step'];
        var course = element['course'];
        var shuffle = element['shuffle'];
        var sequence = element['sequence'];
        // console.log(sequence);
        if(!result[step]) {
          result[step] = {}
        }
        if(!result[step][course]) {
          result[step][course] = {}
        }
        if(!result[step][course][shuffle]) {
          result[step][course][shuffle] = {}
        }
        // result[step][course][shuffle][element] = sequence; 
        result[step][course][shuffle] = sequence; 
        
      }
      // console.log('result', result);
      return result;
    };

    function isNotString(val) {
      if(typeof val === "string"){
        return false;
      } else {
        return true;
      }
    }
    function shuffleCompleted(seqNum, shuffle) {
      // console.log('seqNum', seqNum);
      // console.log('shuffle', shuffle);
      // console.log('maxseq2', accordionCtrl.currentUser.maxSequence)
      return seqNum <= accordionCtrl.currentUser.maxSequence;
    }
  };

})();