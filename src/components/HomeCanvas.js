const numDots = 100;
// Set the colors you want to support in this array
const colors = ['rgba(70,180,130, 0.5)', 'rgba(94,76,128, 0.5)', 'rgb(149,93,251,0.5)', 'rgba(90,184,232,0.5)'];
const radii = [1.5, 2.5, 3.5];
const mouseRadius = 150;

class Dot {
  x
  y
  ox
  oy

  constructor(width, height, radius=null){
    this.draw = this.draw.bind(this);
    this.connect = this.connect.bind(this);

    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.radius = radius ? radius : radii[Math.floor(Math.random()*radii.length)];
    this.color = colors[Math.floor(Math.random()*colors.length)];
  }

  connect(ctx, toPt){
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(toPt.x, toPt.y);
    ctx.strokeStyle = 'rgba(255,255,255,0.3)'
    ctx.stroke();
  }

  draw(ctx){
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = this.color;
    ctx.closePath();
    ctx.fill();
  }

  drawConnect(ctx, toPt){
    this.connect(ctx, toPt);
    this.draw(ctx);
  }
}


class HomeCanvas {

  timeout
  animation
  dots = []
  context
  canvas
  isIn

  constructor(canvas, xOffset=0, yOffset=150){
    const dpr = window.devicePixelRatio;
    this.canvas = canvas;
    this.xOffset = xOffset;
    this.yOffset = yOffset;

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

  }

  onMouseMove(e){
    const x = e.clientX;
    const t = this.canvas.getBoundingClientRect()
    const y = e.clientY - t.y;
  
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for(let i = 0; i < this.dots.length; i++){
      const dot = this.dots[i];
      const dist = Math.sqrt(Math.pow(x-dot.x,2) + Math.pow(y-dot.y,2))
      if(dist < mouseRadius){
        dot.drawConnect(this.context, {x: x, y: y});
      } else {
        dot.draw(this.context);
      }
    }
  }


  unmount(){
    window.clearTimeout(this.timeout);
    window.cancelAnimationFrame(this.animation);
  }

}

export default HomeCanvas

