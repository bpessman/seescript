var errorList = [];

function ThrowError(line, location, message) {
  this.line = line;
  this.message = message;
  this.location = location;
}

ThrowError.prototype.getString = function() {
  return "[Line: " + this.line + "]\n[Location: " + this.location +  "]\n ->" + " " + this.message + "\n\n";
}
