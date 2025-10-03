import React, { useState, useRef, useEffect } from 'react';
import '../App.css';

const LearnToDraw = () => {
  // Game state
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [gameMode, setGameMode] = useState(''); // 'tutorial' or 'freehand'
  const [isDrawing, setIsDrawing] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);
  const [isTutorialPlaying, setIsTutorialPlaying] = useState(false);
  
  // Canvas refs
  const canvasRef = useRef(null);
  const contextRef = useRef(null);

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const context = canvas.getContext('2d');
      context.scale(1, 1);
      context.lineCap = 'round';
      context.strokeStyle = '#FF6B35';
      context.lineWidth = 3;
      contextRef.current = context;
    }
  }, []);

  // Tutorial animation for dot-based patterns
  const dotPatternSteps = [
    { x: 100, y: 100, instruction: "Start from the center dot" },
    { x: 120, y: 80, instruction: "Connect to the upper right" },
    { x: 140, y: 100, instruction: "Move to the right" },
    { x: 120, y: 120, instruction: "Go down and left" },
    { x: 100, y: 100, instruction: "Return to center to complete" }
  ];

  // Handle image upload
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedImage(file);
      const url = URL.createObjectURL(file);
      setImageUrl(url);
      
      // Analyze the image (placeholder logic)
      analyzeImage(file);
    }
  };

  // Placeholder image analysis logic
  const analyzeImage = (file) => {
    const filename = file.name.toLowerCase();
    
    if (filename.includes('dot')) {
      setAnalysisResult({
        type: 'dot-based',
        message: 'Dot Grid Detected! This appears to be a dot-based Kolam pattern.',
        hasDots: true
      });
    } else {
      setAnalysisResult({
        type: 'freehand',
        message: 'Free-hand Pattern Detected! This appears to be a flowing design.',
        hasDots: false
      });
    }
  };

  // Start drawing mode
  const startDrawMode = (mode) => {
    setGameMode(mode);
    const canvas = canvasRef.current;
    const context = contextRef.current;
    
    // Clear canvas
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    // If dot-based and we have dots, draw the dot grid
    if (analysisResult?.hasDots && mode === 'freehand') {
      drawDotGrid();
    }
    
    if (mode === 'tutorial' && analysisResult?.hasDots) {
      setTutorialStep(0);
      drawDotGrid();
      startTutorial();
    }
  };

  // Draw dot grid on canvas
  const drawDotGrid = () => {
    const context = contextRef.current;
    const canvas = canvasRef.current;
    
    context.fillStyle = '#4A5568';
    const rows = 7;
    const cols = 7;
    const spacing = 40;
    const offsetX = canvas.width / 2 - (cols * spacing) / 2;
    const offsetY = canvas.height / 2 - (rows * spacing) / 2;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        context.beginPath();
        context.arc(
          offsetX + col * spacing,
          offsetY + row * spacing,
          3,
          0,
          2 * Math.PI
        );
        context.fill();
      }
    }
  };

  // Start tutorial animation
  const startTutorial = () => {
    setIsTutorialPlaying(true);
    setTutorialStep(0);
    animateTutorialStep(0);
  };

  // Animate tutorial steps
  const animateTutorialStep = (step) => {
    if (step >= dotPatternSteps.length) {
      setIsTutorialPlaying(false);
      return;
    }

    const context = contextRef.current;
    const currentStep = dotPatternSteps[step];
    const canvas = canvasRef.current;
    const offsetX = canvas.width / 2;
    const offsetY = canvas.height / 2;

    // Draw line to current step
    if (step > 0) {
      const prevStep = dotPatternSteps[step - 1];
      context.beginPath();
      context.moveTo(
        offsetX + prevStep.x - 100,
        offsetY + prevStep.y - 100
      );
      context.lineTo(
        offsetX + currentStep.x - 100,
        offsetY + currentStep.y - 100
      );
      context.stroke();
    }

    setTimeout(() => {
      setTutorialStep(step + 1);
      animateTutorialStep(step + 1);
    }, 1500);
  };

  // Mouse drawing functions
  const startDrawing = ({ nativeEvent }) => {
    if (gameMode !== 'freehand') return;
    
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  };

  const finishDrawing = () => {
    contextRef.current.closePath();
    setIsDrawing(false);
  };

  const draw = ({ nativeEvent }) => {
    if (!isDrawing || gameMode !== 'freehand') return;
    
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();
  };

  // Clear canvas
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = contextRef.current;
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    if (analysisResult?.hasDots && gameMode === 'freehand') {
      drawDotGrid();
    }
  };

  return (
    <div className="learn-to-draw-page min-h-screen bg-gradient-to-br from-orange-50 to-purple-50 p-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            🎨 Learn to Draw Kolam
          </h1>
          <p className="text-gray-600 text-lg">
            Upload an image and learn step-by-step or practice drawing freely
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Panel - Upload & Analysis */}
          <div className="space-y-6">
            {/* Upload Section */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                📤 Upload Kolam Image
              </h2>
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-orange-400 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer block"
                >
                  <div className="text-4xl mb-4">📸</div>
                  <p className="text-gray-600 mb-2">
                    Click to upload an image or drag and drop
                  </p>
                  <p className="text-sm text-gray-500">
                    Supports JPG, PNG files
                  </p>
                </label>
              </div>

              {/* Uploaded Image Display */}
              {uploadedImage && (
                <div className="mt-4">
                  <h3 className="font-semibold text-gray-700 mb-2">Uploaded Image:</h3>
                  <div className="border rounded-lg overflow-hidden">
                    <img
                      src={imageUrl}
                      alt="Uploaded Kolam"
                      className="w-full h-48 object-cover"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Analysis Results */}
            {analysisResult && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  🔍 Analysis Results
                </h2>
                
                <div className={`p-4 rounded-lg mb-4 ${
                  analysisResult.hasDots 
                    ? 'bg-green-100 border border-green-300' 
                    : 'bg-blue-100 border border-blue-300'
                }`}>
                  <p className="font-medium text-gray-800">
                    {analysisResult.message}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  {analysisResult.hasDots && (
                    <button
                      onClick={() => startDrawMode('tutorial')}
                      className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300"
                    >
                      🎯 Start Tutorial
                    </button>
                  )}
                  <button
                    onClick={() => startDrawMode('freehand')}
                    className="flex-1 bg-gradient-to-r from-orange-500 to-purple-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-orange-600 hover:to-purple-700 transition-all duration-300"
                  >
                    ✏️ Draw Freely
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Panel - Drawing Canvas */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold text-gray-800">
                  🎨 Drawing Canvas
                </h2>
                
                {gameMode && (
                  <div className="flex gap-2">
                    <button
                      onClick={clearCanvas}
                      className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      Clear
                    </button>
                  </div>
                )}
              </div>

              {/* Canvas */}
              <div className="border-2 border-gray-200 rounded-lg overflow-hidden">
                <canvas
                  ref={canvasRef}
                  width={600}
                  height={400}
                  className="w-full h-96 cursor-crosshair"
                  onMouseDown={startDrawing}
                  onMouseUp={finishDrawing}
                  onMouseMove={draw}
                  style={{ backgroundColor: '#f9f9f9' }}
                />
              </div>

              {/* Tutorial Status */}
              {gameMode === 'tutorial' && (
                <div className="mt-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h3 className="font-semibold text-green-800 mb-2">
                      Tutorial Mode Active
                    </h3>
                    <p className="text-green-700">
                      {isTutorialPlaying
                        ? `Step ${tutorialStep + 1}: ${
                            dotPatternSteps[tutorialStep]?.instruction || 'Tutorial complete!'
                          }`
                        : 'Tutorial completed! Try drawing freely now.'
                      }
                    </p>
                    
                    {!isTutorialPlaying && tutorialStep > 0 && (
                      <button
                        onClick={startTutorial}
                        className="mt-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                      >
                        Replay Tutorial
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Drawing Instructions */}
              {gameMode === 'freehand' && (
                <div className="mt-4">
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <h3 className="font-semibold text-orange-800 mb-2">
                      Free Drawing Mode
                    </h3>
                    <p className="text-orange-700">
                      {analysisResult?.hasDots
                        ? 'Connect the dots to create your Kolam pattern!'
                        : 'Draw freely to create your own unique design!'
                      }
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearnToDraw;