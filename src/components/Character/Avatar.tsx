import React, { useEffect, useRef, useState } from 'react';
import './Avatar.scss';

interface AvatarProps {
  mood?: 'happy' | 'thinking' | 'talking' | 'idle';
  size?: 'small' | 'medium' | 'large';
  onClick?: () => void;
}

export const Avatar: React.FC<AvatarProps> = ({ 
  mood = 'idle', 
  size = 'medium',
  onClick 
}) => {
  const avatarRef = useRef<HTMLDivElement>(null);
  const eyesRef = useRef<HTMLDivElement>(null);
  const mouthRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const avatar = avatarRef.current;
    const eyes = eyesRef.current;
    const mouth = mouthRef.current;
    
    if (!avatar || !eyes || !mouth) return;

    // アイドルアニメーション（まばたき）
    const blinkAnimation = () => {
      if (mood === 'idle' || mood === 'thinking') {
        eyes.style.transform = 'scaleY(0.1)';
        setTimeout(() => {
          eyes.style.transform = 'scaleY(1)';
        }, 150);
      }
    };

    // 話しているアニメーション
    const talkAnimation = () => {
      if (mood === 'talking') {
        const shapes = ['scaleY(0.5)', 'scaleY(1.2)', 'scaleY(0.8)', 'scaleY(1)'];
        let currentShape = 0;
        
        const animate = () => {
          mouth.style.transform = shapes[currentShape];
          currentShape = (currentShape + 1) % shapes.length;
        };
        
        const intervalId = setInterval(animate, 200);
        return () => clearInterval(intervalId);
      }
    };

    // 考えているアニメーション
    const thinkingAnimation = () => {
      if (mood === 'thinking') {
        let angle = 0;
        const animate = () => {
          angle += 0.02;
          const offsetX = Math.sin(angle) * 2;
          avatar.style.transform = `translateX(${offsetX}px) rotate(${Math.sin(angle * 2) * 0.5}deg)`;
        };
        
        const intervalId = setInterval(animate, 16);
        return () => {
          clearInterval(intervalId);
          avatar.style.transform = '';
        };
      }
    };

    // 浮遊アニメーション
    const floatAnimation = () => {
      let startTime = Date.now();
      
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const offsetY = Math.sin(elapsed * 0.002) * 3;
        const rotation = Math.sin(elapsed * 0.001) * 1;
        
        if (!isHovered) {
          avatar.style.transform = `translateY(${offsetY}px) rotate(${rotation}deg)`;
        }
        
        requestAnimationFrame(animate);
      };
      
      animate();
    };

    // アニメーション開始
    const blinkInterval = setInterval(blinkAnimation, 2000 + Math.random() * 3000);
    const talkCleanup = talkAnimation();
    const thinkCleanup = thinkingAnimation();
    floatAnimation();

    return () => {
      clearInterval(blinkInterval);
      if (talkCleanup) talkCleanup();
      if (thinkCleanup) thinkCleanup();
    };
  }, [mood, isHovered]);

  // マウス追跡機能
  useEffect(() => {
    const avatar = avatarRef.current;
    if (!avatar) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!isHovered) return;
      
      const rect = avatar.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;
      
      const angle = Math.atan2(deltaY, deltaX);
      const distance = Math.min(Math.sqrt(deltaX * deltaX + deltaY * deltaY), 50);
      
      const offsetX = Math.cos(angle) * distance * 0.1;
      const offsetY = Math.sin(angle) * distance * 0.1;
      
      avatar.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(1.05)`;
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, [isHovered]);

  const handleClick = () => {
    const avatar = avatarRef.current;
    if (!avatar) return;

    // クリックアニメーション
    avatar.style.transform = 'scale(0.9)';
    setTimeout(() => {
      avatar.style.transform = '';
    }, 150);

    if (onClick) onClick();
  };

  return (
    <div 
      ref={avatarRef}
      className={`avatar avatar--${size} avatar--${mood}`}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="avatar__head">
        <div className="avatar__face">
          <div ref={eyesRef} className="avatar__eyes">
            <div className="avatar__eye avatar__eye--left"></div>
            <div className="avatar__eye avatar__eye--right"></div>
          </div>
          <div ref={mouthRef} className={`avatar__mouth avatar__mouth--${mood}`}></div>
        </div>
        <div className="avatar__hair"></div>
      </div>
      <div className="avatar__body">
        <div className="avatar__torso"></div>
        <div className="avatar__arms">
          <div className="avatar__arm avatar__arm--left"></div>
          <div className="avatar__arm avatar__arm--right"></div>
        </div>
      </div>
      
      {/* パーティクルエフェクト */}
      {mood === 'happy' && (
        <div className="avatar__particles">
          {[...Array(6)].map((_, i) => (
            <div key={i} className={`avatar__particle avatar__particle--${i}`}></div>
          ))}
        </div>
      )}
    </div>
  );
};