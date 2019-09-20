document.getElementById("codeInputArea").onkeydown = function(e) {
    textarea = document.getElementById("codeInputArea");

    if (e.keyCode === 9) { // Tab Key
      var val = textarea.value;
      start = textarea.selectionStart;
      end = textarea.selectionEnd;

      // set textarea value to: text before caret + tab + text after caret
      textarea.value = val.substring(0, start) + '\t' + val.substring(end);

      // put caret at right position again
      textarea.selectionStart = textarea.selectionEnd = start + 1;

      // prevent the focus lose
      return false;
    }
};
