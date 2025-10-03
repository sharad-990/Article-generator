import React from 'react';
import './Logo.css';

const Logo = ({ size = 'medium' }) => {
  return (
    <div className={`logo-container ${size}`}>
      <svg 
        className="logo-svg" 
        viewBox="0 0 200 60" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background circle with gradient */}
        <circle 
          cx="30" 
          cy="30" 
          r="25" 
          fill="url(#gradient1)" 
          stroke="url(#gradient2)" 
          strokeWidth="2"
        />
        
        {/* Pen/Pencil icon */}
        <g transform="translate(15, 15)">
          {/* Pen body */}
          <rect 
            x="8" 
            y="5" 
            width="12" 
            height="20" 
            rx="2" 
            fill="url(#gradient3)"
            stroke="url(#gradient4)" 
            strokeWidth="1"
          />
          
          {/* Pen tip */}
          <polygon 
            points="8,5 14,5 20,15 14,15" 
            fill="url(#gradient5)"
          />
          
          {/* Pen clip */}
          <rect 
            x="6" 
            y="8" 
            width="2" 
            height="12" 
            rx="1" 
            fill="url(#gradient6)"
          />
          
          {/* Writing lines with animation */}
          <path 
            d="M 25 20 Q 35 18 45 20 Q 55 22 65 20" 
            stroke="url(#gradient7)" 
            strokeWidth="2" 
            fill="none"
            strokeLinecap="round"
            className="writing-line"
          />
          <path 
            d="M 25 25 Q 35 23 45 25 Q 55 27 65 25" 
            stroke="url(#gradient7)" 
            strokeWidth="2" 
            fill="none"
            strokeLinecap="round"
            className="writing-line"
          />
          <path 
            d="M 25 30 Q 35 28 45 30 Q 55 32 65 30" 
            stroke="url(#gradient7)" 
            strokeWidth="2" 
            fill="none"
            strokeLinecap="round"
            className="writing-line"
          />
        </g>
        
        {/* Text */}
        <text 
          x="70" 
          y="25" 
          className="logo-text-main"
          fill="url(#gradient8)"
        >
          WriteGen
        </text>
        <text 
          x="70" 
          y="40" 
          className="logo-text-sub"
          fill="url(#gradient9)"
        >
          AI Content Creator
        </text>
        
        {/* Decorative floating elements */}
        <circle cx="180" cy="15" r="3" fill="url(#gradient10)" opacity="0.7" className="floating-dot">
          <animate attributeName="opacity" values="0.7;1;0.7" dur="2s" repeatCount="indefinite"/>
        </circle>
        <circle cx="185" cy="25" r="2" fill="url(#gradient11)" opacity="0.5" className="floating-dot">
          <animate attributeName="opacity" values="0.5;0.8;0.5" dur="1.5s" repeatCount="indefinite"/>
        </circle>
        <circle cx="175" cy="35" r="2.5" fill="url(#gradient12)" opacity="0.6" className="floating-dot">
          <animate attributeName="opacity" values="0.6;0.9;0.6" dur="2.5s" repeatCount="indefinite"/>
        </circle>
        
        {/* Gradients */}
        <defs>
          <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#667eea"/>
            <stop offset="100%" stopColor="#764ba2"/>
          </linearGradient>
          
          <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8b9cff"/>
            <stop offset="100%" stopColor="#a855f7"/>
          </linearGradient>
          
          <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff"/>
            <stop offset="100%" stopColor="#f8fafc"/>
          </linearGradient>
          
          <linearGradient id="gradient4" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#e2e8f0"/>
            <stop offset="100%" stopColor="#cbd5e1"/>
          </linearGradient>
          
          <linearGradient id="gradient5" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f59e0b"/>
            <stop offset="100%" stopColor="#d97706"/>
          </linearGradient>
          
          <linearGradient id="gradient6" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6b7280"/>
            <stop offset="100%" stopColor="#4b5563"/>
          </linearGradient>
          
          <linearGradient id="gradient7" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#667eea"/>
            <stop offset="100%" stopColor="#764ba2"/>
          </linearGradient>
          
          <linearGradient id="gradient8" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1f2937"/>
            <stop offset="100%" stopColor="#374151"/>
          </linearGradient>
          
          <linearGradient id="gradient8-dark" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff"/>
            <stop offset="100%" stopColor="#f3f4f6"/>
          </linearGradient>
          
          <linearGradient id="gradient9" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6b7280"/>
            <stop offset="100%" stopColor="#9ca3af"/>
          </linearGradient>
          
          <linearGradient id="gradient9-dark" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#d1d5db"/>
            <stop offset="100%" stopColor="#9ca3af"/>
          </linearGradient>
          
          <linearGradient id="gradient10" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fbbf24"/>
            <stop offset="100%" stopColor="#f59e0b"/>
          </linearGradient>
          
          <linearGradient id="gradient11" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981"/>
            <stop offset="100%" stopColor="#059669"/>
          </linearGradient>
          
          <linearGradient id="gradient12" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8b5cf6"/>
            <stop offset="100%" stopColor="#7c3aed"/>
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

export default Logo;
