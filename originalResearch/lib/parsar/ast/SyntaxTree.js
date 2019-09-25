//----------------------------------------------------------------------------------------------
//    Unary Operator Statement
//----------------------------------------------------------------------------------------------

function statementUnaryOperator(id, operator) {
  this.id = id;
  this.operator = operator;
}

statementUnaryOperator.prototype.evaluate = function() {
  var operator = this.operator;
  var id = this.id;

  var createdTokens = [];
  if (operator == PLUS_PLUS) {
    createdTokens.push(new Token(IDENTIFIER, id, null, null));
    createdTokens.push(new Token(PLUS, "+", null, null));
    createdTokens.push(new Token(NUMBER, 1, null, 1));
  } else {
    createdTokens.push(new Token(IDENTIFIER, id, null, null));
    createdTokens.push(new Token(MINUS, "-", null, null));
    createdTokens.push(new Token(NUMBER, 1, null, 1));
  }

  var value = expr(createdTokens);

  if (isAnObject(id)) {
    objectList.splice(getObjectIndex(id), 1, createAnObject(id, value, NUMBER));
  } else {
    errorList.push(new ThrowError(parsarLineNumber, "Parsar", "You have not created a '" + id + "' object."));
  }
}

//----------------------------------------------------------------------------------------------
//    Animation Statement
//----------------------------------------------------------------------------------------------

function statementAnimate(delayer, iterations, loopTokens) {
  this.delayer = delayer;
  this.iterations = iterations;
  this.loopTokens = loopTokens;
}

statementAnimate.prototype.evaluate = function() {
  var delayer = this.delayer;
  var iterations = this.iterations;
  var loopTokens = this.loopTokens;

  var counter = 0;
  timeoutT = window.setTimeout(animate, delayer);

  function animate() {
    var currentToken = 0;
    while(currentToken < loopTokens.length) {
      var statement = [];
        var i = 0;
        while(!checkToken(SEMICOLON, currentToken, loopTokens) || loopTokens.length == 0) {
          statement[i] = loopTokens[currentToken];
          currentToken++;
          i++;
        }
        statements(statement).evaluate();
        currentToken++;
      }

      var data = new XMLSerializer().serializeToString(canvas);
      var svgBlob = new Blob([data], {type: 'image/svg+xml;charset=utf-8'});
      var url = URL.createObjectURL(svgBlob);


      var img = new Image();
        img.onload = function () {
          gif.addFrame(img, {
            delay: 500,
            copy: true
          });
          URL.revokeObjectURL(url);
        };

      img.src = url;

    if (counter < iterations - 1) {
      counter++;
      timeoutT = window.setTimeout(animate, delayer);
     } 
  }
}

//----------------------------------------------------------------------------------------------
//    While Loop Statement
//----------------------------------------------------------------------------------------------



//----------------------------------------------------------------------------------------------
//    If Statement
//----------------------------------------------------------------------------------------------



//----------------------------------------------------------------------------------------------
//    For Loop Statement
//----------------------------------------------------------------------------------------------

function statementForLoop(count, loopTokens) {
  this.count = count;
  this.loopTokens = loopTokens;
}

statementForLoop.prototype.evaluate = function() {
  var count = this.count;
  var loopTokens = this.loopTokens;

  for (c = 0; c < count; c++) {
    currentToken = 0;
    while(currentToken < loopTokens.length) {
      var statement = [];

      var i = 0;
      while(!checkToken(SEMICOLON, currentToken, loopTokens)) {
        statement[i] = loopTokens[currentToken];
        currentToken++;
        i++;
      }

      currentToken++;
      statements(statement).evaluate();
    }
  }
}

//----------------------------------------------------------------------------------------------
//    Object Creation Statement
//----------------------------------------------------------------------------------------------

function statementObjectCreation(id, value, type) {
  this.id = id;
  this.value = value;
  this.type = type;
}

statementObjectCreation.prototype.evaluate = function() {
  var id = this.id;
  var value = this.value;
  var type = this.type;

  value = value.evaluate();
  if (type == RANDOM) {
    type = NUMBER;
  }

  if (!isAnObject(id)) {
    if (isAnObject(value)) {
      objectList.push(createAnObject(id, objectList[getObjectIndex(value)].value, type));
    } else {
      objectList.push(createAnObject(id,value,type));
    }
  } else {
    errorList.push(new ThrowError(parsarLineNumber, "Parsar", "You have already created a '" + id + "' object."));
  }
}

//----------------------------------------------------------------------------------------------
//    Object Set Statement
//----------------------------------------------------------------------------------------------

function statementSetObjectValue(id, value, type) {
  this.id = id;
  this.value = value;
  this.type = type;
}

statementSetObjectValue.prototype.evaluate = function() {
  var id = this.id;
  var value = this.value;
  var type = this.type;
  value = value.evaluate();
  if (type == RANDOM) {
    type = NUMBER;
  }

  if (isAnObject(id)) {
    objectList.splice(getObjectIndex(id), 1, createAnObject(id, value, type));
  } else {
    errorList.push(new ThrowError(parsarLineNumber, "Parsar", "You have not created a '" + id + "' object."));
  }
}

//----------------------------------------------------------------------------------------------
//    Print Statement
//----------------------------------------------------------------------------------------------

function statementPrint(value) {
  this.value = value;
}

statementPrint.prototype.evaluate = function() {
  var value = this.value;

  value = value.evaluate();

  codeOutputArea.value += value + "\n";
}

//----------------------------------------------------------------------------------------------
//    Rectangle Statement
//----------------------------------------------------------------------------------------------

function statementRectangle(id, type, x, y, width, height, red, green, blue) {
  this.id = id;
  this.type = type;
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.red = red;
  this.green = green;
  this.blue = blue;
}

statementRectangle.prototype.evaluate = function() {
  var id = this.id;
  var type = this.type;
  var x = this.x;
  var y = this.y;
  var width = this.width;
  var height = this.height;
  var red = this.red;
  var green = this.green;
  var blue = this.blue;

  x = x.evaluate();
  y = y.evaluate();
  width = width.evaluate();
  height = height.evaluate();
  red = red.evaluate();
  green = green.evaluate();
  blue = blue.evaluate();

  var rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
  shapeList.push(id);
  rect.setAttribute("id", id);
  rect.setAttribute("x", x);
  rect.setAttribute("y", y);
  rect.setAttribute("width", width);
  rect.setAttribute("height", height);
  rect.setAttribute("fill", "rgb(" + red + "," + green + "," + blue + ")");
  document.getElementById("canvas").appendChild(rect);
}

//----------------------------------------------------------------------------------------------
//    Circle Statement
//----------------------------------------------------------------------------------------------

function statementCircle(id, type, cx, cy, radius, red, green, blue) {
  this.id = id;
  this.type = type;
  this.cx = cx;
  this.cy = cy;
  this.radius = radius;
  this.red = red;
  this.green = green;
  this.blue = blue;
}

statementCircle.prototype.evaluate = function() {
  var id = this.id;
  var type = this.type;
  var cx = this.cx;
  var cy = this.cy;
  var radius = this.radius;
  var red = this.red;
  var green = this.green;
  var blue = this.blue;

  cx = cx.evaluate();
  cy = cy.evaluate();
  radius = radius.evaluate();
  red = red.evaluate();
  green = green.evaluate();
  blue = blue.evaluate();

  var circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
  shapeList.push(id);
  circle.setAttribute("id", id);
  circle.setAttribute("cx", cx);
  circle.setAttribute("cy", cy);
  circle.setAttribute("r", radius);
  circle.setAttribute("fill", "rgb(" + red + "," + green + "," + blue + ")");
  document.getElementById("canvas").appendChild(circle);
}

//----------------------------------------------------------------------------------------------
//    Ellipse Statement
//----------------------------------------------------------------------------------------------


//----------------------------------------------------------------------------------------------
//    Line Statement
//----------------------------------------------------------------------------------------------

function statementLine(id, type, x1, y1, x2, y2, red, green, blue, strokeWidth) {
  this.id = id;
  this.type = type;
  this.x1 = x1;
  this.y1 = y1;
  this.x2 = x2;
  this.y2 = y2;
  this.red = red;
  this.green = green;
  this.blue = blue;
  this.strokeWidth = strokeWidth;
}

statementLine.prototype.evaluate = function() {
  var id = this.id;
  var type = this.type;
  var x1 = this.x1;
  var y1 = this.y1;
  var x2 = this.x2;
  var y2 = this.y2;
  var red = this.red;
  var green = this.green;
  var blue = this.blue;

  x1 = x1.evaluate();
  y1 = y1.evaluate();
  x2 = x2.evaluate();
  y2 = y2.evaluate();
  red = red.evaluate();
  green = green.evaluate();
  blue = blue.evaluate();
  strokeWidth = strokeWidth.evaluate();

  var line = document.createElementNS('http://www.w3.org/2000/svg', 'line')
  shapeList.push(id);
  line.setAttribute("id", id);
  line.setAttribute("x1", x1);
  line.setAttribute("y1", y1);
  line.setAttribute("x2", x2);
  line.setAttribute("y2", y2);
  line.setAttribute("style", "stroke:rgb(" + red + "," + green + "," + blue + ");stroke-width:" + strokeWidth);
  document.getElementById("canvas").appendChild(line);
}

//----------------------------------------------------------------------------------------------
//    Polygon Statement
//----------------------------------------------------------------------------------------------


//----------------------------------------------------------------------------------------------
//    Polyline Statement
//----------------------------------------------------------------------------------------------


//----------------------------------------------------------------------------------------------
//    Text Statement
//----------------------------------------------------------------------------------------------

function statementText(id, type, x, y, text, red, green, blue) {
  this.id = id;
  this.type = type;
  this.x = x;
  this.y = y;
  this.text = text;
  this.red = red;
  this.green = green;
  this.blue = blue;
}

statementText.prototype.evaluate = function() {
  var id = this.id;
  var type = this.type;
  var x = this.x;
  var y = this.y;
  var text = this.text;
  var red = this.red;
  var green = this.green;
  var blue = this.blue;

  x = x.evaluate();
  y = y.evaluate();
  text = text.evaluate();
  red = red.evaluate();
  green = green.evaluate();
  blue = blue.evaluate();

  var textElement = document.createElementNS('http://www.w3.org/2000/svg', 'text')
  shapeList.push(id);
  textElement.setAttribute("id", id);
  textElement.setAttribute("x", x);
  textElement.setAttribute("y", y);
  textElement.setAttribute("fill", "rgb(" + red + "," + green + "," + blue + ")");
  textElement.innerHTML = text;
  document.getElementById("canvas").appendChild(textElement);
}

//----------------------------------------------------------------------------------------------
//    Attribute Statement
//----------------------------------------------------------------------------------------------

function statementAttribute(id, edit, value) {
  this.id = id;
  this.edit = edit;
  this.value = value;
}

statementAttribute.prototype.evaluate = function() {
  var value = this.value;
  var edit = this.edit;
  var id = this.id;

  value = value.evaluate();

  var object = document.getElementById(id).setAttribute(edit, value);
}

//----------------------------------------------------------------------------------------------
//    Trigonometric Statement
//----------------------------------------------------------------------------------------------

function statementTrigonometric(id, type, value) {
  this.id = id;
  this.type = type;
  this.value = value;
}

statementTrigonometric.prototype.evaluate = function() {
  var id = this.id;
  var type = this.type;
  var value = this.value;
}

//----------------------------------------------------------------------------------------------
//    'Expr' Helper Methods
//----------------------------------------------------------------------------------------------

function expr(tokens) {
  exprTokens = tokens;
  exprCurrent = 0;

  return expressionAddition();
}

function previous_e() {
  return exprTokens[exprCurrent-1];
}

function peek_e() {
  return exprTokens[exprCurrent];
}

function advance_e() {
  exprCurrent++;
  return previous_e();
}

function check_e(type) {
  try {
    return peek_e().type == type;
  } catch (error) {
    return false;
  }
}

function match_e() {
  for (i = 0; i < arguments.length; i++) {
    if (check_e(arguments[i])) {
      advance_e();
      return true;
    }
  }

  return false;
}

//----------------------------------------------------------------------------------------------
//    Order of Operations Recursion
//----------------------------------------------------------------------------------------------

function expressionAddition() {
  var left = expressionMultiplication();

  while (match_e(MINUS, PLUS, MOD)) {
    var operator = previous_e().type;
    var right = expressionMultiplication();
    left = findExpressionWithOperator(left, operator, right);
  }

  return left;
}

function expressionMultiplication() {
  var left = expressionAtom();

  while (match_e(STAR, SLASH)) {
    var operator = previous_e().type;
    var right = expressionAtom();
    left = findExpressionWithOperator(left, operator, right);
  }

  return left;
}

function expressionAtom() {

  try {
    if (match_e(NUMBER, STRING)) {
      return previous_e().literal;
    } else if (match_e(IDENTIFIER)) {
      var index = getObjectIndex(previous_e().lexeme);
      if (objectList[index].type == STRING) {
        return objectList[index].value.slice(0, objectList[index].value.length);
      } else if (objectList[index].type == NUMBER) {
        return parseInt(objectList[index].value);
      }
    } else if (match_e(SIN)){
      var right = expressionAtom();
      var left = sin(right);
      return left;
    } else if (match_e(COS)){
      var right = expressionAtom();
      var left = cos(right);
      return left;
    } else if (match_e(TAN)){
      var right = expressionAtom();
      var left = tan(right);
      return left;
    } else if (match_e(SIN)){
      var right = expressionAtom();
      var left = sin(right);
      return left;
    } else if (match_e(RANDOM)){
      var right = expressionAtom();
      var left = random(right);
      console.log("OK");
      return left;
    }
  } catch (error) {
    errorList.push(new ThrowError(parsarLineNumber, "Parsar", error));
  }
}

//----------------------------------------------------------------------------------------------
//    Basic Operation Expressions
//----------------------------------------------------------------------------------------------

function add(left, right) {
  this.left = left;
  this.right = right;

  return left + right;
}

function subtract(left, right) {
  this.left = left;
  this.right = right;

  return left - right;
}

function divide(left, right) {
  this.left = left;
  this.right = right;

  return left / right;
}

function multiply(left, right) {
  this.left = left;
  this.right = right;

  return left * right;
}

//----------------------------------------------------------------------------------------------
//    Special Operation Expression
//----------------------------------------------------------------------------------------------

function mod(left, right) {
  this.left = left;
  this.right = right;

  return left % right;
}

function sin(value) {
  this.value = value;

  return Math.sin(value/180*Math.PI);
}

function cos(value) {
  this.value = value;

  return Math.cos(value/180*Math.PI);
}

function tan(value) {
  this.value = value;

  return Math.tan(value/180*Math.PI);
}

function random(max) {
  this.max = max;

  return Math.floor(Math.random() * max);
}
