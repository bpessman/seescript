function run(source) {
  this.source = source;

  while(!isAtEnd()) {
    start = current;
    scanToken();
  }

  totalRuns++;
  tokenList.push(new Token(EOF, "", line, null));
  
  return tokenList;
}

//----------------------------------------------------------------------------------------------
//    Scanning the Tokens
//----------------------------------------------------------------------------------------------

function scanToken() {
  var c = nextCharacter();
  switch(c) {
    case '(':
      addToken(LEFT_PAREN, null);
      break;
    case ')':
      addToken(RIGHT_PAREN, null);
      break;
    case '{':
      addToken(LEFT_BRACE, null);
      break;
    case '}':
      addToken(RIGHT_BRACE, null);
      break;
    case ',':
      addToken(COMMA, null);
      break;
    case '.':
      addToken(DOT, null);
      break;
    case '-':
      addToken(match('-') ? MINUS_MINUS : MINUS, null);
      break;
    case '+':
      addToken(match('+') ? PLUS_PLUS : PLUS, null);
      break;
    case '%':
      addToken(MOD, null);
      break;
    case ';':
      addToken(SEMICOLON, null);
      break;
    case ':':
      addToken(COLON, null);
      break;
    case '/':
      if (match('/')) {
        while (peek() != '\n' && !isAtEnd()) nextCharacter();
      } else {
        addToken(SLASH, null);
      }
      break;
    case '*':
      addToken(STAR, null);
      break;
    case '!':
      addToken(match('=') ? NOT_EQUAL : NOT, null);
      break;
    case '=':
      addToken(match('=') ? EQUAL_EQUAL : EQUAL, null);
      break;
    case '<':
    if (match('<')) {
      addToken(ARROW, null);
    } else {
      addToken(match('=') ? LESS_EQUAL : LESS, null);
    }
      break;
    case '>':
      addToken(match('=') ? GREATER_EQUAL : GREATER, null);
      break;
    case ' ':
      break;
    case '\r':
      break;
    case '\t':
      break;
    case '\n':
      line++;
      break;
    case '"':
      string();
      break;

    default:
      if (isDigit(c)) {
        number();
      } else if(isAlpha) {
        identifier();
      } else {
        errorList.push(new ThrowError(line, "Lexer", "Unexpected '" + c + "' character."));
      }
  }
}
