/*=====================================================
=            unit test for app/config/constant.js            =
=====================================================*/

describe('constant.spec', function () {
  var FirebaseUrl;
  beforeEach(function() {
    module('neuralquestApp');
  });

  beforeEach(inject(function (_FirebaseUrl_) {    
    FirebaseUrl = _FirebaseUrl_;
  }));

  var theUrl = 'https://neuralquest.firebaseio.com/';
  xit('should have the right URL', function () {
    expect(FirebaseUrl).toEqual(theUrl);

  });
    
});