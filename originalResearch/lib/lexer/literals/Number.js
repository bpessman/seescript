function number() {
  while (isDigit(peek())) {
    nextCharacter();
  }

  if (peek() == '.' && isDigit(peekNext())) {
    nextCharacter();

    while (isDigit(peek())) {
      nextCharacter();
    }
  }

  addToken(NUMBER, parseFloat(source.substring(start,current)));
}
