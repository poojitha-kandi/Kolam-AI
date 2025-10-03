import React, { useState, useEffect } from 'react';
import '../App.css';

const LearnToDraw = () => {
  const [selectedKolam, setSelectedKolam] = useState(null);
  const [animationStep, setAnimationStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showDots, setShowDots] = useState(true);

  const kolamTutorials = [
    {
      id: 1,
      name: 'Simple Flower Kolam',
      difficulty: 'Beginner',
      dots: { rows: 5, cols: 5 },
      steps: [
        { instruction: 'Start with a 5x5 dot grid', path: '', description: 'Place dots evenly spaced in a grid pattern' },
        { instruction: 'Draw the center petal', path: 'M60,60 Q80,40 100,60 Q80,80 60,60', description: 'Create a curved petal shape' },
        { instruction: 'Add surrounding petals', path: 'M40,60 Q60,40 80,60 Q60,80 40,60 M60,40 Q80,20 100,40 Q80,60 60,40', description: 'Draw four more petals around the center' },
        { instruction: 'Connect with flowing lines', path: 'M20,60 Q40,60 60,60 Q80,60 100,60 Q120,60 140,60', description: 'Add connecting lines to complete the design' },
        { instruction: 'Add decorative borders', path: 'M20,20 Q60,20 100,20 Q140,20 180,20 M20,100 Q60,100 100,100 Q140,100 180,100', description: 'Frame the design with border elements' }
      ]
    },
    {
      id: 2,
      name: 'Geometric Star Kolam',
      difficulty: 'Intermediate',
      dots: { rows: 7, cols: 7 },
      steps: [
        { instruction: 'Create a 7x7 dot grid', path: '', description: 'Larger grid for more complex pattern' },
        { instruction: 'Draw the central star', path: 'M100,50 L120,90 L80,70 L120,70 L80,90 Z', description: 'Create a five-pointed star in the center' },
        { instruction: 'Add inner triangles', path: 'M100,70 L90,85 L110,85 Z M100,70 L90,55 L110,55 Z', description: 'Small triangular elements inside the star' },
        { instruction: 'Create outer frame', path: 'M50,50 L150,50 L150,110 L50,110 Z', description: 'Rectangular border around the star' },
        { instruction: 'Add corner decorations', path: 'M50,50 Q40,40 50,30 Q60,40 50,50 M150,50 Q160,40 150,30 Q140,40 150,50', description: 'Decorative corners to complete the design' }
      ]
    },
    {
      id: 3,
      name: 'Traditional Lotus Kolam',
      difficulty: 'Advanced',
      dots: { rows: 9, cols: 9 },
      steps: [
        { instruction: 'Begin with 9x9 dot grid', path: '', description: 'Large grid for detailed lotus pattern' },
        { instruction: 'Draw lotus center', path: 'M100,80 Q105,75 110,80 Q105,85 100,80 M90,80 Q95,75 100,80 Q95,85 90,80', description: 'Small central lotus bud' },
        { instruction: 'Add inner petals', path: 'M100,70 Q120,60 130,80 Q120,100 100,90 Q80,100 70,80 Q80,60 100,70', description: 'Four main inner petals' },
        { instruction: 'Create outer petals', path: 'M100,50 Q140,40 150,80 Q140,120 100,110 Q60,120 50,80 Q60,40 100,50', description: 'Larger outer petals' },
        { instruction: 'Add stem and leaves', path: 'M100,110 Q105,130 100,150 M90,125 Q70,120 60,140 Q70,150 90,145', description: 'Lotus stem with side leaves' },
        { instruction: 'Complete with details', path: 'M100,80 L105,85 M95,85 L100,80 M100,75 Q100,70 105,75', description: 'Final details and textures' }
      ]
    }
  ];

  useEffect(() => {
    let interval;
    if (isPlaying && selectedKolam && animationStep < selectedKolam.steps.length - 1) {
      interval = setInterval(() => {
        setAnimationStep(prev => prev + 1);
      }, 2000);
    } else if (isPlaying && animationStep >= selectedKolam.steps.length - 1) {
      setIsPlaying(false);
    }
    return () => clearInterval(interval);
  }, [isPlaying, animationStep, selectedKolam]);

  const handlePlay = () => {
    if (animationStep >= selectedKolam.steps.length - 1) {
      setAnimationStep(0);
    }
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleRestart = () => {
    setAnimationStep(0);
    setIsPlaying(false);
  };

  const handleStepSelect = (stepIndex) => {
    setAnimationStep(stepIndex);
    setIsPlaying(false);
  };

  const renderDotGrid = (rows, cols) => {
    const dots = [];
    const spacing = 20;
    const offsetX = 50;
    const offsetY = 50;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        dots.push(
          <circle
            key={`${row}-${col}`}
            cx={offsetX + col * spacing}
            cy={offsetY + row * spacing}
            r="2"
            fill="#4A5568"
            opacity={showDots ? 0.7 : 0}
          />
        );
      }
    }
    return dots;
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return '#48BB78';
      case 'Intermediate': return '#ED8936';
      case 'Advanced': return '#E53E3E';
      default: return '#4A5568';
    }
  };

  return (
    <div className="learn-to-draw-page">
      <header className="page-header">
        <h1>📚 Learn to Draw Kolams</h1>
        <p>Master the art of Kolam drawing with step-by-step animated tutorials</p>
      </header>

      <div className="learn-content">
        {!selectedKolam ? (
          <div className="tutorials-grid">
            <h2>Choose a Tutorial</h2>
            <div className="tutorials-list">
              {kolamTutorials.map((tutorial) => (
                <div 
                  key={tutorial.id}
                  className="tutorial-card"
                  onClick={() => setSelectedKolam(tutorial)}
                >
                  <div className="tutorial-header">
                    <h3>{tutorial.name}</h3>
                    <span 
                      className="difficulty-badge"
                      style={{ backgroundColor: getDifficultyColor(tutorial.difficulty) }}
                    >
                      {tutorial.difficulty}
                    </span>
                  </div>
                  <div className="tutorial-preview">
                    <svg width="200" height="150" viewBox="0 0 200 150">
                      {renderDotGrid(tutorial.dots.rows, tutorial.dots.cols)}
                      {tutorial.steps.map((step, index) => (
                        <path
                          key={index}
                          d={step.path}
                          stroke="#FF6B35"
                          strokeWidth="2"
                          fill="none"
                          opacity="0.6"
                        />
                      ))}
                    </svg>
                  </div>
                  <div className="tutorial-info">
                    <p>{tutorial.dots.rows}×{tutorial.dots.cols} dot grid</p>
                    <p>{tutorial.steps.length} steps</p>
                  </div>
                  <button className="start-tutorial-btn">
                    Start Tutorial →
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="tutorial-active">
            <div className="tutorial-header-active">
              <button 
                className="back-btn"
                onClick={() => setSelectedKolam(null)}
              >
                ← Back to Tutorials
              </button>
              <h2>{selectedKolam.name}</h2>
              <span 
                className="difficulty-badge"
                style={{ backgroundColor: getDifficultyColor(selectedKolam.difficulty) }}
              >
                {selectedKolam.difficulty}
              </span>
            </div>

            <div className="tutorial-workspace">
              <div className="canvas-area">
                <svg width="400" height="300" viewBox="0 0 400 300" className="kolam-canvas">
                  {/* Background */}
                  <rect width="400" height="300" fill="#1A202C" />
                  
                  {/* Dot Grid */}
                  {renderDotGrid(selectedKolam.dots.rows, selectedKolam.dots.cols)}
                  
                  {/* Animated Steps */}
                  {selectedKolam.steps.slice(0, animationStep + 1).map((step, index) => (
                    <g key={index}>
                      <path
                        d={step.path}
                        stroke="#FF6B35"
                        strokeWidth="3"
                        fill="none"
                        strokeDasharray={index === animationStep ? "200" : "none"}
                        strokeDashoffset={index === animationStep ? "200" : "0"}
                        style={{
                          animation: index === animationStep ? 'drawLine 2s ease-in-out forwards' : 'none'
                        }}
                      />
                    </g>
                  ))}
                </svg>

                <div className="canvas-controls">
                  <button 
                    className="control-btn"
                    onClick={handlePlay}
                    disabled={isPlaying}
                  >
                    ▶️ Play
                  </button>
                  <button 
                    className="control-btn"
                    onClick={handlePause}
                    disabled={!isPlaying}
                  >
                    ⏸️ Pause
                  </button>
                  <button 
                    className="control-btn"
                    onClick={handleRestart}
                  >
                    🔄 Restart
                  </button>
                  <label className="toggle-dots">
                    <input
                      type="checkbox"
                      checked={showDots}
                      onChange={(e) => setShowDots(e.target.checked)}
                    />
                    Show Dots
                  </label>
                </div>
              </div>

              <div className="steps-panel">
                <h3>Steps</h3>
                <div className="steps-list">
                  {selectedKolam.steps.map((step, index) => (
                    <div 
                      key={index}
                      className={`step-item ${index <= animationStep ? 'completed' : ''} ${index === animationStep ? 'active' : ''}`}
                      onClick={() => handleStepSelect(index)}
                    >
                      <div className="step-number">{index + 1}</div>
                      <div className="step-content">
                        <h4>{step.instruction}</h4>
                        <p>{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="tutorial-tips">
              <h3>💡 Drawing Tips</h3>
              <ul>
                <li>Start with light strokes and gradually darken your lines</li>
                <li>Keep your hand steady and move in smooth, flowing motions</li>
                <li>Practice the dot grid first to maintain proper spacing</li>
                <li>Use traditional materials like rice flour for authentic texture</li>
              </ul>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes drawLine {
          to {
            stroke-dashoffset: 0;
          }
        }
        
        .tutorial-card {
          background: var(--bg-secondary);
          border-radius: var(--radius-lg);
          padding: var(--spacing-lg);
          cursor: pointer;
          transition: all var(--transition-normal);
          border: 2px solid transparent;
        }
        
        .tutorial-card:hover {
          border-color: var(--accent-primary);
          transform: translateY(-4px);
          box-shadow: var(--shadow-hover);
        }
        
        .canvas-area {
          background: var(--bg-secondary);
          border-radius: var(--radius-lg);
          padding: var(--spacing-lg);
          margin-bottom: var(--spacing-lg);
        }
        
        .kolam-canvas {
          border: 2px solid var(--border-subtle);
          border-radius: var(--radius-md);
          background: #1A202C;
        }
        
        .steps-panel {
          background: var(--bg-secondary);
          border-radius: var(--radius-lg);
          padding: var(--spacing-lg);
          max-height: 400px;
          overflow-y: auto;
        }
        
        .step-item {
          display: flex;
          gap: var(--spacing-md);
          padding: var(--spacing-md);
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: all var(--transition-normal);
          margin-bottom: var(--spacing-sm);
        }
        
        .step-item:hover {
          background: var(--bg-tertiary);
        }
        
        .step-item.active {
          background: var(--accent-primary);
          color: white;
        }
        
        .step-item.completed .step-number {
          background: var(--success);
        }
        
        .step-number {
          background: var(--bg-tertiary);
          color: var(--text-primary);
          border-radius: 50%;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 0.875rem;
        }
      `}</style>
    </div>
  );
};

export default LearnToDraw;