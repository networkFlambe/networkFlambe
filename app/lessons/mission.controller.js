//console.log alternative for code editor.
var nq_gate = {
  gateNeededEleNum: 0,
};
function openGate() {
  if(nq_gate.gateNeededEleNum > 0){
    nq_gate.gateNeededEleNum -= 1;
    console.log('currentGateNum', nq_gate.gateNeededEleNum);
  }
}
function resetGate() {
  nq_gate.gateNeededEleNum = 0;
  // console.log('gate count reset');
}

/**
 *
 * Mission Template Controller
 *
 */

(function(){
  'use strict';

  angular.module('neuralquestApp')
    .controller('MissionCtrl', MissionCtrl);

  function MissionCtrl ($firebaseArray, FirebaseUrl, 
    $firebaseObject, Missions, missionData, 
    $scope, Build, Users, auth, lastEle,
    $localStorage, $timeout, $state, $sce
    ) {
    
    var missionCtrl = this;
    var editor;
    var ref = new Firebase(FirebaseUrl + '/NNFlat');
    var authData = ref.getAuth();
    var editorInitialized = false;
    var questionHasBeenChecked = false;
    var editorHasBeenChecked = false;
    
    missionCtrl.testUrl = 'https://www.youtube.com/watch?v=t6elbnKVxpo&list=RD6AcDDc3JUJU&index=27';
    missionCtrl.lastElement = lastEle;
    console.log('lastEl',missionCtrl.lastElement);
    processSnapshot(missionData);
    
    
    missionCtrl.gate = nq_gate;
    missionCtrl.processSnapshot = processSnapshot;
    missionCtrl.saveElement = saveElement;
    missionCtrl.isAdmin = isAdmin;
    missionCtrl.isBuildMode = isBuildMode;
    missionCtrl.reset = reset;
    missionCtrl.run = run;
    missionCtrl.initEditor = initEditor;
    missionCtrl.checkGate = checkGate;
    missionCtrl.showCodeAnswer = showCodeAnswer;
    missionCtrl.multipleChoiceChecker = multipleChoiceChecker;
    resetGate();
    checkGateNeededEle();
    missionCtrl.jsxGraph = jsxGraph;

    
    // init();

    // missionCtrl.isAdminMode = BuildSrv.isAdminMode;

    function multipleChoiceChecker(answer) {
      if (answer && !questionHasBeenChecked) {
        questionHasBeenChecked = true;
        openGate();
      }
    };

    $scope.$watch('sequence', function(newVal, oldVal){
      console.log('hello');
      $timeout(function(){
        Prism.highlightAll();  
      }, 100);
    });

    /*=============================================
    =            METHOD IMPLEMENTATION            =
    =============================================*/
    function initEditor(prompt) {
      if(!editorInitialized){
        initCodeEditor(prompt);
        trackCode();  
        editorInitialized = true;
      }
    }

    function saveElement(data) {
      var refWrite = new Firebase(FirebaseUrl + '/users/' + authData.uid + '/');
      // console.log('you are here', data);
      // console.log('you are here', lastEle[data].sequence);
      //if last page show complete template.
      var lastEleKey = Object.keys(lastEle);
      if( (data) == lastEleKey ){
        console.log('you are here!!!!!');
        $timeout(function(){
          $state.go('missionComplete');
        },100)
      } else {
        // console.log("data arg is: ", data);
        data = data + 1;
        ref.orderByChild('sequence').startAt(data).limitToFirst(1).on('value', function(snapshot) {
          var element = snapshot.val();
          for (var seq in element) {
            refWrite.update({ currentSequence: element[seq].sequence });
            console.log('nextSeq is now: ', element[seq].sequence);
          }
        });

        resetGate();
      }
    };

    function processSnapshot(snapshot) {
      missionCtrl.elements = snapshot.val();
      var lastEleKey = Object.keys(lastEle);
      
      for(var elem in missionCtrl.elements) {
        missionCtrl.title = missionCtrl.elements[elem].shuffle;
        missionCtrl.sequence = missionCtrl.elements[elem].sequence;
      }
      if(missionCtrl.sequence <= lastEleKey){
        console.log('setting next shuffle');
        setNextShuffle(missionCtrl.sequence);  
      }
    };

    function setNextShuffle(sequence) {
      var nextSeq = sequence + 1;
      ref.orderByChild('sequence').startAt(nextSeq).limitToFirst(1).on('value', function(snapshot) {
        var element = snapshot.val();
        for (var seq in element) {
          missionCtrl.nextShuffle = element[seq].shuffle;
        }
      });
    };

    function getSequence (){
      var refRead = new Firebase(FirebaseUrl + '/users/' + authData.uid + '/');
      refRead.orderByChild('currentSequence').on('value', function(snapshot){
       $scope.currentSequence = snapshot.val().currentSequence
      });
    };

    function isAdmin() {
      //check if the current user is admin
      var isAdmin = Users.getUserProfile(auth.uid).isAdmin;
      return isAdmin;
    };

    function isBuildMode() {
      //check if buildMode
      return Build.getBuildMode();
    };

    function checkGate() {
      return nq_gateOpen;
    };
    
    function checkGateNeededEle() {
      for(var key in missionCtrl.elements){
        var type = missionCtrl.elements[key].type;
        if(type === "question" || type === "code-editor"){
          missionCtrl.gate.gateNeededEleNum += 1;
        }
      }
      console.log('gateNeededEleNum',missionCtrl.gate.gateNeededEleNum);
    }

    //-------------------------//
    /* methods for Ace Editor */
    //-------------------------//
    function initCodeEditor(prompt) {
      var codeEditor = document.getElementById("code-editor");
      if(codeEditor){
        editor = ace.edit("code-editor");
        editor.$blockScrolling = Infinity;
        editor.setTheme("ace/theme/monokai");
        editor.getSession().setMode("ace/mode/javascript");
        editor.setShowPrintMargin(false);
        editor.setValue(prompt, 1);
        editor.setOptions({
          maxLines: 100,
          minLines: 10,
          autoScrollEditorIntoView: true
        })
        $localStorage.codeObj = prompt;
      }
    };

    function trackCode() {
      if(editor){
        editor.on("change", function(posObj){
          $localStorage.codeObj = editor.getValue();
        });
      }
    };

    function reset(prompt) {
      editor.setValue(prompt, 1);
      editor.getSession().setUndoManager(new ace.UndoManager());
      $localStorage.codeObj = editor.getValue();
      missionCtrl.codeResult = '';
    };

    function showCodeAnswer(answer){
      editor.setValue(answer, 1);
      editor.getSession().setUndoManager(new ace.UndoManager());
      $localStorage.codeObj = editor.getValue();
      missionCtrl.codeResult = '';
      if (!editorHasBeenChecked) {
        openGate();
        editorHasBeenChecked = true;
      }
    }

    function run(testCase, handleMethod, apiRoute) {
      var temp; 
      temp = $localStorage.codeObj;
      console.log(temp);
      if (handleMethod === 'evaluate') {
        document.getElementById('result').innerHTML = '';
        $('.aceCode').remove();
        console.log('testcase', testCase);

        $localStorage.codeObj = '';

        $timeout(function(){
          missionCtrl.codeResult = temp;

          appendToScript(temp);
          appendToScript(testCase);

        },100);
      }
      if (handleMethod === 'API') {
        $('.aceCode').remove();
        appendToScript('var require = function(){ return {NeuralNetwork: function(){ return { train: function(){} } } } }; \
                        var data = data || null');
        appendToScript(temp);
        // console.log("temp is: ", temp)
        missionCtrl.codeResult = true;

        // Without this line then brainData will always be undefined!!
        var brainData = window.brainData;

        // Validate user input and/or provide null (which the server will deal with as default vals)
        if (brainData) {
          brainData.errorThresh = typeof brainData.errorThresh === 'number' ? brainData.errorThresh : null;
          brainData.iterations = typeof brainData.iterations === 'number' ? brainData.iterations : null;
          brainData.log = brainData.log === undefined ? null : typeof brainData.log === 'boolean' ? brainData.log : null;
          brainData.logPeriod = typeof brainData.logPeriod === 'number' ? brainData.logPeriod : null;
          brainData.learningRate = typeof brainData.learningRate === 'number' ? brainData.learningRate : null;
          brainData.momentum = typeof brainData.momentum === 'number' ? brainData.momentum : null;
          brainData.binaryThresh = typeof brainData.binaryThresh === 'number' ? brainData.binaryThresh : null;
        } else {
          var brainData = {
            errorThresh: null,
            iterations: null,
            log: null,
            logPeriod: null,
            learningRate: null,
            momentum: null,
            binaryThresh: null
          }
        }

        Missions.codeEditorApiCall(apiRoute, {
                                              hiddenLayers: hiddenLayers,
                                              data: data || null,
                                              errorThresh: brainData.errorThresh,
                                              iterations: brainData.iterations,
                                              log: brainData.log,
                                              logPeriod: brainData.logPeriod,
                                              learningRate: brainData.learningRate,
                                              momentum: brainData.momentum,
                                              binaryThresh: brainData.binaryThresh
                                             });
      }
    };

    // Append given code in a script tag which will run the given code:
    function appendToScript(code){
      var script = document.createElement('script');
      script.setAttribute('class', 'aceCode');
      try {
        script.appendChild(document.createTextNode(code));
        document.body.appendChild(script);
      } catch (e) {
        script.text = code;
        document.body.appendChild(script);
      }
    };
  };

      function jsxGraph (board) {
      var bias = board.create('slider', [[0, -0.25],[3, -0.25], [-30,5,30]], {name:'bias'})
      var weights = board.create('slider', [[0, -0.5],[3, -0.5], [-15,0,15]], {name: 'sum of weights'})
     // var x = ((weights.Value())+bias.Value())
      board.create('functiongraph',
                       [function(x){
                        return 1/(1 + Math.exp((-x*bias.Value())+weights.Value())
                          )}], 
                       {strokeColor:'blue',strokeWidth:3,dash:1});
    }

})();

