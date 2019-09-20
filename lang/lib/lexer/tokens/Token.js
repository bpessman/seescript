function Token(type, lexeme, line, literal) {
  this.type = type;
  this.lexeme = lexeme;
  this.line = line;
  this.literal = literal;
}

Token.prototype.getString = function() {
  return "[TOKENTYPE]: " + this.type + "\n[LEXEME]: " +
         this.lexeme + "\n[LITERAL]: " + this.literal +
         "\n[Line]: " + this.line + "\n\n";
 }
