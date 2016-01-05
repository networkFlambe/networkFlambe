/**
 *
 * Lesson Template Controller
 *
 */

(function(){
  'use strict';

  angular.module('neuralquestApp')
    .controller('LessonTemplateCtrl', ['$firebaseObject', 'FirebaseUrl', LessonTemplateCtrl]);

    function LessonTemplateCtrl ($firebaseObject, FirebaseUrl) {
      var lessonTemplateCtrl = this;
      var ref = new Firebase(FirebaseUrl + 'test2/steps/step1/courses/courseID1/missions/refName3/shuffles/generated5');

      lessonTemplateCtrl.data = $firebaseObject(ref);

      lessonTemplateCtrl.data.$loaded()
        .then(function() {
          console.log(lessonTemplateCtrl.data);
        })
      

      /*=============================================
      =            METHOD IMPLEMENTATION            =
      =============================================*/
      
    }

})();