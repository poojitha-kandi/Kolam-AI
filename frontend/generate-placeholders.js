// Simple placeholder images for products
// Since we don't have real product images, we'll use colored placeholders

const products = [
  { id: 1, name: 'Traditional Kolam Stencils', color: '#FF6B6B' },
  { id: 2, name: 'Natural Rice Flour', color: '#4ECDC4' },
  { id: 3, name: 'Colored Rangoli Powder', color: '#45B7D1' },
  { id: 4, name: 'Kolam Design Book', color: '#96CEB4' },
  { id: 5, name: 'Sacred Geometry Compass', color: '#FFEAA7' },
  { id: 6, name: 'Premium Chalk Powder', color: '#DDA0DD' },
  { id: 7, name: 'Kolam Practice Mat', color: '#98D8C8' },
  { id: 8, name: 'Traditional Brass Dots', color: '#F7DC6F' },
  { id: 9, name: 'Kolam Starter Kit', color: '#BB8FCE' }
];

function createPlaceholderSVG(product) {
  return `
<svg width="300" height="300" xmlns="http://www.w3.org/2000/svg">
  <rect width="300" height="300" fill="${product.color}"/>
  <rect x="20" y="20" width="260" height="260" fill="white" opacity="0.1"/>
  <text x="150" y="140" text-anchor="middle" font-family="Arial" font-size="16" fill="white" font-weight="bold">
    ${product.name.substring(0, 20)}${product.name.length > 20 ? '...' : ''}
  </text>
  <text x="150" y="160" text-anchor="middle" font-family="Arial" font-size="14" fill="white">
    Product ${product.id}
  </text>
  <circle cx="150" cy="200" r="30" fill="white" opacity="0.2"/>
  <path d="M130 190 L150 210 L170 190 M140 200 L160 200" stroke="white" stroke-width="3" fill="none"/>
</svg>
  `.trim();
}

products.forEach(product => {
  const svg = createPlaceholderSVG(product);
  console.log(`Creating placeholder for: ${product.name}`);
  // This would be used to generate the actual files
});

console.log('Placeholder SVG generation script ready');