const numDots = 50;
// Set the colors you want to support in this array
const colors = ['#46B482', '#5E4C80', '#955DFB', '#5AB8E8'];
const speeds = [0.5, 1, 1.5, 2, 2.5, 3, 3.5];
const radii = [1.5, 2.5, 3.5];

class Dot {
  x
  y
  ox
  oy

  constructor(width, height, radius=null){
    this.draw = this.draw.bind(this);
    this.move = this.move.bind(this);


    this.x = width - (Math.pow(Math.random(), 5) * width);
    this.y = Math.pow(Math.random(), 3) * height;
    this.radius = radius ? radius : radii[Math.floor(Math.random()*radii.length)];
    this.color = colors[Math.floor(Math.random()*colors.length)];
  }

  move(width, height, ctx){
    const step = 0.5;
    if(this.x < 0 || this.y < 0){
      this.x = width - (Math.pow(Math.random(), 5) * width);
      this.y = height - (Math.pow(Math.random(), 3) * height);
    } else {
      this.x = this.x - step;
      this.y = this.y - step;
    }
    this.draw(ctx);

  }

  draw(ctx){

    ctx.globalAlpha = 0.8;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = this.color;
    ctx.closePath();
    ctx.fill();
  }
}


class HomeCanvas {

  timeout
  animation
  dots = []
  context
  canvas
  isIn

  constructor(canvas){
    const dpr = window.devicePixelRatio;
    this.canvas = canvas;

    const canvasWidth = this.canvas.clientWidth;
    const canvasHeight = this.canvas.clientHeight;
    this.canvas.width = dpr * canvasWidth;
    this.canvas.height = dpr * canvasHeight;
    this.canvas.style.width = canvasWidth+'px';
    this.canvas.style.height = canvasHeight+'px';

    this.context = this.canvas.getContext("2d");
    this.context.scale(dpr, dpr);

    for(let i = 0; i < numDots; i++){
      let dot = new Dot(canvasWidth, canvasHeight);
      this.dots.push(dot);
      dot.draw(this.context);
    }
    this.animate = this.animate.bind(this);
    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
  }
  
  animate(){
    if(!this.isIn){
      return;
    }
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    for(let i = 0; i < numDots; i ++){
      const dot = this.dots[i];
      dot.move(this.canvas.clientWidth, this.canvas.clientHeight, this.context);
    }

    this.animation = window.requestAnimationFrame( () => {
      this.timeout = window.setTimeout(this.animate, 5)
    });
  }

  onMouseEnter(){
    this.isIn = true;
    this.animate();
  }
  onMouseLeave(){
    this.isIn = false;
  }

  unmount(){
    window.clearTimeout(this.timeout);
    window.cancelAnimationFrame(this.animation);
  }

}

export default HomeCanvas

