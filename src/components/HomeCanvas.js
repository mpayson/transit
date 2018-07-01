import React, { Component } from 'react';

const dotMargin = 25;
const numRows = 5;
const numCols = 10;
// Set the colors you want to support in this array
const colors = ['#F03C69', '#FFCD32', '#2BAD5D', '#2ABABF', '#CDDC28', '#B91E8C'];
const directions = ['+', '-'];
const speeds = [0.5, 1, 1.5, 2, 2.5, 3, 3.5];
const radii = [2.5, 4.5, 6.5];

class Dot {
  x
  y

  constructor(x, y, radius=null){
    this.x = x;
    this.y = y;
    this.radius = radius ? radius : radii[Math.floor(Math.random()*radii.length)];
    this.color = colors[Math.floor(Math.random()*colors.length)];
  }

  draw(ctx){
    ctx.globalAlpha = 0.8;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}


class HomeCanvas extends Component {

  mouseOver
  mouseMoved
  dots = []
  context
  canvas

  constructor(props, context){
    super(props, context);
    this.drawDot = this.drawDot.bind(this);
    this.moveDot = this.moveDot.bind(this);
  }

  drawDot(dot) {
    // Set transparency on the dots.
    this.context.globalAlpha = 0.9;
    this.context.beginPath();
    this.context.arc(dot.x, dot.y, dot.radius, 0, 2 * Math.PI, false);
    this.context.fillStyle = dot.color;
    this.context.fill();
  }

  moveDot() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
    const dots = this.dots;
    
    for(let i = 0; i < dots.length; i++ ) {
  
      if( dots[i].xMove == '+' ) {
        dots[i].x += dots[i].speed;
      } else {
        dots[i].x -= dots[i].speed;
      }
      if( dots[i].yMove == '+' ) {
        dots[i].y += dots[i].speed;
      } else {
        dots[i].y -= dots[i].speed;
      }
  
      this.drawDot(dots[i])
  
      if( (dots[i].x + dots[i].radius) >= this.canvas.canvasWidth ) {
        dots[i].xMove = '-';
      }
      if( (dots[i].x - dots[i].radius) <= 0 ) {
        dots[i].xMove = '+';
      }
      if( (dots[i].y + dots[i].radius) >= this.canvas.canvasHeight ) {
        dots[i].yMove = '-';
      }
      if( (dots[i].y - dots[i].radius) <= 0 ) {
        dots[i].yMove = '+';
      }
    }
  
    window.requestAnimationFrame(this.moveDot);
  }
  

  componentDidMount() {

    this.canvas = this.refs.canvas;
    // this.canvas.width = window.innerWidth;
    // this.canvas.height = window.innerHeight;
    const canvasWidth = this.canvas.width;
    const canvasHeight = this.canvas.height;
    this.context = this.canvas.getContext("2d");

    if (window.devicePixelRatio) {
      var hidefCanvasWidth = this.canvas.width;
      var hidefCanvasHeight = this.canvas.height;
      var hidefCanvasCssWidth = hidefCanvasWidth;
      var hidefCanvasCssHeight = hidefCanvasHeight;

      this.canvas.width = hidefCanvasWidth * window.devicePixelRatio;
      this.canvas.height = hidefCanvasHeight * window.devicePixelRatio;
      this.canvas.style.width = hidefCanvasCssWidth;
      this.canvas.style.height = hidefCanvasCssHeight;
      this.context.scale(window.devicePixelRatio, window.devicePixelRatio);
  }


    var dotWidth = ((canvasWidth - (2 * dotMargin)) / numCols) - dotMargin;
    var dotHeight = ((canvasHeight - (2 * dotMargin)) / numRows) - dotMargin;
    
    if( dotWidth > dotHeight ) {
      var dotDiameter = dotHeight;
      var xMargin = (canvasWidth - ((2 * dotMargin) + (numCols * dotDiameter))) / numCols;
      var yMargin = dotMargin;
    } else {
      var dotDiameter = dotWidth;
      var xMargin = dotMargin;
      var yMargin = (canvasHeight - ((2 * dotMargin) + (numRows * dotDiameter))) / numRows;
    }
    
    console.log(dotWidth);

    var dotRadius = dotDiameter * 0.5;
    
    for(var i = 0; i < numRows; i++) {
      for(var j = 0; j < numCols; j++) {
        var x = (j * (dotDiameter + xMargin)) + dotMargin + (xMargin / 2) + dotRadius;
        var y = (i * (dotDiameter + yMargin)) + dotMargin + (yMargin / 2) + dotRadius;
        // Get random color, direction and speed.
        let dot = new Dot(x, y)
        // Set the object.

        // Save it to the dots array.
        this.dots.push(dot);
        dot.draw(this.context);
      }
    }
    
    // Draw each dot in the dots array.
    // for( i = 0; i < dots.length; i++ ) {
    //   this.drawDot(dots[i]);
    // };
    // setTimeout(() => {
    //   window.requestAnimationFrame(this.moveDot);
    // }, 2500);
  }

  render() {

    return(
      <canvas ref="canvas" id="c" style={{width: 500, height: 500}}/>
    )
  }
}

export default HomeCanvas

