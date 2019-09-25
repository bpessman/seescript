//----------------------------------------------------------------------------------------------
//    'Object' Helper Methods
//----------------------------------------------------------------------------------------------

function isAnObject(id) {
  for(var object in objectList) {
    if (objectList[object].id == id) {
      return true;
    }
  }
  return false;
}

function getObjectIndex(id) {
  index = 0;
  for (var object in objectList) {
    if (objectList[object].id == id) {
      return index;
    }
    index++;
  }
  return -1;
}

function createAnObject(id, value, type) {
  var object = Object.create(objects);
  object.id = id;
  object.value = value;
  object.type = type;
  return object;
}

//----------------------------------------------------------------------------------------------
//    'Other' Helper Methods
//----------------------------------------------------------------------------------------------

function checkToken(typeOfToken, index, tokens) {
  if (tokens[index].type == typeOfToken) {
    return true;
  }
  return false;
}

function consume(tokens) {
  return tokens.slice(1, tokens.length);
}

function has(statement, type) {
  for (i = 0; i < statement.length; i++) {
    if (statement[i].type == type) {
      return true;
    }
  }
  return false;
}

function findExpressionWithOperator(left, operator, right) {
  if(operator == PLUS) {
    return add(left,right);
  } else if (operator == MINUS) {
    return subtract(left,right);
  } else if (operator == STAR) {
    return multiply(left,right);
  } else if (operator == SLASH) {
    return divide(left,right);
  } else if (operator == MOD) {
    return mod(left,right);
  }
}
