// Example integration of KolamTypesGrid in App.jsx
// Add this import at the top:
// import KolamTypesGrid from './components/KolamTypesGrid';

// Then you can use it anywhere in your JSX like this:

/* Example 1: Using default sample images */
<KolamTypesGrid />

/* Example 2: Using custom items with actual processing results */
{result && (
  <div className="kolam-processing-steps">
    <h2>Kolam Processing Steps</h2>
    <KolamTypesGrid 
      items={[
        {
          id: 1,
          src: `data:image/png;base64,${result.original_image}`,
          alt: 'Original uploaded kolam image',
          title: 'Original Image'
        },
        {
          id: 2,
          src: `data:image/png;base64,${result.grayscale_image}`,
          alt: 'Grayscale processed kolam',
          title: 'Grayscale'
        },
        {
          id: 3,
          src: `data:image/png;base64,${result.detected_dots}`,
          alt: `Kolam with ${result.num_dots_detected} detected dots`,
          title: `Detected Dots (${result.num_dots_detected})`
        },
        {
          id: 4,
          src: `data:image/png;base64,${result.skeleton_pattern}`,
          alt: 'Mathematical skeleton pattern',
          title: 'Skeleton Pattern'
        },
        {
          id: 5,
          src: `data:image/png;base64,${result.mathematical_curves}`,
          alt: 'Mathematical curves representation',
          title: 'Mathematical Curves'
        },
        {
          id: 6,
          src: `data:image/png;base64,${result.recreated_input}`,
          alt: 'AI enhanced recreation of kolam',
          title: 'Enhanced Recreation'
        }
      ]}
    />
  </div>
)}

/* Example 3: Custom styling with CSS classes */
<div className="my-kolam-gallery">
  <KolamTypesGrid items={customItems} />
</div>