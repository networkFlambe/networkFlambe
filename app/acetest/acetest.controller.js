var nqConsole = function() {
  return({
      log: function(msg) {
        consoleDiv = document.getElementById('result');
        para = document.createElement('p');
        text = document.createTextNode(msg);
        para.appendChild(text);
        consoleDiv.appendChild(para);
      }
  });
}();

(function() {
  'use strict';

  angular
      .module('neuralquestApp')
      .controller('AceCtrl', ['$localStorage','$timeout', 'Ace', AceCtrl]);

  /* @ngInject */
  function AceCtrl($localStorage, $timeout, Ace) {
    var vm = this;
    var editor;
    // var nqconsole = {};

    vm.getValue = getValue;
    vm.reset = reset;
    vm.run = run;

    

    init();

    ////////////////

    function init() {
      initCodeEditor();
      trackCode();
    };

    function trackCode() {
      editor.on("change", function(posObj){
        $localStorage.codeObj = editor.getValue();
      });
    };

    function initCodeEditor() {
      editor = ace.edit("code-editor");
      editor.setTheme("ace/theme/monokai");
      editor.getSession().setMode("ace/mode/javascript");
      editor.setValue("//your code start here. \n");
    };

    function getValue() {
      vm.result = $localStorage.codeObj;
    };

    function reset() {
      editor.setValue("//your code start here. \n");
      editor.getSession().setUndoManager(new ace.UndoManager());
      $localStorage.codeObj = '';
    };

    function run() {
      document.getElementById('result').innerHTML = '';
      $('.aceCode').remove();

      $timeout(function(){
        appendToScript($localStorage.codeObj);
        appendToScript(testCases());
      },100);
      
    }

    //append a given code to in the script tag. it will run the given code
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
    }

    function testCases(code){
      var testCases = ' \
      if(typeof add !== "function"){ \
        nqConsole.log("add function should be defined."); \
      } \
      if(add(1,2)===3){ \
        nqConsole.log(" you got it") \
      }else { \
        nqConsolelog("try again"); \
      } \
      ';
      return testCases;
    }

    function consoleLog(){
      // if(!console){
      //   console = {};
      // };
      var old = console.log;
      var logger = document.getElementById('result');
      nqconsole.log = function (message) {
          if (typeof message == 'object') {
              logger.innerHTML += (JSON && JSON.stringify ? JSON.stringify(message) : message) + '<br />';
          } else {
              logger.innerHTML += message + '<br />';
          }
      }
    }
  }
})();


