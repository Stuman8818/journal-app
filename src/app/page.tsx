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
      leaf.className = 'absolute w-6 h-6 pixelated animate-petal'; // Increased size
      // Set the leaf's vertical position around the middle with slight variation
      leaf.style.top = `${50 + Math.random() * 20 - 10}%`; // 50% (center) with a range of -10% to +10%
      leaf.style.left = '-15px'; // Slight adjustment for better position
      container.appendChild(leaf);
  
      leaf.addEventListener('animationend', () => leaf.remove());
    };
  
    const interval = setInterval(createLeaf, 500); // Slower leaf creation
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-screen h-screen aspect-[4/3] border-[10px] border-[#333] overflow-hidden pixelated relative">
      {/* Clouds */}
      <img src="/C2010.png" className="absolute top-10 right-20 w-15 h-10 pixelated animate-cloud" />
      <img src="/C2011.png" className="absolute top-60 right-40 w-15 h-10 pixelated animate-cloud" />


      {/* Ground and Trees */}
      <div className="ground">
        <img src="/tree-light.png" className="absolute bottom-0 left-12 w-16 h-24 pixelated z-10" />
        <img src="/tree-light.png" className="absolute bottom-0 left-36 w-16 h-24 pixelated z-10" />
        <img src="/tree-light.png" className="absolute bottom-0 right-12 w-16 h-24 pixelated z-10" />
        <img src="/tree-light.png" className="absolute bottom-0 right-36 w-16 h-24 pixelated z-10" />
      </div>

      {/* Leaves */}
      <div ref={leafContainerRef} className="absolute inset-0 pointer-events-none" />

      {/* Content */}
      <Header />
      <h1 className="title text-xl">Daily Log</h1>

    </div>
  );
}
