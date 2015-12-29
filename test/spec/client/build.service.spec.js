/*=====================================================
=            unit test for app/build/build.service.js            =
=====================================================*/

describe('build.service.spec', function () {
  var Build, $localStorage, FirebaseUrl, $q;
  beforeEach(function() {
    module('neuralquestApp');
  });


  beforeEach(inject(function (_$localStorage_,_FirebaseUrl_,_$q_, _Build_) {    
    $localStorage = _$localStorage_;
    FirebaseUrl = _FirebaseUrl_;
    $q = _$q_;
    Build = _Build_;
  }));

  describe('Build.service methods check', function () {
    it('should have setBuildMode Method', function () {
      expect(typeof Build.setBuildMode).toBe("function");
    });
    it('should have getBuildMode Method', function () {
      expect(typeof Build.getBuildMode).toBe("function");
    });
    it('should have updateBuild Method', function () {
      expect(typeof Build.updateBuild).toBe("function");
    });
    it('should have getElementonDB Method', function () {
      expect(typeof Build.getElementonDB).toBe("function");
    });
  });

  describe('setBuildMode method unit tests', function () {
    it('should toggle isBuildMode when invoked', function () {
      $localStorage.isBuildMode = false;

      Build.setBuildMode();

      expect($localStorage.isBuildMode).toBe(true);  
    });

  });
  
  xdescribe('getBuildMode method unit tests', function () {
    it('should return Boolean buildMode', function () {
      $localStorage.isBuildMode = false;

      expect(Build.getBuildMode()).toBe(false);  
    });

  });

  describe('updateBuild method unit tests', function () {
    //firebase related how?
  });

  describe('getElementonDB method unit tests', function () {
    //firebase related how?
  });
});