"use client";
import { useEffect, useRef } from 'react';
import Header from './components/header';

export default function Home() {
  const leafContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = leafContainerRef.current;
    if (!container) return;

    const createLeaf = () => {
      const leaf = document.createElement('svg');
      leaf.innerHTML = `
        <svg width="12" height="12" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
          <rect x="5" y="1" width="2" height="1" fill="#FF69B4" />
          <rect x="4" y="2" width="4" height="1" fill="#FF69B4" />
          <rect x="3" y="3" width="6" height="1" fill="#FF69B4" />
          <rect x="4" y="4" width="4" height="1" fill="#FF69B4" />
          <rect x="5" y="5" width="2" height="1" fill="#FF69B4" />
        </svg>
      `;
      leaf.className = 'absolute w-6 h-6 pixelated animate-petal';
      leaf.style.top = `${50 + Math.random() * 20 - 10}%`; // Center range: 40%–60%
      leaf.style.left = '-15px';
      container.appendChild(leaf);

      leaf.addEventListener('animationend', () => leaf.remove());
    };

    const interval = setInterval(createLeaf, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-screen h-screen aspect-[4/3] border-[10px] border-[#333] overflow-hidden pixelated relative">
      {/* Header and Title */}
      <Header />
      <h1 className="title text-xl z-11">Daily Log</h1>

      {/* Sun */}
      <img
        src="/sun_shiny.png"
        className="absolute top-4 right-4 w-12 h-12 pixelated z-10"
        alt="Shiny Sun"
      />

      {/* Clouds */}
      <img src="/C2010.png" className="absolute top-10 right-20 w-15 h-10 pixelated animate-cloud" />
      <img src="/C2011.png" className="absolute top-60 right-40 w-15 h-10 pixelated animate-cloud" />

      {/* Ground and Trees */}
      <div className="ground">
        <img src="/Green Trees/Tree 1.png" className="absolute bottom-0 left-4 w-16 h-24 pixelated z-10" />
        <img src="/Green Trees/Tree 1.png" className="absolute bottom-0 left-20 w-16 h-24 pixelated z-10" />
        <img src="/Green Trees/Tree 2.png" className="absolute bottom-0 left-36 w-16 h-24 pixelated z-10" />
        <img src="/Green Trees/Tree 2.png" className="absolute bottom-0 left-52 w-16 h-24 pixelated z-10" />
        <img src="/Green Trees/Tree 3.png" className="absolute bottom-0 right-52 w-16 h-24 pixelated z-10" />
        <img src="/Green Trees/Tree 3.png" className="absolute bottom-0 right-36 w-16 h-24 pixelated z-10" />
        <img src="/Green Trees/Tree 3.1.png" className="absolute bottom-0 right-20 w-16 h-24 pixelated z-10" />
        <img src="/Green Trees/Tree 4.png" className="absolute bottom-0 right-4 w-16 h-24 pixelated z-10" />
      </div>

      {/* Leaves */}
      <div ref={leafContainerRef} className="absolute inset-0 pointer-events-none" />
    </div>
  );
}