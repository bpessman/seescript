exports.runSeeScript = function(src) {
  var tokenList

  var source

  var line

  var current

  var start

  var objectList // List of all the objects

  var shapeList // List of all the shapes

  var exprTokens // Tokens for a expression

  var exprCurrent // Current Token in the expression

  var timeoutT

  var svg = document.getElementById('canvas')
  var size = svg.getBoundingClientRect()

  var objects = {
    id: null,
    value: null,
    type: null,
  }

  function runProgram() {
    resetInformation()

    parse(run((source = src)))
  }

  function resetInformation() {
    // Removes all the elements from previous runs
    var canvas = document.getElementById('canvas')
    while (canvas.hasChildNodes()) {
      canvas.removeChild(canvas.lastChild)
    }

    // Global Lexer Variables
    line = 1
    current = 0
    start = 0
    tokenList = []

    // Global Parsar Variables
    objectList = []
    shapeList = []

    clearTimeout(timeoutT)
  }

  function Token(type, lexeme, line, literal) {
    this.type = type
    this.lexeme = lexeme
    this.line = line
    this.literal = literal
  }

  Token.prototype.getString = function() {
    return (
      '[TOKENTYPE]: ' +
      this.type +
      '\n[LEXEME]: ' +
      this.lexeme +
      '\n[LITERAL]: ' +
      this.literal +
      '\n[Line]: ' +
      this.line +
      '\n\n'
    )
  }

  //----------------------------------------------------------------------------------------------
  //    Single-Character Tokens
  //----------------------------------------------------------------------------------------------

  var LEFT_PAREN = 'LEFT_PAREN'
  var RIGHT_PAREN = 'RIGHT_PAREN'
  var RIGHT_BRACE = 'RIGHT_BRACE'
  var LEFT_BRACE = 'LEFT_BRACE'
  var COMMA = 'COMMA'
  var DOT = 'DOT'
  var MINUS = 'MINUS'
  var PLUS = 'PLUS'
  var SEMICOLON = 'SEMICOLON'
  var COLON = 'COLON'
  var SLASH = 'SLASH'
  var STAR = 'STAR'
  var ARROW = 'ARROW'
  var MOD = 'MOD'

  //----------------------------------------------------------------------------------------------
  //    One or Two Character Tokens
  //----------------------------------------------------------------------------------------------

  var NOT = 'NOT'
  var NOT_EQUAL = 'NOT_EQUAL'
  var EQUAL = 'EQUAL'
  var EQUAL_EQUAL = 'EQUAL_EQUAL'
  var GREATER = 'GREATER'
  var GREATER_EQUAL = 'GREATER_EQUAL'
  var LESS = 'LESS'
  var LESS_EQUAL = 'LESS_EQUAL'
  var PLUS_PLUS = 'PLUS_PLUS'
  var MINUS_MINUS = 'MINUS_MINUS'

  //----------------------------------------------------------------------------------------------
  //    Literal Tokens
  //----------------------------------------------------------------------------------------------

  var IDENTIFIER = 'IDENTIFIER'
  var STRING = 'STRING'
  var NUMBER = 'NUMBER'

  //----------------------------------------------------------------------------------------------
  //    Keywords
  //----------------------------------------------------------------------------------------------

  var AND = 'AND'
  var CLASS = 'CLASS'
  var ELSE = 'ELSE'
  var FALSE = 'FALSE'
  var FUNCTION = 'FUNCTION'
  var FOR = 'FOR'
  var IF = 'IF'
  var NULL = 'NULL'
  var OR = 'OR'
  var PRINT = 'PRINT'
  var RETURN = 'RETURN'
  var THIS = 'THIS'
  var TRUE = 'TRUE'
  var VAR = 'VAR'
  var WHILE = 'WHILE'
  var NEW = 'NEW'
  var SIN = 'SIN'
  var COS = 'COS'
  var TAN = 'TAN'
  var RANDOM = 'RANDOM'

  //----------------------------------------------------------------------------------------------
  //    SVG-Specific Keywords
  //----------------------------------------------------------------------------------------------

  var RECTANGLE = 'RECTANGLE'
  var CIRCLE = 'CIRCLE'
  var ELLIPSE = 'ELLIPSE'
  var LINE = 'LINE'
  var POLYGON = 'POLYGON'
  var POLYLINE = 'POLYLINE'
  var TEXT = 'TEXT'

  var ANIMATE = 'ANIMATE'

  //----------------------------------------------------------------------------------------------
  //    Built-In Functions
  //----------------------------------------------------------------------------------------------

  var FIXEDUPDATE = 'FIXEDUPDATE'

  //----------------------------------------------------------------------------------------------
  //    Mapped Keywords
  //----------------------------------------------------------------------------------------------

  var keywordsList = new Map()
  keywordsList.set('and', AND)
  keywordsList.set('class', CLASS)
  keywordsList.set('else', ELSE)
  keywordsList.set('false', FALSE)
  keywordsList.set('funct', FUNCTION)
  keywordsList.set('for', FOR)
  keywordsList.set('if', IF)
  keywordsList.set('null', NULL)
  keywordsList.set('or', OR)
  keywordsList.set('print', PRINT)
  keywordsList.set('return', RETURN)
  keywordsList.set('this', THIS)
  keywordsList.set('true', TRUE)
  keywordsList.set('var', VAR)
  keywordsList.set('while', WHILE)
  keywordsList.set('new', NEW)
  keywordsList.set('rect', RECTANGLE)
  keywordsList.set('circle', CIRCLE)
  keywordsList.set('ellipse', ELLIPSE)
  keywordsList.set('line', LINE)
  keywordsList.set('polygon', POLYGON)
  keywordsList.set('polyline', POLYLINE)
  keywordsList.set('text', TEXT)
  keywordsList.set('animate', ANIMATE)
  keywordsList.set('FixedUpdate', FIXEDUPDATE)
  keywordsList.set('sin', SIN)
  keywordsList.set('cos', COS)
  keywordsList.set('tan', TAN)
  keywordsList.set('rand', RANDOM)

  //----------------------------------------------------------------------------------------------
  //    Special
  //----------------------------------------------------------------------------------------------

  var EOF = 'EOF'

  function nextCharacter() {
    current++
    return source.charAt(current - 1)
  }

  function peek() {
    if (isAtEnd()) {
      return '\0'
    }
    return source.charAt(current)
  }

  function peekNext() {
    if (current + 1 >= source.length) {
      return '\0'
    }

    return source.charAt(current + 1)
  }

  function match(expectedChar) {
    if (isAtEnd()) {
      return false
    } else if (source.charAt(current) != expectedChar) {
      return false
    }

    current++
    return true
  }

  function isAlphaNumeric(c) {
    return isAlpha(c) || isDigit(c)
  }

  function isAlpha(c) {
    return (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || c == '_'
  }

  function isDigit(c) {
    return c >= '0' && c <= '9'
  }

  function addToken(type, literal) {
    var text = source.substring(start, current)
    tokenList.push(new Token(type, text, line, literal))
  }

  function isAtEnd() {
    return current >= source.length
  }

  function identifier() {
    while (isAlphaNumeric(peek())) {
      nextCharacter()
    }

    var type = IDENTIFIER
    var text = source.substring(start, current)

    if (keywordsList.get(text) != null) {
      type = keywordsList.get(text)
    }

    addToken(type, null)
  }

  function number() {
    while (isDigit(peek())) {
      nextCharacter()
    }

    if (peek() == '.' && isDigit(peekNext())) {
      nextCharacter()

      while (isDigit(peek())) {
        nextCharacter()
      }
    }

    addToken(NUMBER, parseFloat(source.substring(start, current)))
  }

  function string() {
    while (peek() != '"' && !isAtEnd()) {
      if (peek() == '\n') {
        line++
      }

      nextCharacter()
    }
    if (current >= source.length) {
      return
    }
    nextCharacter()
    var value = source.substring(start + 1, current - 1)

    addToken(STRING, value)
  }

  /*============================================================================================
        Lexer
  *============================================================================================*/

  function run(source) {
    this.source = source

    while (!isAtEnd()) {
      start = current
      scanToken()
    }

    tokenList.push(new Token(EOF, '', line, null))

    return tokenList
  }

  //----------------------------------------------------------------------------------------------
  //    Scanning the Tokens
  //----------------------------------------------------------------------------------------------

  function scanToken() {
    var c = nextCharacter()
    switch (c) {
      case '(':
        addToken(LEFT_PAREN, null)
        break
      case ')':
        addToken(RIGHT_PAREN, null)
        break
      case '{':
        addToken(LEFT_BRACE, null)
        break
      case '}':
        addToken(RIGHT_BRACE, null)
        break
      case ',':
        addToken(COMMA, null)
        break
      case '.':
        addToken(DOT, null)
        break
      case '-':
        addToken(match('-') ? MINUS_MINUS : MINUS, null)
        break
      case '+':
        addToken(match('+') ? PLUS_PLUS : PLUS, null)
        break
      case '%':
        addToken(MOD, null)
        break
      case ';':
        addToken(SEMICOLON, null)
        break
      case ':':
        addToken(COLON, null)
        break
      case '/':
        if (match('/')) {
          while (peek() != '\n' && !isAtEnd()) nextCharacter()
        } else {
          addToken(SLASH, null)
        }
        break
      case '*':
        addToken(STAR, null)
        break
      case '!':
        addToken(match('=') ? NOT_EQUAL : NOT, null)
        break
      case '=':
        addToken(match('=') ? EQUAL_EQUAL : EQUAL, null)
        break
      case '<':
        if (match('<')) {
          addToken(ARROW, null)
        } else {
          addToken(match('=') ? LESS_EQUAL : LESS, null)
        }
        break
      case '>':
        addToken(match('=') ? GREATER_EQUAL : GREATER, null)
        break
      case ' ':
        break
      case '\r':
        break
      case '\t':
        break
      case '\n':
        line++
        break
      case '"':
        string()
        break

      default:
        if (isDigit(c)) {
          number()
        } else if (isAlpha) {
          identifier()
        } else {
          //Error
        }
    }
  }

  //----------------------------------------------------------------------------------------------
  //    'Object' Helper Methods
  //----------------------------------------------------------------------------------------------

  function isAnObject(id) {
    for (var object in objectList) {
      if (objectList[object].id == id) {
        return true
      }
    }
    return false
  }

  function getObjectIndex(id) {
    var index = 0
    for (var object in objectList) {
      if (objectList[object].id == id) {
        return index
      }
      index++
    }
    return -1
  }

  function createAnObject(id, value, type) {
    var object = Object.create(objects)
    object.id = id
    object.value = value
    object.type = type
    return object
  }

  //----------------------------------------------------------------------------------------------
  //    'Other' Helper Methods
  //----------------------------------------------------------------------------------------------

  function checkToken(typeOfToken, index, tokens) {
    if (tokens[index].type == typeOfToken) {
      return true
    }
    return false
  }

  function consume(tokens) {
    return tokens.slice(1, tokens.length)
  }

  function has(statement, type) {
    for (var i = 0; i < statement.length; i++) {
      if (statement[i].type == type) {
        return true
      }
    }
    return false
  }

  function findExpressionWithOperator(left, operator, right) {
    if (operator == PLUS) {
      return add(left, right)
    } else if (operator == MINUS) {
      return subtract(left, right)
    } else if (operator == STAR) {
      return multiply(left, right)
    } else if (operator == SLASH) {
      return divide(left, right)
    } else if (operator == MOD) {
      return mod(left, right)
    }
  }

  /*============================================================================================
        Parser
  *============================================================================================*/

  function parse(tokens) {
    var currentToken = 0
    var statementList = []
    //----------------------------------------------------------------------------------------------
    //    Splits Tokens into Statements
    //----------------------------------------------------------------------------------------------
    while (!checkToken(EOF, currentToken, tokens)) {
      var statement = []

      var i = 0
      if (checkToken(FUNCTION, currentToken, tokens)) {
        while (!checkToken(RIGHT_BRACE, currentToken, tokens)) {
          statement[i] = tokens[currentToken]
          currentToken++
          i++
        }
      } else if (checkToken(FOR, currentToken, tokens)) {
        while (!checkToken(RIGHT_BRACE, currentToken, tokens)) {
          statement[i] = tokens[currentToken]
          currentToken++
          i++
        }
      } else {
        while (!checkToken(SEMICOLON, currentToken, tokens)) {
          statement[i] = tokens[currentToken]
          currentToken++
          i++
        }
      }

      statementList.push(statements(statement))
      currentToken++
    }

    for (i = 0; i < statementList.length; i++) {
      statementList[i].evaluate()
    }
  }

  function statements(statement) {
    //----------------------------------------------------------------------------------------------
    //    Animation Statement
    //----------------------------------------------------------------------------------------------

    if (has(statement, FUNCTION) && has(statement, ANIMATE)) {
      var delay = statement[3].literal
      var iterations = statement[5].literal
      var loopTokens = statement.slice(8, statement.length)

      return new statementAnimate(delay, iterations, loopTokens)
    }

    //----------------------------------------------------------------------------------------------
    //    Plus Unary Statemenet
    //----------------------------------------------------------------------------------------------
    else if (has(statement, PLUS_PLUS) && has(statement, IDENTIFIER)) {
      var id = statement[0].lexeme
      var operator = statement[1].type

      return new statementUnaryOperator(id, operator)
    }

    //----------------------------------------------------------------------------------------------
    //    Minus Unary Statemenet
    //----------------------------------------------------------------------------------------------
    else if (has(statement, MINUS_MINUS) && has(statement, IDENTIFIER)) {
      var id = statement[0].lexeme
      var operator = statement[1].type

      return new statementUnaryOperator(id, operator)
    }

    //----------------------------------------------------------------------------------------------
    //    For Loop Statement
    //----------------------------------------------------------------------------------------------
    else if (has(statement, FOR)) {
      if (has(statement, LEFT_BRACE)) {
        var count = statement[2].literal
        var loopTokens = statement.slice(5, statement.length + 1)

        return new statementForLoop(count, loopTokens)
      } else {
        // Error
      }
    }

    //----------------------------------------------------------------------------------------------
    //    Object Creation Statement
    //----------------------------------------------------------------------------------------------
    else if (
      has(statement, VAR) &&
      has(statement, EQUAL) &&
      !has(statement, RECTANGLE) &&
      !has(statement, CIRCLE) &&
      !has(statement, LINE) &&
      !has(statement, TEXT) &&
      !has(statement, DOT)
    ) {
      var id = statement[1].lexeme
      var value = new expression(statement.slice(3, statement.length))
      //var type = statement[3].type;
      var type = NUMBER

      return new statementObjectCreation(id, value, type)
    }

    //----------------------------------------------------------------------------------------------
    //    Object Set Statement
    //----------------------------------------------------------------------------------------------
    else if (
      has(statement, IDENTIFIER) &&
      has(statement, EQUAL) &&
      !has(statement, RECTANGLE) &&
      !has(statement, CIRCLE) &&
      !has(statement, LINE) &&
      !has(statement, TEXT) &&
      !has(statement, DOT)
    ) {
      var id = statement[0].lexeme
      var value = new expression(statement.slice(2, statement.length))
      //var type = statement[2].type;
      var type = NUMBER

      return new statementSetObjectValue(id, value, type)
    }

    //----------------------------------------------------------------------------------------------
    //    Print Statement
    //----------------------------------------------------------------------------------------------
    else if (
      has(statement, PRINT) &&
      (has(statement, IDENTIFIER) ||
        has(statement, STRING) ||
        has(statement, NUMBER))
    ) {
      var value = new expression(statement.slice(1, statement.length))

      return new statementPrint(value)
    }

    //----------------------------------------------------------------------------------------------
    //    Rectangle Statement
    //----------------------------------------------------------------------------------------------
    else if (
      has(statement, VAR) &&
      has(statement, IDENTIFIER) &&
      has(statement, RECTANGLE) &&
      has(statement, EQUAL)
    ) {
      var id = statement[1].lexeme
      var type = statement[3].type
      var x = new expression(statement.slice(5, 6))
      var y = new expression(statement.slice(7, 8))
      var width = new expression(statement.slice(9, 10))
      var height = new expression(statement.slice(11, 12))
      var red = new expression(statement.slice(13, 14))
      var green = new expression(statement.slice(15, 16))
      var blue = new expression(statement.slice(17, 18))

      return new statementRectangle(
        id,
        type,
        x,
        y,
        width,
        height,
        red,
        green,
        blue
      )
    }

    //----------------------------------------------------------------------------------------------
    //    Circle Statement
    //----------------------------------------------------------------------------------------------
    else if (
      has(statement, VAR) &&
      has(statement, IDENTIFIER) &&
      has(statement, CIRCLE) &&
      has(statement, EQUAL)
    ) {
      var id = statement[1].lexeme
      var type = statement[3].type
      var cx = new expression(statement.slice(5, 6))
      var cy = new expression(statement.slice(7, 8))
      var radius = new expression(statement.slice(9, 10))
      var red = new expression(statement.slice(11, 12))
      var green = new expression(statement.slice(13, 14))
      var blue = new expression(statement.slice(15, 16))

      return new statementCircle(id, type, cx, cy, radius, red, green, blue)
    }

    //----------------------------------------------------------------------------------------------
    //    Line Statement
    //----------------------------------------------------------------------------------------------
    else if (
      has(statement, VAR) &&
      has(statement, IDENTIFIER) &&
      has(statement, LINE) &&
      has(statement, EQUAL)
    ) {
      var id = statement[1].lexeme
      var type = statement[3].type
      var x1 = new expression(statement.slice(5, 6))
      var y1 = new expression(statement.slice(7, 8))
      var x2 = new expression(statement.slice(9, 10))
      var y2 = new expression(statement.slice(11, 12))
      var red = new expression(statement.slice(13, 14))
      var green = new expression(statement.slice(15, 16))
      var blue = new expression(statement.slice(17, 18))
      var strokeWidth = new expression(statement.slice(19, 20))

      return new statementLine(
        id,
        type,
        x1,
        y1,
        x2,
        y2,
        red,
        green,
        blue,
        strokeWidth
      )
    }

    //----------------------------------------------------------------------------------------------
    //    Text Statement
    //----------------------------------------------------------------------------------------------
    else if (
      has(statement, VAR) &&
      has(statement, IDENTIFIER) &&
      has(statement, TEXT) &&
      has(statement, EQUAL)
    ) {
      var id = statement[1].lexeme
      var type = statement[3].type
      var x = new expression(statement.slice(5, 6))
      var y = new expression(statement.slice(7, 8))
      var text = new expression(statement.slice(9, 10))
      var red = new expression(statement.slice(11, 12))
      var green = new expression(statement.slice(13, 14))
      var blue = new expression(statement.slice(15, 16))

      return new statementText(id, type, x, y, text, red, green, blue)
    }
    //----------------------------------------------------------------------------------------------
    //    Attribute Statement
    //----------------------------------------------------------------------------------------------
    else if (
      has(statement, IDENTIFIER) &&
      has(statement, DOT) &&
      has(statement, EQUAL)
    ) {
      var id = statement[0].lexeme
      var edit = statement[2].lexeme
      var value = new expression(statement.slice(4, statement.length))

      return new statementAttribute(id, edit, value)
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
      // Error
    }

    /*============================================================================================
        Abstract Syntax Tree
    *============================================================================================*/

    //----------------------------------------------------------------------------------------------
    //    Expression Calls
    //----------------------------------------------------------------------------------------------

    function expression(tokens) {
      this.tokens = tokens

      this.evaluate = function() {
        return expr(tokens)
      }
    }
  }

  //----------------------------------------------------------------------------------------------
  //    Unary Operator Statement
  //----------------------------------------------------------------------------------------------

  function statementUnaryOperator(id, operator) {
    this.id = id
    this.operator = operator
  }

  statementUnaryOperator.prototype.evaluate = function() {
    var operator = this.operator
    var id = this.id

    var createdTokens = []
    if (operator == PLUS_PLUS) {
      createdTokens.push(new Token(IDENTIFIER, id, null, null))
      createdTokens.push(new Token(PLUS, '+', null, null))
      createdTokens.push(new Token(NUMBER, 1, null, 1))
    } else {
      createdTokens.push(new Token(IDENTIFIER, id, null, null))
      createdTokens.push(new Token(MINUS, '-', null, null))
      createdTokens.push(new Token(NUMBER, 1, null, 1))
    }

    var value = expr(createdTokens)

    if (isAnObject(id)) {
      objectList.splice(
        getObjectIndex(id),
        1,
        createAnObject(id, value, NUMBER)
      )
    } else {
      // Error
    }
  }

  //----------------------------------------------------------------------------------------------
  //    Animation Statement
  //----------------------------------------------------------------------------------------------

  function statementAnimate(delayer, iterations, loopTokens) {
    this.delayer = delayer
    this.iterations = iterations
    this.loopTokens = loopTokens
  }

  statementAnimate.prototype.evaluate = function() {
    var delayer = this.delayer
    var iterations = this.iterations
    var loopTokens = this.loopTokens

    var counter = 0
    timeoutT = window.setTimeout(animate, delayer)

    function animate() {
      var currentToken = 0
      while (currentToken < loopTokens.length) {
        var statement = []
        var i = 0
        while (
          !checkToken(SEMICOLON, currentToken, loopTokens) ||
          loopTokens.length == 0
        ) {
          statement[i] = loopTokens[currentToken]
          currentToken++
          i++
        }
        statements(statement).evaluate()
        currentToken++
      }

      if (counter < iterations - 1) {
        counter++
        timeoutT = window.setTimeout(animate, delayer)
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
    this.count = count
    this.loopTokens = loopTokens
  }

  statementForLoop.prototype.evaluate = function() {
    var count = this.count
    var loopTokens = this.loopTokens

    for (var c = 0; c < count; c++) {
      var currentToken = 0
      while (currentToken < loopTokens.length) {
        var statement = []

        var i = 0
        while (!checkToken(SEMICOLON, currentToken, loopTokens)) {
          statement[i] = loopTokens[currentToken]
          currentToken++
          i++
        }

        currentToken++
        statements(statement).evaluate()
      }
    }
  }

  //----------------------------------------------------------------------------------------------
  //    Object Creation Statement
  //----------------------------------------------------------------------------------------------

  function statementObjectCreation(id, value, type) {
    this.id = id
    this.value = value
    this.type = type
  }

  statementObjectCreation.prototype.evaluate = function() {
    var id = this.id
    var value = this.value
    var type = this.type

    value = value.evaluate()
    if (type == RANDOM) {
      type = NUMBER
    }

    if (!isAnObject(id)) {
      if (isAnObject(value)) {
        objectList.push(
          createAnObject(id, objectList[getObjectIndex(value)].value, type)
        )
      } else {
        objectList.push(createAnObject(id, value, type))
      }
    } else {
      // Error
    }
  }

  //----------------------------------------------------------------------------------------------
  //    Object Set Statement
  //----------------------------------------------------------------------------------------------

  function statementSetObjectValue(id, value, type) {
    this.id = id
    this.value = value
    this.type = type
  }

  statementSetObjectValue.prototype.evaluate = function() {
    var id = this.id
    var value = this.value
    var type = this.type
    value = value.evaluate()
    if (type == RANDOM) {
      type = NUMBER
    }

    if (isAnObject(id)) {
      objectList.splice(getObjectIndex(id), 1, createAnObject(id, value, type))
    } else {
      // Error
    }
  }

  //----------------------------------------------------------------------------------------------
  //    Print Statement
  //----------------------------------------------------------------------------------------------

  function statementPrint(value) {
    this.value = value
  }

  statementPrint.prototype.evaluate = function() {
    var value = this.value

    value = value.evaluate()

    console.log(value + '\n')
  }

  //----------------------------------------------------------------------------------------------
  //    Rectangle Statement
  //----------------------------------------------------------------------------------------------

  function statementRectangle(id, type, x, y, width, height, red, green, blue) {
    this.id = id
    this.type = type
    this.x = x
    this.y = y
    this.width = width
    this.height = height
    this.red = red
    this.green = green
    this.blue = blue
  }

  statementRectangle.prototype.evaluate = function() {
    var id = this.id
    var type = this.type
    var x = this.x.evaluate()
    var y = this.y.evaluate()
    var width = this.width.evaluate()
    var height = this.height.evaluate()
    var red = this.red.evaluate()
    var green = this.green.evaluate()
    var blue = this.blue.evaluate()

    var rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
    shapeList.push(id)
    rect.setAttribute('id', id)
    rect.setAttribute('x', x + size.width / 2 - width / 2)
    rect.setAttribute('y', y + size.height / 2 - height / 2)
    rect.setAttribute('width', width)
    rect.setAttribute('height', height)
    rect.setAttribute('fill', 'rgb(' + red + ',' + green + ',' + blue + ')')

    document.getElementById('canvas').appendChild(rect)
  }

  //----------------------------------------------------------------------------------------------
  //    Circle Statement
  //----------------------------------------------------------------------------------------------

  function statementCircle(id, type, cx, cy, radius, red, green, blue) {
    this.id = id
    this.type = type
    this.cx = cx
    this.cy = cy
    this.radius = radius
    this.red = red
    this.green = green
    this.blue = blue
  }

  statementCircle.prototype.evaluate = function() {
    var id = this.id
    var type = this.type
    var cx = this.cx.evaluate()
    var cy = this.cy.evaluate()
    var radius = this.radius.evaluate()
    var red = this.red.evaluate()
    var green = this.green.evaluate()
    var blue = this.blue.evaluate()

    var circle = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'circle'
    )
    shapeList.push(id)
    circle.setAttribute('id', id)
    circle.setAttribute('cx', cx + size.width / 2 - radius / 2)
    circle.setAttribute('cy', cy + size.height / 2 - radius / 2)
    circle.setAttribute('r', radius)
    circle.setAttribute('fill', 'rgb(' + red + ',' + green + ',' + blue + ')')
    document.getElementById('canvas').appendChild(circle)
  }

  //----------------------------------------------------------------------------------------------
  //    Ellipse Statement
  //----------------------------------------------------------------------------------------------

  //----------------------------------------------------------------------------------------------
  //    Line Statement
  //----------------------------------------------------------------------------------------------

  function statementLine(
    id,
    type,
    x1,
    y1,
    x2,
    y2,
    red,
    green,
    blue,
    strokeWidth
  ) {
    this.id = id
    this.type = type
    this.x1 = x1
    this.y1 = y1
    this.x2 = x2
    this.y2 = y2
    this.red = red
    this.green = green
    this.blue = blue
    this.strokeWidth = strokeWidth
  }

  statementLine.prototype.evaluate = function() {
    var id = this.id
    var type = this.type
    var x1 = this.x1.evaluate()
    var y1 = this.y1.evaluate()
    var x2 = this.x2.evaluate()
    var y2 = this.y2.evaluate()
    var red = this.red.evaluate()
    var green = this.green.evaluate()
    var blue = this.blue.evaluate()
    var strokeWidth = this.strokeWidth.evaluate()

    var line = document.createElementNS('http://www.w3.org/2000/svg', 'line')
    shapeList.push(id)
    line.setAttribute('id', id)
    line.setAttribute('x1', x1 + size.width / 2 - (x2 - x1) / 2)
    line.setAttribute('y1', y1 + size.height / 2 - (y2 - y1) / 2)
    line.setAttribute('x2', x2 + size.width / 2 - (x2 - x1) / 2)
    line.setAttribute('y2', y2 + size.height / 2 - (y2 - y1) / 2)
    line.setAttribute(
      'style',
      'stroke:rgb(' +
        red +
        ',' +
        green +
        ',' +
        blue +
        ');stroke-width:' +
        strokeWidth
    )
    document.getElementById('canvas').appendChild(line)
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
    this.id = id
    this.type = type
    this.x = x
    this.y = y
    this.text = text
    this.red = red
    this.green = green
    this.blue = blue
  }

  statementText.prototype.evaluate = function() {
    var id = this.id
    var type = this.type
    var x = this.x.evaluate()
    var y = this.y.evaluate()
    var text = this.text.evaluate()
    var red = this.red.evaluate()
    var green = this.green.evaluate()
    var blue = this.blue.evaluate()

    var textElement = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'text'
    )
    shapeList.push(id)
    textElement.setAttribute('id', id)
    textElement.setAttribute('x', x + size.width / 2 - width / 2)
    textElement.setAttribute('y', y + size.height / 2 - height / 2)
    textElement.setAttribute(
      'fill',
      'rgb(' + red + ',' + green + ',' + blue + ')'
    )
    textElement.innerHTML = text
    document.getElementById('canvas').appendChild(textElement)
  }

  //----------------------------------------------------------------------------------------------
  //    Attribute Statement
  //----------------------------------------------------------------------------------------------

  function statementAttribute(id, edit, value) {
    this.id = id
    this.edit = edit
    this.value = value
  }

  statementAttribute.prototype.evaluate = function() {
    var value = this.value
    var edit = this.edit
    var id = this.id

    value = value.evaluate()

    var object = document.getElementById(id).setAttribute(edit, value)
  }

  //----------------------------------------------------------------------------------------------
  //    Trigonometric Statement
  //----------------------------------------------------------------------------------------------

  function statementTrigonometric(id, type, value) {
    this.id = id
    this.type = type
    this.value = value
  }

  statementTrigonometric.prototype.evaluate = function() {
    var id = this.id
    var type = this.type
    var value = this.value
  }

  //----------------------------------------------------------------------------------------------
  //    'Expr' Helper Methods
  //----------------------------------------------------------------------------------------------

  function expr(tokens) {
    exprTokens = tokens
    exprCurrent = 0

    return expressionAddition()
  }

  function previous_e() {
    return exprTokens[exprCurrent - 1]
  }

  function peek_e() {
    return exprTokens[exprCurrent]
  }

  function advance_e() {
    exprCurrent++
    return previous_e()
  }

  function check_e(type) {
    try {
      return peek_e().type === type
    } catch (error) {
      return false
    }
  }

  function match_e() {
    for (var i = 0; i < arguments.length; i++) {
      if (check_e(arguments[i])) {
        advance_e()
        return true
      }
    }

    return false
  }

  //----------------------------------------------------------------------------------------------
  //    Order of Operations Recursion
  //----------------------------------------------------------------------------------------------

  function expressionAddition() {
    var left = expressionMultiplication()

    while (match_e(MINUS, PLUS, MOD)) {
      var operator = previous_e().type
      var right = expressionMultiplication()
      left = findExpressionWithOperator(left, operator, right)
    }

    return left
  }

  function expressionMultiplication() {
    var left = expressionAtom()

    while (match_e(STAR, SLASH)) {
      var operator = previous_e().type
      var right = expressionAtom()
      left = findExpressionWithOperator(left, operator, right)
    }

    return left
  }

  function expressionAtom() {
    try {
      if (match_e(NUMBER, STRING)) {
        return previous_e().literal
      } else if (match_e(IDENTIFIER)) {
        var index = getObjectIndex(previous_e().lexeme)
        if (objectList[index].type === STRING) {
          return objectList[index].value.slice(
            0,
            objectList[index].value.length
          )
        } else if (objectList[index].type === NUMBER) {
          return parseInt(objectList[index].value)
        }
      } else if (match_e(SIN)) {
        var right = expressionAtom()
        var left = sin(right)
        return left
      } else if (match_e(COS)) {
        var right = expressionAtom()
        var left = cos(right)
        return left
      } else if (match_e(TAN)) {
        var right = expressionAtom()
        var left = tan(right)
        return left
      } else if (match_e(SIN)) {
        var right = expressionAtom()
        var left = sin(right)
        return left
      } else if (match_e(RANDOM)) {
        var right = expressionAtom()
        var left = random(right)
        console.log('OK')
        return left
      }
    } catch (error) {
      // Error
    }
  }

  //----------------------------------------------------------------------------------------------
  //    Basic Operation Expressions
  //----------------------------------------------------------------------------------------------

  function add(left, right) {
    this.left = left
    this.right = right

    return left + right
  }

  function subtract(left, right) {
    this.left = left
    this.right = right

    return left - right
  }

  function divide(left, right) {
    this.left = left
    this.right = right

    return left / right
  }

  function multiply(left, right) {
    this.left = left
    this.right = right

    return left * right
  }

  //----------------------------------------------------------------------------------------------
  //    Special Operation Expression
  //----------------------------------------------------------------------------------------------

  function mod(left, right) {
    this.left = left
    this.right = right

    return left % right
  }

  function sin(value) {
    this.value = value

    return Math.sin((value / 180) * Math.PI)
  }

  function cos(value) {
    this.value = value

    return Math.cos((value / 180) * Math.PI)
  }

  function tan(value) {
    this.value = value

    return Math.tan((value / 180) * Math.PI)
  }

  function random(max) {
    this.max = max

    return Math.floor(Math.random() * max)
  }

  runProgram()
}
