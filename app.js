const container_element=document.getElementById("canvas-container");

window.addEventListener('load', function() {
    const canvas = document.getElementById('mycanvas');
    const ctx = canvas.getContext('2d', {
        willReadFrequently: true
    });
    const canvasContainer = document.getElementById('canvas-container');

    function resizeCanvas() {
        canvas.width = canvasContainer.clientWidth; // Set canvas width to the width of the container
        canvas.height = canvasContainer.clientHeight; // Set canvas height to the height of the container
    }

    resizeCanvas();

    let effect = new Effect(ctx, canvas.width, canvas.height);
    effect.wrapText("Hi, I’m Adarsh. Nice to meet you.");

    function drawCopyright() {
        const copyrightText = '© 2023 adarshraj';
        const textWidth = ctx.measureText(copyrightText).width;
        const textHeight = 20;
        const x = (canvas.width - textWidth) / 2;
        const y = canvas.height - textHeight - 10;

        ctx.fillStyle = 'white';
        ctx.font = '14px Arial';
        ctx.fillText(copyrightText, x, y);
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        effect.render();
        
        requestAnimationFrame(animate);
    }
    animate();

    window.addEventListener('resize', function() {
        resizeCanvas();
        effect = new Effect(ctx, canvas.width, canvas.height);
        effect.wrapText("Hi, I’m Adarsh. Nice to meet you.");
        console.log('resize');
    });
});



class Particle {
    constructor(effect, x, y, color) {
        this.effect = effect;
        this.x = Math.random() * this.effect.canvasWidth;
        this.y = Math.random() * this.effect.canvasHeight; // Randomize y position
        this.originX = x;
        this.originY = y;
        this.size = this.effect.gap;
        this.color = color;
        this.dx = 0;
        this.dy = 0;
        this.vx = 0;
        this.vy = 0;
        this.force = 0;
        this.angle = 0;
        this.distance = 0;
        this.friction = Math.random() * 0.6 + 0.15;
        this.ease = Math.random() * 0.1 + 0.005;
    }
    update() {
        this.dx = this.effect.mouse.x - this.x;
        this.dy = this.effect.mouse.y - this.y;
        
        this.distance = (this.dx * this.dx + this.dy * this.dy);
        this.force = -this.effect.mouse.radius / this.distance;
        if (this.distance < 4*this.effect.mouse.radius) {
            this.angle = Math.atan2(this.dy, this.dx);
            this.vx += this.force * Math.cos(this.angle);
            this.vy += this.force * Math.sin(this.angle);
        }
        this.x += (this.vx *= this.friction) + (this.originX - this.x) * this.ease;
        this.y += (this.vy *= this.friction) + (this.originY - this.y) * this.ease;
    }
    draw() {
        this.effect.context.fillStyle = this.color;
        this.effect.context.fillRect(this.x, this.y, this.size, this.size);
    }
}

class Effect {
    constructor(context, canvasWidth, canvasHeight) {
        this.context = context;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.maxTextWidth = this.canvasWidth * 0.8;
        this.fontSize = 60;
        this.textVerticalOffset = 0;
        this.lineHeight = this.fontSize * 1.2;
        this.textX = this.canvasWidth / 2;
        this.textY = this.canvasHeight / 2 - this.lineHeight / 2;
        this.particles = [];
        this.gap = 2;
        this.mouse = {
            radius: 20050,
            x: 0,
            y: 0
        }
        window.addEventListener("mousemove", e => {
            this.mouse.x = e.x;
            this.mouse.y = e.y;
        });
    }

    wrapText(text) {
        this.context.font = this.fontSize + 'px Bangers';
        this.context.textAlign = 'center';
        this.context.textBaseline = 'middle';
        this.context.strokeStyle = 'white';
        this.context.lineWidth = 5;
        this.context.letterSpacing = "10px";
        this.context.imageSmoothingEnabled = false;

        const edge = this.canvasWidth * 0.2;
        const gradient = this.context.createLinearGradient(edge, edge, this.canvasWidth - edge, this.canvasHeight - edge);



        gradient.addColorStop(0, 'violet');
        gradient.addColorStop(0.5, 'orange');
        gradient.addColorStop(1, 'blue');  // Black
        

        this.context.fillStyle = gradient;

        let linesArray = [];
        let words = text.split(' ');
        let lineCounter = 0;
        let line = '';

        for (let i = 0; i < words.length; i++) {
            let testLine = line + words[i] + ' ';
            if (this.context.measureText(testLine).width > this.maxTextWidth) {
                line = words[i] + ' ';
                lineCounter++;
            } else {
                line = testLine;
            }
            linesArray[lineCounter] = line;
        }

        let textHeight = this.lineHeight * lineCounter;
        this.textY = this.canvasHeight / 2 - textHeight / 2 + this.textVerticalOffset;

        linesArray.forEach((el, index) => {
            this.context.fillText(el, this.textX, this.textY + (index * this.lineHeight));
        });

        this.convertToParticles();
    }

    convertToParticles() {
        this.particles = [];
        const pixels = this.context.getImageData(0, 0, this.canvasWidth, this.canvasHeight).data;
        for (let y = 0; y < this.canvasHeight; y += this.gap) {
            for (let x = 0; x < this.canvasWidth; x += this.gap) {
                const index = (y * this.canvasWidth + x) * 4;
                const alpha = pixels[index + 3];
                if (alpha > 0) {
                    const red = pixels[index];
                    const green = pixels[index + 1];
                    const blue = pixels[index + 2];
                    const color = 'rgb(' + red + ',' + green + ',' + blue + ')';
                    this.particles.push(new Particle(this, x, y, color));
                }
            }
        }
        this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    }

    render() {
        this.particles.forEach(particle => {
            particle.update();
            particle.draw();
        })
    }
};

     
  
      function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        effect.render();
        drawCopyright();
        requestAnimationFrame(animate);
      }
      animate();
  
      window.addEventListener('resize', function(){
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
          effect = new Effect(ctx, canvas.width, canvas.height);
        effect.wrapText(effect.movetext.textContent);
        console.log('resize')
      });
  
  
  
  