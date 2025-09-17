# ExactKolamAnimator Component

A React component that provides precise path-based animation reproduction of kolam patterns using actual SVG geometry.

## Features

### 🎯 **Exact Reproduction**
- Uses actual SVG path elements as source-of-truth
- Preserves original geometry and proportions
- No arbitrary pattern generation - only animates existing paths

### 🔄 **Input Support**
- **SVG Input**: Direct SVG code paste with real-time preview
- **Image Upload**: Raster images (PNG/JPG) with vectorization
- **Backend Integration**: Accepts vectorized SVG from processing pipeline

### 🧠 **Intelligent Path Ordering**
- **Nearest Neighbor**: Human-like drawing sequence
- **Longest First**: Animate major paths before details
- **Original Order**: Preserve SVG element order
- **Gap Connection**: Automatically connects nearby endpoints

### 🎮 **Animation Controls**
- Variable speed (0.5x to 3x)
- Pause/Resume functionality
- Animated brush cursor following drawing
- Real-time progress indicator
- Stroke dash animation with smooth transitions

### 📱 **User Experience**
- Responsive design (mobile/tablet/desktop)
- Touch-friendly controls
- Keyboard accessibility
- Export animated SVG for verification
- Error handling and validation

## Implementation Details

### Core Functions

```javascript
// Converts all SVG elements (circles, rects, etc.) to <path> elements
prepareSvgForAnimation(svgRoot)

// Calculates optimal drawing order using geometric heuristics
computeStrokeOrder(paths) 

// Connects nearby path endpoints for continuous strokes
connectGaps(paths, tolerancePx)

// Animates paths sequentially with anime.js
animatePaths(orderedPaths)
```

### Path Processing Pipeline

1. **Normalization**: Convert all shapes to `<path>` elements
2. **Stroke Preparation**: Ensure visible strokes for animation
3. **Ordering**: Apply human-like drawing sequence
4. **Gap Connection**: Merge nearby endpoints (optional)
5. **Animation Setup**: Configure `strokeDasharray`/`strokeDashoffset`
6. **Sequential Playback**: Animate paths with overlap timing

### Animation Technique

Uses SVG stroke-dasharray animation:
```javascript
// Setup
path.style.strokeDasharray = totalLength;
path.style.strokeDashoffset = totalLength;

// Animate 
anime({
  targets: path,
  strokeDashoffset: [totalLength, 0],
  duration: calculatedDuration
});
```

## Usage

### Basic Usage
```jsx
import ExactKolamAnimator from './components/ExactKolamAnimator';

// Standalone with built-in example
<ExactKolamAnimator />
```

### With Custom SVG
```jsx
const kolamSvg = `
  <svg width="300" height="300" viewBox="0 0 300 300">
    <circle cx="150" cy="150" r="100" stroke="#000" fill="none"/>
    <path d="M50 150 L250 150 M150 50 L150 250" stroke="#000"/>
  </svg>
`;

<ExactKolamAnimator initialSvg={kolamSvg} />
```

### Integration with Upload Flow
```jsx
// After image processing
if (result.vectorized_svg) {
  return <ExactKolamAnimator svgData={result.vectorized_svg} />;
}
```

## Dependencies

- **animejs**: Path animation engine
- **React**: UI framework (hooks for state management)
- **SVG APIs**: `getTotalLength()`, `getPointAtLength()` for path calculation

## File Structure

```
ExactKolamAnimator.jsx      # Main component
ExactKolamAnimator.css      # Styling and responsive design
ExactKolamAnimator-integration.js  # Usage examples
```

## Browser Support

- **Modern Browsers**: Chrome 80+, Firefox 75+, Safari 13+, Edge 80+
- **SVG Requirements**: Full SVG 1.1 support needed
- **Animation**: CSS transitions and anime.js compatibility
- **Touch**: Mobile gesture support included

## Performance

- **Bundle Size**: ~45KB (with anime.js)
- **Animation**: Hardware-accelerated CSS transforms
- **Memory**: Efficient path caching and cleanup
- **Scalability**: Handles up to ~100 paths smoothly

## Backend Integration

For optimal results, backend should provide:
```json
{
  "vectorized_svg": "<svg>...</svg>",
  "path_order": ["path1", "path2", ...],
  "stroke_metadata": {
    "colors": ["#000", "#red"],
    "widths": [2, 3],
    "styles": ["solid", "dashed"]
  }
}
```

This ensures exact reproduction of processed kolam patterns with preserved styling and intended drawing order.