"use client";

import { useState, useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const particlesRef = useRef<Particle[]>([]);

  // Initialize particles
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size - centered area
    const resizeCanvas = () => {
      const containerWidth = canvas.parentElement?.clientWidth || 800;
      const containerHeight = canvas.parentElement?.clientHeight || 600;
      
      // Create a larger canvas area for more harmonious appearance
      const canvasWidth = Math.min(containerWidth * 0.85, 800);
      const canvasHeight = Math.min(containerHeight * 0.9, 600);
      
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Create 25 particles with random positions (fewer, more dispersed)
    const newParticles: Particle[] = [];
    for (let i = 0; i < 25; i++) {
      newParticles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.2, // Much slower movement
        vy: (Math.random() - 0.5) * 0.2,
        radius: 2, // Smaller particles
      });
    }
    particlesRef.current = newParticles;

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const animate = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      particlesRef.current = particlesRef.current.map(particle => {
        // Update position
        let newX = particle.x + particle.vx;
        let newY = particle.y + particle.vy;

        // Bounce off edges
        if (newX < 0 || newX > canvas.width) {
          particle.vx *= -1;
          newX = particle.x;
        }
        if (newY < 0 || newY > canvas.height) {
          particle.vy *= -1;
          newY = particle.y;
        }

        // Keep within bounds
        newX = Math.max(0, Math.min(canvas.width, newX));
        newY = Math.max(0, Math.min(canvas.height, newY));

        return {
          ...particle,
          x: newX,
          y: newY,
        };
      });

      // Draw particles in dark grey/charcoal
      ctx.fillStyle = '#4A4A4A'; // Dark grey/charcoal
      particlesRef.current.forEach(particle => {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw connections
      ctx.lineWidth = 1.5;
      
      for (let i = 0; i < particlesRef.current.length; i++) {
        for (let j = i + 1; j < particlesRef.current.length; j++) {
          const dx = particlesRef.current[i].x - particlesRef.current[j].x;
          const dy = particlesRef.current[i].y - particlesRef.current[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 80) { // Shorter connection distance for more dispersed effect
            const opacity = 0.3 * (1 - distance / 80); // More subtle connections
            ctx.strokeStyle = `rgba(107, 107, 107, ${opacity})`; // Medium grey with opacity
            ctx.beginPath();
            ctx.moveTo(particlesRef.current[i].x, particlesRef.current[i].y);
            ctx.lineTo(particlesRef.current[j].x, particlesRef.current[j].y);
            ctx.stroke();
          }
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []); // Empty dependency array - no more infinite loop!

  return (
    <div className="min-h-screen bg-amber-50 relative">
      {/* Particle Field - Centered */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative">
          <canvas
            ref={canvasRef}
            className="block"
            style={{ background: 'transparent' }}
          />
        </div>
      </div>
      
      {/* Text Content - Bottom-left positioning, slightly higher */}
      <div className="absolute bottom-16 left-8 md:bottom-24 md:left-16 max-w-md">
        <h1 className="text-xl md:text-2xl font-bold text-stone-800 mb-2 leading-tight">
          Elisa Mordenti
        </h1>
        
        <p className="text-sm md:text-base text-stone-700 mb-1 leading-tight">
          Exploring technology applications in relevant sectors
        </p>
        <p className="text-sm md:text-base text-stone-700 mb-4 leading-tight">
          Love all related to investing
        </p>

        {/* Links with commas - smaller than subject lines */}
        <div className="text-stone-700 text-xs md:text-sm">
          <a 
            href="https://www.linkedin.com/in/elisa-mordenti/" 
            className="hover:underline underline-offset-4 transition-all duration-200 hover:text-stone-600"
          >
            LinkedIn
          </a>
          <span className="mx-1">,</span>
          <a 
            href="#" 
            className="hover:underline underline-offset-4 transition-all duration-200 hover:text-stone-600"
          >
            Builders that Matter
          </a>
          <span className="mx-1">,</span>
          <a 
            href="mailto:elisamordenti1@gmail.com" 
            className="hover:underline underline-offset-4 transition-all duration-200 hover:text-stone-600"
          >
            Contact me
          </a>
        </div>
      </div>
    </div>
  );
}