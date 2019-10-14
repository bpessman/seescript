# SeeScript

A Package for a Programming Language &amp; Interpreter for SVG Animations

## Installation

```
> npm install seescript --save
```

## Getting Started

You must include a SVG element with the ID of canvas

```html
<svg id="canvas"></svg>
```

The JavaScript Code

```javascript
const seeScript = require('seescript')

seeScript.runSeeScript('var box = rectangle (0,0,500,500,255,0,0);')
```

## Language Documentation

### Variables

`set x as 10`

### Drawing

```set x as rectangle:
center 0,0
width 100
heigth 100

draw x
```

### Example

```
set x as rectangle:
    center 0,0
    width 100
    heigth 100

draw x

update x:
    center 0,20
```
