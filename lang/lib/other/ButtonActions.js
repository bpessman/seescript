function compileClicked() {
  runProgram();
}

function clearClicked() {
  document.getElementById("codeOutputArea").value = "";
}

function clearCodeClicked() {
  document.getElementById("codeInputArea").value = "";
}

function downloadClicked() {
  console.log("Clicked");
  gif.render();
  console.log("Clicked");
}





document.getElementById('codeInputArea').addEventListener('blur', e => {
  e.target.focus();
});
