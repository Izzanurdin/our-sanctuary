import { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';

// Blueprint Kunang-kunang Malam (Firefly)
class Firefly {
  constructor(w, h) {
    this.x = Math.random() * w;
    this.y = Math.random() * h;
    this.size = Math.random() * 1.6 + 0.6;
    this.speedX = Math.random() * 0.3 - 0.15;
    this.speedY = Math.random() * -0.3 - 0.05;
    this.life = Math.random() * 100 + 100;
    this.opacity = Math.random();
    this.fadeSpeed = Math.random() * 0.015 + 0.005;
  }

  update(dt, w, h) {
    this.x += this.speedX * dt;
    this.y += this.speedY * dt;
    this.opacity += this.fadeSpeed * dt;

    if (this.opacity >= 1 || this.opacity <= 0) {
      this.fadeSpeed *= -1;
    }
    this.life -= 1 * dt;

    // Wrap around screen
    if (this.x < -10) this.x = w + 10;
    if (this.x > w + 10) this.x = -10;
    if (this.y < -10) this.y = h + 10;
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(129, 199, 132, ${Math.max(0, Math.min(1, this.opacity))})`;
    ctx.shadowBlur = 8;
    ctx.shadowColor = 'rgba(76, 175, 80, 0.8)';
    ctx.fill();
    ctx.shadowBlur = 0;
  }
}

// Blueprint Jejak Bintang Berpendar (Star Trail)
class Star {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = Math.random() * 6 + 2.5;
    this.life = 1;
    this.decay = Math.random() * 0.012 + 0.01;
    this.rotation = Math.random() * Math.PI * 2;
    this.rotSpeed = (Math.random() - 0.5) * 0.04;

    const colors = ['255,255,255', '255,253,231', '255,249,196', '255,215,0'];
    this.color = colors[Math.floor(Math.random() * colors.length)];
  }

  update(dt) {
    this.life -= this.decay * dt;
    this.rotation += this.rotSpeed * dt;
    this.size -= 0.02 * dt;
    this.y -= 0.15 * dt;
  }

  draw(ctx) {
    if (this.life <= 0 || this.size <= 0) return;
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.beginPath();

    // Bintang bersudut empat klasik
    for (let i = 0; i < 4; i++) {
      ctx.lineTo(0, -this.size);
      ctx.lineTo(this.size * 0.25, -this.size * 0.25);
      ctx.rotate(Math.PI / 2);
    }
    ctx.closePath();

    ctx.fillStyle = `rgba(${this.color}, ${Math.max(0, this.life)})`;
    ctx.shadowBlur = 6;
    ctx.shadowColor = `rgba(${this.color}, 0.8)`;
    ctx.fill();
    ctx.restore();
  }
}

const GardenCanvas = forwardRef((props, ref) => {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);

  useImperativeHandle(ref, () => ({
    spawnStar(x, y) {
      if (particlesRef.current.length < 80) {
        particlesRef.current.push(new Star(x, y));
      }
    },
  }));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const maxFireflies = window.innerWidth < 768 ? 16 : 36;
    let lastTime = performance.now();

    const animate = (currentTime) => {
      ctx.clearRect(0, 0, width, height);

      let dt = (currentTime - lastTime) / 16.66;
      lastTime = currentTime;
      if (dt > 3) dt = 3;
      if (isNaN(dt)) dt = 1;

      // Jaga populasi kunang-kunang
      const firefliesCount = particlesRef.current.filter((p) => p instanceof Firefly).length;
      if (firefliesCount < maxFireflies) {
        particlesRef.current.push(new Firefly(width, height));
      }

      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];
        p.update(dt, width, height);
        p.draw(ctx);

        if (p.life <= 0 || (p instanceof Star && p.size <= 0)) {
          particlesRef.current.splice(i, 1);
        }
      }

      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-10 w-screen h-screen"
    />
  );
});

GardenCanvas.displayName = 'GardenCanvas';
export default GardenCanvas;
