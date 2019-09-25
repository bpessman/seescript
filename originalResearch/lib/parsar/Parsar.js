function parse(tokens) {
  var currentToken = 0;
  var statementList = [];
  //----------------------------------------------------------------------------------------------
  //    Splits Tokens into Statements
  //----------------------------------------------------------------------------------------------
  while(!checkToken(EOF, currentToken, tokens)) {
    var statement = [];

    var i = 0;
    if (checkToken(FUNCTION, currentToken, tokens)) {
      while(!checkToken(RIGHT_BRACE, currentToken, tokens)) {
        statement[i] = tokens[currentToken];
        currentToken++;
        i++;
      }
    } else if (checkToken(FOR, currentToken, tokens)) {
      while(!checkToken(RIGHT_BRACE, currentToken, tokens)) {
        statement[i] = tokens[currentToken];
        currentToken++;
        i++;
      }
    } else {
      while(!checkToken(SEMICOLON, currentToken, tokens)) {
        statement[i] = tokens[currentToken];
        currentToken++;
        i++;
      }
    }

    statementList.push(statements(statement));
    currentToken++;
    parsarLineNumber++;
  }


  for (i = 0; i < statementList.length; i++) {
    statementList[i].evaluate();
  }
}

function statements(statement) {
  //----------------------------------------------------------------------------------------------
  //    Animation Statement
  //----------------------------------------------------------------------------------------------

  if (has(statement, FUNCTION) && has(statement, FIXEDUPDATE)) {
    var delay = statement[3].literal;
    var iterations = statement[5].literal;
    var loopTokens = statement.slice(8, statement.length);

    return new statementAnimate(delay, iterations, loopTokens)
  }

  //----------------------------------------------------------------------------------------------
  //    Plus Unary Statemenet
  //----------------------------------------------------------------------------------------------

  else if (has(statement, PLUS_PLUS) && has(statement, IDENTIFIER)) {
    var id = statement[0].lexeme;
    var operator = statement[1].type;

    return new statementUnaryOperator(id, operator);
  }

  //----------------------------------------------------------------------------------------------
  //    Minus Unary Statemenet
  //----------------------------------------------------------------------------------------------

  else if (has(statement, MINUS_MINUS) && has(statement, IDENTIFIER)) {
    var id = statement[0].lexeme;
    var operator = statement[1].type;

    return new statementUnaryOperator(id, operator);
  }

  //----------------------------------------------------------------------------------------------
  //    For Loop Statement
  //----------------------------------------------------------------------------------------------

  else if (has(statement, FOR)) {
    if (has(statement, LEFT_BRACE)) {
      var count = statement[2].literal;
      var loopTokens = statement.slice(5, statement.length + 1);

      return new statementForLoop(count, loopTokens);
    } else {
      errorList.push(new ThrowError(parsarLineNumber, "Parsar", "Missing a brace in for loop!"));
    }
  }

  //----------------------------------------------------------------------------------------------
  //    Object Creation Statement
  //----------------------------------------------------------------------------------------------

  else if (has(statement, VAR) && has(statement, EQUAL) && !has(statement, RECTANGLE) && !has(statement, CIRCLE) && !has(statement, LINE) && !has(statement, TEXT) && !has(statement, DOT)) {
    var id = statement[1].lexeme;
    var value = new expression(statement.slice(3, statement.length));
    //var type = statement[3].type;
    var type = NUMBER;

    return new statementObjectCreation(id, value, type);
  }

  //----------------------------------------------------------------------------------------------
  //    Object Set Statement
  //----------------------------------------------------------------------------------------------

  else if (has(statement, IDENTIFIER) && has(statement, EQUAL) && !has(statement, RECTANGLE) && !has(statement, CIRCLE)&& !has(statement, LINE) && !has(statement, TEXT) && !has(statement, DOT)) {
    var id = statement[0].lexeme;
    var value = new expression(statement.slice(2, statement.length));
    //var type = statement[2].type;
    var type = NUMBER;

    return new statementSetObjectValue(id, value, type);
  }

  //----------------------------------------------------------------------------------------------
  //    Print Statement
  //----------------------------------------------------------------------------------------------

  else if (has(statement, PRINT) && (has(statement, IDENTIFIER) || has(statement, STRING) || has(statement, NUMBER))) {
    var value = new expression(statement.slice(1, statement.length));

    return new statementPrint(value);
  }

  //----------------------------------------------------------------------------------------------
  //    Rectangle Statement
  //----------------------------------------------------------------------------------------------

  else if (has(statement, VAR) && has(statement, IDENTIFIER) && has(statement, RECTANGLE) && has(statement, EQUAL)) {
    var id = statement[1].lexeme;
    var type = statement[3].type;
    var x = new expression(statement.slice(5, 6));
    var y = new expression(statement.slice(7, 8));
    var width = new expression(statement.slice(9, 10));
    var height = new expression(statement.slice(11, 12));
    var red = new expression(statement.slice(13, 14));
    var green = new expression(statement.slice(15, 16));
    var blue = new expression(statement.slice(17, 18));

    return new statementRectangle(id, type, x, y, width, height, red, green, blue);
  }

  //----------------------------------------------------------------------------------------------
  //    Circle Statement
  //----------------------------------------------------------------------------------------------

  else if (has(statement, VAR) && has(statement, IDENTIFIER) && has(statement, CIRCLE) && has(statement, EQUAL)) {
    var id = statement[1].lexeme;
    var type = statement[3].type;
    var cx = new expression(statement.slice(5, 6));
    var cy = new expression(statement.slice(7, 8));
    var radius = new expression(statement.slice(9, 10));
    var red = new expression(statement.slice(11, 12));
    var green = new expression(statement.slice(13, 14));
    var blue = new expression(statement.slice(15, 16));

    return new statementCircle(id, type, cx, cy, radius, red, green, blue);
  }

  //----------------------------------------------------------------------------------------------
  //    Line Statement
  //----------------------------------------------------------------------------------------------

  else if (has(statement, VAR) && has(statement, IDENTIFIER) && has(statement, LINE) && has(statement, EQUAL)) {
    var id = statement[1].lexeme;
    var type = statement[3].type;
    var x1 = new expression(statement.slice(5, 6));
    var y1 = new expression(statement.slice(7, 8));
    var x2 = new expression(statement.slice(9, 10));
    var y2 = new expression(statement.slice(11, 12));
    var red = new expression(statement.slice(13, 14));
    var green = new expression(statement.slice(15, 16));
    var blue = new expression(statement.slice(17, 18));
    var strokeWidth = new expression(statement.slice(19, 20));

    return new statementLine(id, type, x1, y1, x2, y2, red, green, blue, strokeWidth);
  }

  //----------------------------------------------------------------------------------------------
  //    Text Statement
  //----------------------------------------------------------------------------------------------

  else if (has(statement, VAR) && has(statement, IDENTIFIER) && has(statement, TEXT) && has(statement, EQUAL)) {
    var id = statement[1].lexeme;
    var type = statement[3].type;
    var x = new expression(statement.slice(5, 6));
    var y = new expression(statement.slice(7, 8));
    var text = new expression(statement.slice(9, 10));
    var red = new expression(statement.slice(11, 12));
    var green = new expression(statement.slice(13, 14));
    var blue = new expression(statement.slice(15, 16));

    return new statementText(id, type, x, y, text, red, green, blue);
  }
  //----------------------------------------------------------------------------------------------
  //    Attribute Statement
  //----------------------------------------------------------------------------------------------

  else if (has(statement, IDENTIFIER) && has(statement, DOT) && has(statement, EQUAL)) {
    var id = statement[0].lexeme;
    var edit = statement[2].lexeme;
    var value = new expression(statement.slice(4, statement.length));

    return new statementAttribute(id, edit, value);
  }

  //----------------------------------------------------------------------------------------------
  //    Ellipse Statement
  //----------------------------------------------------------------------------------------------



  //----------------------------------------------------------------------------------------------
  //    Polygon Statement
  //----------------------------------------------------------------------------------------------



  //----------------------------------------------------------------------------------------------
  //    Polyline Statement
  //----------------------------------------------------------------------------------------------



  //----------------------------------------------------------------------------------------------
  //    Throw an error if it reaches this point!
  //----------------------------------------------------------------------------------------------

  else {
    errorList.push(new ThrowError(parsarLineNumber, "Parsar", "This statement is not recognized!"));
  }

  //----------------------------------------------------------------------------------------------
  //    Expression Calls
  //----------------------------------------------------------------------------------------------

  function expression(tokens) {
    this.tokens = tokens;

    this.evaluate = function() {
      return expr(tokens);
    }
  }


}
