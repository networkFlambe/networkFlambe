/**
 *
 * User Service
 *
 */

(function(){
  'use strict';

  angular
    .module('neuralquestApp')
    .factory('Users', ['$firebaseArray', '$firebaseObject', 'FirebaseUrl', '$location', Users]);


    function Users($firebaseArray, $firebaseObject, FirebaseUrl, $location){
      var usersRef = new Firebase(FirebaseUrl+'users');
      var users = $firebaseArray(usersRef);

      var User = {};
      User.getProfile = getProfile;
      User.getDisplayName = getDisplayName;
      User.getGravatar = getGravatar;
      User.getUserProfile = getUserProfile;
      User.all = users;
      User.currentUser;
      
      return User;


      /*=============================================
      =            METHOD IMPLEMENTATION            =
      =============================================*/
      
      function getProfile(uid) {
        return $firebaseObject(usersRef.child(uid));
      }
      function getDisplayName(uid, callback) {

        return users.$getRecord(uid).displayName;
      }
      function getUserProfile(uid) {

        return users.$getRecord(uid);
      }
      function getGravatar(uid) {
        return '//www.gravatar.com/avatar/' + users.$getRecord(uid).emailHash;
      }
    };

})();