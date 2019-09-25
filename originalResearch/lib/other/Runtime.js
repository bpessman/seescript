totalRuns = 0;

function runProgram() {
  startTime = new Date().getTime();

  resetInformation();

  parse(run(source = document.getElementById("codeInputArea").value));

  checkForErrors();

  endTime = new Date().getTime();
  time = endTime - startTime;
  //debug(time);
}

//----------------------------------------------------------------------------------------------
//    Checking/Displaying Errors after Run
//----------------------------------------------------------------------------------------------

function checkForErrors() {
  for (i = 0; i < errorList.length; i++) {
    console.log(errorList[i].getString());
  }
}

//----------------------------------------------------------------------------------------------
//    Resets all Global variables and the Canvas
//----------------------------------------------------------------------------------------------

function resetInformation() {
  // Removes all the elements from previous runs
  var canvas = document.getElementById("canvas");
  while (canvas.hasChildNodes()) {
    canvas.removeChild(canvas.lastChild);
  }

  // Global Lexer Variables
  line = 1;
  current = 0;
  start = 0;
  tokenList = [];

  // Global Parsar Variables
  parsarLineNumber = 0;
  objectList = [];
  shapeList = [];

  // Other Global Variables
  errorList = [];




  clearTimeout(timeoutT);
}

//----------------------------------------------------------------------------------------------
//    Debug Information
//----------------------------------------------------------------------------------------------

function debug(time) {
  console.log("Debug Information->[Run:" + totalRuns + "]" + "[Time:" + time + "ms]\n");
}
