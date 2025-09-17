import React from 'react';
import './KolamBackground.css';

const KolamBackground = ({ children }) => {
  return (
    <div className="kolam-bg">
      {/* String lights */}
      <div className="string-lights" aria-hidden="true">
        <span className="bulb" style={{left: '8%'}}></span>
        <span className="bulb" style={{left: '20%'}}></span>
        <span className="bulb" style={{left: '34%'}}></span>
        <span className="bulb" style={{left: '48%'}}></span>
        <span className="bulb" style={{left: '62%'}}></span>
        <span className="bulb" style={{left: '76%'}}></span>
      </div>

      {/* Main content */}
      <main className="content">
        {children}
      </main>
    </div>
  );
};

export default KolamBackground;