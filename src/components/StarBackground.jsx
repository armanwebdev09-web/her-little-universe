import React, { useEffect, useRef } from 'react';

export const StarBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;

    // Set canvas dimensions
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Create stars
    const starCount = Math.floor((canvas.width * canvas.height) / 3000);
    const stars = Array.from({ length: Math.min(starCount, 350) }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 1.2 + 0.3,
      baseAlpha: Math.random() * 0.7 + 0.2,
      alpha: Math.random() * 0.7 + 0.2,
      twinkleSpeed: Math.random() * 0.015 + 0.005,
      twinkleFactor: 1,
      floatingSpeedY: Math.random() * 0.05 + 0.01,
      color: Math.random() > 0.85 ? '#D9A6B2' : Math.random() > 0.7 ? '#D8B477' : '#F8F5F0'
    }));

    // Ambient floating particles
    const particles = Array.from({ length: 40 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 2 + 1,
      alpha: Math.random() * 0.2 + 0.05,
      speedX: (Math.random() - 0.5) * 0.15,
      speedY: -Math.random() * 0.2 - 0.05,
    }));

    // Shooting star state
    let shootingStar = null;
    let nextShootingStarTime = Date.now() + Math.random() * 4000 + 3000;

    const spawnShootingStar = () => {
      const startX = Math.random() * canvas.width * 0.7 + canvas.width * 0.1;
      const startY = Math.random() * canvas.height * 0.4;
      const length = Math.random() * 120 + 80;
      const angle = Math.PI / 4 + (Math.random() - 0.5) * 0.2; // roughly 45 degrees

      shootingStar = {
        x: startX,
        y: startY,
        length: length,
        speed: Math.random() * 6 + 7,
        dx: Math.cos(angle),
        dy: Math.sin(angle),
        progress: 0,
        maxProgress: length,
        opacity: 1,
      };
    };

    // Render loop
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const now = Date.now();

      // Render stars
      stars.forEach((star) => {
        // Twinkle effect
        star.alpha += star.twinkleSpeed * star.twinkleFactor;
        if (star.alpha > star.baseAlpha + 0.35 || star.alpha > 0.95) {
          star.twinkleFactor = -1;
        } else if (star.alpha < star.baseAlpha - 0.25 || star.alpha < 0.1) {
          star.twinkleFactor = 1;
        }

        // Slow upward floating
        star.y -= star.floatingSpeedY;
        if (star.y < 0) {
          star.y = canvas.height;
          star.x = Math.random() * canvas.width;
        }

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = star.color;
        ctx.globalAlpha = Math.max(0, Math.min(1, star.alpha));
        ctx.fill();
      });

      // Render floating dust particles
      ctx.globalAlpha = 1;
      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.y < 0) {
          p.y = canvas.height;
          p.x = Math.random() * canvas.width;
        }
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#D9A6B2';
        ctx.globalAlpha = p.alpha;
        ctx.fill();
      });

      // Spawn shooting star periodically
      if (!shootingStar && now > nextShootingStarTime) {
        spawnShootingStar();
        nextShootingStarTime = now + Math.random() * 7000 + 5000;
      }

      // Render shooting star
      if (shootingStar) {
        shootingStar.progress += shootingStar.speed;
        const currentX = shootingStar.x + shootingStar.dx * shootingStar.progress;
        const currentY = shootingStar.y + shootingStar.dy * shootingStar.progress;
        const tailX = shootingStar.x + shootingStar.dx * Math.max(0, shootingStar.progress - shootingStar.length);
        const tailY = shootingStar.y + shootingStar.dy * Math.max(0, shootingStar.progress - shootingStar.length);

        if (shootingStar.progress >= shootingStar.maxProgress + shootingStar.length) {
          shootingStar = null;
        } else {
          const gradient = ctx.createLinearGradient(tailX, tailY, currentX, currentY);
          gradient.addColorStop(0, 'rgba(217, 166, 178, 0)');
          gradient.addColorStop(0.7, 'rgba(217, 166, 178, 0.4)');
          gradient.addColorStop(1, 'rgba(255, 255, 255, 0.95)');

          ctx.beginPath();
          ctx.moveTo(tailX, tailY);
          ctx.lineTo(currentX, currentY);
          ctx.lineWidth = 1.5;
          ctx.strokeStyle = gradient;
          ctx.globalAlpha = 0.9;
          ctx.stroke();

          // Small head glow
          ctx.beginPath();
          ctx.arc(currentX, currentY, 2, 0, Math.PI * 2);
          ctx.fillStyle = '#FFFFFF';
          ctx.shadowBlur = 8;
          ctx.shadowColor = '#D9A6B2';
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }

      ctx.globalAlpha = 1;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Deep sky radial backdrop gradient */}
      <div 
        className="absolute inset-0 bg-radial from-[#101528]/80 via-[#080B16] to-[#080B16]"
        style={{
          background: 'radial-gradient(circle at 50% 20%, rgba(16, 21, 40, 0.9) 0%, rgba(8, 11, 22, 1) 75%)'
        }}
      />
      
      {/* Subtle Moon in upper right */}
      <div 
        className="absolute top-[8%] right-[8%] w-24 h-24 sm:w-36 sm:h-36 rounded-full opacity-20 sm:opacity-25 pointer-events-none transition-all duration-1000"
        style={{
          background: 'radial-gradient(circle at 35% 35%, #F8F5F0 0%, #D8B477 40%, rgba(8, 11, 22, 0) 70%)',
          boxShadow: '0 0 50px 15px rgba(216, 180, 119, 0.15)',
          filter: 'blur(1px)',
        }}
      />

      {/* Soft Rose Glow in background center-left */}
      <div 
        className="absolute top-1/3 left-1/4 w-[350px] h-[350px] sm:w-[550px] sm:h-[550px] rounded-full opacity-15 pointer-events-none blur-[120px]"
        style={{
          background: 'radial-gradient(circle, rgba(217, 166, 178, 0.35) 0%, rgba(8, 11, 22, 0) 70%)',
        }}
      />

      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />
    </div>
  );
};
