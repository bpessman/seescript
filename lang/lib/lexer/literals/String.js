function string() {
  while (peek() != '"' && !isAtEnd()) {
    if (peek() == '\n') {
      line++;
    }

    nextCharacter();
  }
  if (current >= source.length) {
    errorList.push(new ThrowError(line,"Lexer:String","Unterminated string found."));

    return;
  }
  nextCharacter();
  var value = source.substring(start + 1, current - 1);

  addToken(STRING, value);
}
