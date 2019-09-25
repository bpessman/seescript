function identifier() {
  while(isAlphaNumeric(peek())) {
    nextCharacter();
  }

  var type = IDENTIFIER;
  var text = source.substring(start, current);

  if (keywordsList.get(text) != null) {
    type = keywordsList.get(text);
  }

  addToken(type, null);
}
