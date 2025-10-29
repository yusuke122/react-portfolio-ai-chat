import React, { useEffect, useRef, useState } from 'react';
import './InteractiveCanvas.scss';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

interface InteractiveCanvasProps {
  width?: number;
  height?: number;
  particleCount?: number;
  interactive?: boolean;
}

export const InteractiveCanvas: React.FC<InteractiveCanvasProps> = ({
  width = 800,
  height = 400,
  particleCount = 50,
  interactive = true
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0, isDown: false });
  const [isActive, setIsActive] = useState(false);

  // パーティクル初期化
  const initParticles = () => {
    const particles: Particle[] = [];
    const colors = ['#3498db', '#e74c3c', '#f39c12', '#2ecc71', '#9b59b6', '#1abc9c'];
    
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        life: Math.random() * 100,
        maxLife: 100 + Math.random() * 50,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 2 + Math.random() * 4
      });
    }
    
    particlesRef.current = particles;
  };

  // パーティクル更新
  const updateParticles = (ctx: CanvasRenderingContext2D) => {
    const particles = particlesRef.current;
    const mouse = mouseRef.current;
    
    particles.forEach((particle, index) => {
      // マウスとの相互作用
      if (interactive && isActive) {
        const dx = mouse.x - particle.x;
        const dy = mouse.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 100) {
          const force = (100 - distance) / 100;
          if (mouse.isDown) {
            // マウスクリック時は引き寄せる
            particle.vx += dx * force * 0.02;
            particle.vy += dy * force * 0.02;
          } else {
            // ホバー時は押し返す
            particle.vx -= dx * force * 0.01;
            particle.vy -= dy * force * 0.01;
          }
        }
      }
      
      // 位置更新
      particle.x += particle.vx;
      particle.y += particle.vy;
      
      // 境界チェック
      if (particle.x <= 0 || particle.x >= width) {
        particle.vx *= -0.8;
        particle.x = Math.max(0, Math.min(width, particle.x));
      }
      if (particle.y <= 0 || particle.y >= height) {
        particle.vy *= -0.8;
        particle.y = Math.max(0, Math.min(height, particle.y));
      }
      
      // 摩擦
      particle.vx *= 0.99;
      particle.vy *= 0.99;
      
      // ライフサイクル
      particle.life++;
      if (particle.life > particle.maxLife) {
        // パーティクル再生成
        particle.x = Math.random() * width;
        particle.y = Math.random() * height;
        particle.vx = (Math.random() - 0.5) * 2;
        particle.vy = (Math.random() - 0.5) * 2;
        particle.life = 0;
      }
    });
  };

  // パーティクル描画
  const drawParticles = (ctx: CanvasRenderingContext2D) => {
    const particles = particlesRef.current;
    
    particles.forEach(particle => {
      const alpha = 1 - (particle.life / particle.maxLife);
      
      // グローエフェクト
      ctx.shadowColor = particle.color;
      ctx.shadowBlur = 10;
      
      // パーティクル描画
      ctx.globalAlpha = alpha;
      ctx.fillStyle = particle.color;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();
      
      // コネクションライン描画
      particles.forEach(otherParticle => {
        const dx = particle.x - otherParticle.x;
        const dy = particle.y - otherParticle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 80) {
          const lineAlpha = (80 - distance) / 80 * alpha * 0.3;
          ctx.globalAlpha = lineAlpha;
          ctx.strokeStyle = particle.color;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particle.x, particle.y);
          ctx.lineTo(otherParticle.x, otherParticle.y);
          ctx.stroke();
        }
      });
    });
    
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;
  };

  // 波紋エフェクト
  const createRipple = (x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let radius = 0;
    const maxRadius = 100;
    
    const animateRipple = () => {
      ctx.save();
      ctx.globalAlpha = 1 - (radius / maxRadius);
      ctx.strokeStyle = '#3498db';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
      
      radius += 3;
      
      if (radius < maxRadius) {
        requestAnimationFrame(animateRipple);
      }
    };
    
    animateRipple();
  };

  // メインアニメーションループ
  const animate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // キャンバスクリア
    ctx.clearRect(0, 0, width, height);
    
    // 背景グラデーション
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, 'rgba(52, 152, 219, 0.1)');
    gradient.addColorStop(1, 'rgba(155, 89, 182, 0.1)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    updateParticles(ctx);
    drawParticles(ctx);
    
    animationRef.current = requestAnimationFrame(animate);
  };

  // マウスイベントハンドラー
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    mouseRef.current.x = e.clientX - rect.left;
    mouseRef.current.y = e.clientY - rect.top;
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    mouseRef.current.isDown = true;
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    createRipple(x, y);
    
    // 新しいパーティクルを生成
    const colors = ['#3498db', '#e74c3c', '#f39c12', '#2ecc71', '#9b59b6'];
    for (let i = 0; i < 5; i++) {
      particlesRef.current.push({
        x: x + (Math.random() - 0.5) * 20,
        y: y + (Math.random() - 0.5) * 20,
        vx: (Math.random() - 0.5) * 8,
        vy: (Math.random() - 0.5) * 8,
        life: 0,
        maxLife: 60,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 3 + Math.random() * 3
      });
    }
  };

  const handleMouseUp = () => {
    mouseRef.current.isDown = false;
  };

  const handleMouseEnter = () => {
    setIsActive(true);
  };

  const handleMouseLeave = () => {
    setIsActive(false);
    mouseRef.current.isDown = false;
  };

  useEffect(() => {
    initParticles();
    animate();
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <div className="interactive-canvas-container">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="interactive-canvas"
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      />
      <div className="canvas-controls">
        <p className="canvas-hint">
          {interactive ? '🎨 マウスを動かしてパーティクルと相互作用してみてください' : ''}
        </p>
      </div>
    </div>
  );
};