// 'use strict'

describe('Missions.controller.spec', function () {
  var MissionCtrl,Build,
      $scope = {};

  beforeEach(module('neuralquestApp'));
  
  beforeEach(inject(function ($injector) {
    $rootScope = $injector.get('$rootScope');
    $scope = $rootScope.$new();
    $controller = $injector.get('$controller');

    MissionCtrl = $controller('MissionCtrl', {
      $scope: $scope,
      missionData: {},
      Build: {
        getBuildMode: function(){
          return true;
        }
      },
      auth: {
        uid: "12345"
      },
      lastEle: {},
      missionData: {
        val: function() {
          return {}
        }
      },
      Users: {
        getUserProfile: function(userID){
          return {
            isAdmin: true
          }
        }
      }
    })
  }));

  describe('MissionCtrl', function () {
    
    it('should have all necessary methods', function() {
      expect(typeof MissionCtrl.processSnapshot).toBe('function');
      expect(typeof MissionCtrl.saveElement).toBe('function');
      expect(typeof MissionCtrl.isAdmin).toBe('function');
      expect(typeof MissionCtrl.isBuildMode).toBe('function');
      expect(typeof MissionCtrl.reset).toBe('function');
      expect(typeof MissionCtrl.initEditor).toBe('function');
      expect(typeof MissionCtrl.checkGate).toBe('function');
      expect(typeof MissionCtrl.showCodeAnswer).toBe('function');
      expect(typeof MissionCtrl.multipleChoiceChecker).toBe('function');
    })

  });
  xdescribe('isAdmin unit test', function () {
    it('should return true for an admin user', function () {
      expect(MissionCtrl.isAdmin()).toBe(true);
    });
  });
  xdescribe('isBuildMode unit test', function () {
    it('should return true or false', function () {
      var result = false;
      if(MissionCtrl.isBuildMode() === true || MissionCtrl.isBuildMode() === false){
        result = true;
      }
      expect(result).toBe(true);
    });
  });
  describe('processSnapshot unit test', function () {
    
  });
  describe('setNextShuffle unit test', function () {
    //firebase realted
  });
  describe('getSequence unit test', function () {
    //firebase related
  });
  describe('saveElement method unit test', function () {
    //firebase related
  });
});
