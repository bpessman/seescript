function nextCharacter() {
  current++;
  return source.charAt(current - 1);
}

function peek() {
  if (isAtEnd()) {
    return '\0';
  }
  return source.charAt(current);
}

function peekNext() {
  if (current + 1 >= source.length) {
    return '\0';
  }

  return source.charAt(current+1);
}

function match(expectedChar) {
  if (isAtEnd()) {
    return false;
  } else if (source.charAt(current) != expectedChar) {
    return false;
  }

  current++;
  return true;
}

function isAlphaNumeric(c) {
  return isAlpha(c) || isDigit(c);
}

function isAlpha(c) {
  return (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || c == '_';
}

function isDigit(c) {
  return c >= '0' && c <= '9';
}

function addToken(type, literal) {
  var text = source.substring(start, current);
  tokenList.push(new Token(type, text, line, literal));
}

function isAtEnd() {
  return current >= source.length;
}
