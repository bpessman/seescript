## Documentation
Here you will find some basic documentation on how to use this programming language.

#### Drawing Simple Shapes
```
var rectangleExample = rectangle (x, y, width, height, red, green, blue);
var circleExample = circle (cx, cy, radius, red, green, blue);
var lineExample = line (x1, y1, x2, y2, red, green, blue, stroke-width);
```

#### Animation
In order to animate within Crater, you must used whats called a FixedUpdate function. This will allow you to animate on a fixed interval for set amount of iterations.
```
function FixedUpdate(delay, iterations) {
  // Statements
}
```
It will basically loop the FixedUpdate function every "delay" (which is in ms) for however many iterations.

#### Variables
All variable types are stored as "vars". The interpreter will decide what it is.
```
var string = "Hello, World!" // Example of a String
var number = 1234 // Example of a Number
```
Also note that shapes are stored in variables as well. Look at "Drawing Simple Shapes" for examples.

#### Loops
The only loop implemented so far is the for loop. I do plan on implementing a while loop.
```
for (iterations) {
  // Statements
}
```

#### Examples from the language
Example 1: Robot Man (No Animation)
```
var r = rectangle (0,0,600,450,255,255,255);

var shade = 25.50;
var color = 7 * shade;
print "Color: " + color;

var c1 = circle (375,175,60,color,0,0);
var c2 = circle (225,175,60,color,0,0);
var c3 = circle (300,275,60,0,0,color);
var cBlack = circle (300,200,75,0,0,0);
var cWhite = circle (300,200,50,255,255,255);


var cLeft = circle (150,175,60,0,0,0);
var cRight = circle (450,175,60,0,0,0);
var cBottom = circle (300,350,60,0,0,0);

var head = circle (300,100,60,0,0,0);
var leftEye = circle (275,100,10,255,255,255);
var rightEye = circle (325,100,10,255,255,255);
var mouth = rectangle (275,115,50,20,255,255,255);
```
