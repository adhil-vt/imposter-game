import React, { useEffect, useState, useRef } from 'react';

export const CustomCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [trailPosition, setTrailPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(true);

  const requestRef = useRef<number | null>(null);
  const previousTimeRef = useRef<number | null>(null);

  useEffect(() => {
    // Check if it's a touch device or device doesn't support hover/fine pointer
    const checkTouch = () => {
      const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      setIsTouchDevice(hasTouch);
    };

    checkTouch();
    window.addEventListener('resize', checkTouch);

    return () => {
      window.removeEventListener('resize', checkTouch);
    };
  }, []);

  useEffect(() => {
    if (isTouchDevice) return;

    const onMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };

    const onMouseLeave = () => {
      setIsVisible(false);
    };

    const onMouseEnter = () => {
      setIsVisible(true);
    };

    const onMouseDown = () => {
      setIsClicking(true);
    };

    const onMouseUp = () => {
      setIsClicking(false);
    };

    // Listen to mouse events globally
    window.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);

    // Apply cursor-none class to body
    document.body.classList.add('custom-cursor-active');

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.body.classList.remove('custom-cursor-active');
    };
  }, [isTouchDevice, isVisible]);

  // Handle detecting hover over interactive elements
  useEffect(() => {
    if (isTouchDevice) return;

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      const isInteractive = 
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.tagName === 'INPUT' ||
        target.tagName === 'SELECT' ||
        target.tagName === 'TEXTAREA' ||
        target.closest('a') ||
        target.closest('button') ||
        target.closest('[role="button"]') ||
        target.closest('.cursor-pointer') ||
        target.classList.contains('cursor-pointer');

      setIsHovering(!!isInteractive);
    };

    window.addEventListener('mouseover', handleMouseOver);
    return () => {
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [isTouchDevice]);

  // Smooth trail effect using requestAnimationFrame
  useEffect(() => {
    if (isTouchDevice) return;

    const animate = (time: number) => {
      if (previousTimeRef.current !== null) {
        // Linear interpolation for smooth lag trail
        setTrailPosition(prev => {
          const dx = position.x - prev.x;
          const dy = position.y - prev.y;
          // Ease coefficient (0.15 is smooth, smaller is slower/laggier)
          return {
            x: prev.x + dx * 0.18,
            y: prev.y + dy * 0.18,
          };
        });
      }
      previousTimeRef.current = time;
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [position, isTouchDevice]);

  if (isTouchDevice || !isVisible) return null;

  return (
    <>
      {/* Outer Glow Ring */}
      <div
        className={`fixed top-0 left-0 rounded-full pointer-events-none z-[9999] transition-transform duration-150 ease-out -translate-x-1/2 -translate-y-1/2 border border-brand-primary/40 bg-brand-primary/5 ${
          isHovering 
            ? 'w-12 h-12 border-brand-secondary bg-brand-secondary/10 scale-110 shadow-[0_0_15px_rgba(236,72,153,0.3)]' 
            : isClicking 
              ? 'w-6 h-6 border-brand-primary bg-brand-primary/20 scale-90' 
              : 'w-9 h-9'
        }`}
        style={{
          left: `${trailPosition.x}px`,
          top: `${trailPosition.y}px`,
        }}
      />
      {/* Inner Pinpoint Dot */}
      <div
        className={`fixed top-0 left-0 w-2.5 h-2.5 rounded-full pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 transition-[transform,background-color,box-shadow] duration-150 ${
          isHovering 
            ? 'bg-brand-secondary scale-50' 
            : isClicking 
              ? 'bg-brand-primary scale-125' 
              : 'bg-brand-primary shadow-[0_0_8px_rgba(99,102,241,0.6)]'
        }`}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
        }}
      />
    </>
  );
};
