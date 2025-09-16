import React from 'react';

const MandalaGallery = ({ onMandalaSelect, selectedMandala }) => {
  // Sample mandala designs (we'll create these SVGs)
  const mandalaDesigns = [
    {
      id: 'mandala1',
      name: 'Lotus Mandala',
      thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iNTAiIGN5PSI1MCIgcj0iNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzMzMzMzMyIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9zdmc+',
      svg: `
        <svg width="400" height="400" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
          <g transform="translate(200,200)">
            <!-- Center circle -->
            <circle cx="0" cy="0" r="20" fill="none" stroke="#333" stroke-width="2" class="mandala-section" data-section="center"/>
            
            <!-- Inner petals -->
            <g class="inner-petals">
              ${Array.from({length: 8}, (_, i) => {
                const angle = (i * 45) * Math.PI / 180;
                const x1 = Math.cos(angle) * 25;
                const y1 = Math.sin(angle) * 25;
                const x2 = Math.cos(angle) * 50;
                const y2 = Math.sin(angle) * 50;
                return `<path d="M ${x1} ${y1} Q ${x2} ${y2} ${x1 + Math.cos(angle + Math.PI/4) * 15} ${y1 + Math.sin(angle + Math.PI/4) * 15} Q ${x1} ${y1} ${x1 + Math.cos(angle - Math.PI/4) * 15} ${y1 + Math.sin(angle - Math.PI/4) * 15} Z" fill="none" stroke="#333" stroke-width="2" class="mandala-section" data-section="inner-petal-${i}"/>`;
              }).join('')}
            </g>
            
            <!-- Middle ring -->
            <circle cx="0" cy="0" r="80" fill="none" stroke="#333" stroke-width="2" class="mandala-section" data-section="middle-ring"/>
            
            <!-- Outer petals -->
            <g class="outer-petals">
              ${Array.from({length: 12}, (_, i) => {
                const angle = (i * 30) * Math.PI / 180;
                const x1 = Math.cos(angle) * 85;
                const y1 = Math.sin(angle) * 85;
                const x2 = Math.cos(angle) * 120;
                const y2 = Math.sin(angle) * 120;
                return `<path d="M ${x1} ${y1} Q ${x2} ${y2} ${x1 + Math.cos(angle + Math.PI/6) * 20} ${y1 + Math.sin(angle + Math.PI/6) * 20} Q ${x1} ${y1} ${x1 + Math.cos(angle - Math.PI/6) * 20} ${y1 + Math.sin(angle - Math.PI/6) * 20} Z" fill="none" stroke="#333" stroke-width="2" class="mandala-section" data-section="outer-petal-${i}"/>`;
              }).join('')}
            </g>
            
            <!-- Outer circle -->
            <circle cx="0" cy="0" r="150" fill="none" stroke="#333" stroke-width="2" class="mandala-section" data-section="outer-circle"/>
          </g>
        </svg>
      `
    },
    {
      id: 'mandala2',
      name: 'Geometric Mandala',
      thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3QgeD0iMjUiIHk9IjI1IiB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzMzMzMzMyIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9zdmc+',
      svg: `
        <svg width="400" height="400" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
          <g transform="translate(200,200)">
            <!-- Center square -->
            <rect x="-15" y="-15" width="30" height="30" fill="none" stroke="#333" stroke-width="2" class="mandala-section" data-section="center-square"/>
            
            <!-- Inner triangles -->
            <g class="inner-triangles">
              ${Array.from({length: 4}, (_, i) => {
                const rotation = i * 90;
                return `<g transform="rotate(${rotation})">
                  <polygon points="0,-25 -20,-50 20,-50" fill="none" stroke="#333" stroke-width="2" class="mandala-section" data-section="inner-triangle-${i}"/>
                </g>`;
              }).join('')}
            </g>
            
            <!-- Middle squares -->
            <g class="middle-squares">
              ${Array.from({length: 4}, (_, i) => {
                const rotation = i * 90;
                return `<g transform="rotate(${rotation})">
                  <rect x="-10" y="-70" width="20" height="20" fill="none" stroke="#333" stroke-width="2" class="mandala-section" data-section="middle-square-${i}"/>
                </g>`;
              }).join('')}
            </g>
            
            <!-- Outer diamonds -->
            <g class="outer-diamonds">
              ${Array.from({length: 8}, (_, i) => {
                const rotation = i * 45;
                return `<g transform="rotate(${rotation})">
                  <polygon points="0,-100 -15,-120 0,-140 15,-120" fill="none" stroke="#333" stroke-width="2" class="mandala-section" data-section="outer-diamond-${i}"/>
                </g>`;
              }).join('')}
            </g>
            
            <!-- Outer ring -->
            <circle cx="0" cy="0" r="160" fill="none" stroke="#333" stroke-width="2" class="mandala-section" data-section="outer-ring"/>
          </g>
        </svg>
      `
    },
    {
      id: 'mandala3',
      name: 'Star Mandala',
      thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBvbHlnb24gcG9pbnRzPSI1MCwxMCA2MSwzNSA4NSwzNSA2Niw1NSA3Niw4MCA1MCw2NSAyNCw4MCAzNCw1NSAxNSwzNSAzOSwzNSIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMzMzMzMzIiBzdHJva2Utd2lkdGg9IjIiLz48L3N2Zz4=',
      svg: `
        <svg width="400" height="400" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
          <g transform="translate(200,200)">
            <!-- Center star -->
            <polygon points="0,-20 6,-6 20,-6 10,2 16,16 0,8 -16,16 -10,2 -20,-6 -6,-6" fill="none" stroke="#333" stroke-width="2" class="mandala-section" data-section="center-star"/>
            
            <!-- Inner stars -->
            <g class="inner-stars">
              ${Array.from({length: 6}, (_, i) => {
                const angle = i * 60;
                const x = Math.cos(angle * Math.PI / 180) * 50;
                const y = Math.sin(angle * Math.PI / 180) * 50;
                return `<g transform="translate(${x},${y}) rotate(${angle})">
                  <polygon points="0,-15 4,-4 15,-4 7,2 11,13 0,6 -11,13 -7,2 -15,-4 -4,-4" fill="none" stroke="#333" stroke-width="2" class="mandala-section" data-section="inner-star-${i}"/>
                </g>`;
              }).join('')}
            </g>
            
            <!-- Middle ring -->
            <circle cx="0" cy="0" r="100" fill="none" stroke="#333" stroke-width="2" class="mandala-section" data-section="middle-ring"/>
            
            <!-- Outer stars -->
            <g class="outer-stars">
              ${Array.from({length: 12}, (_, i) => {
                const angle = i * 30;
                const x = Math.cos(angle * Math.PI / 180) * 130;
                const y = Math.sin(angle * Math.PI / 180) * 130;
                return `<g transform="translate(${x},${y}) rotate(${angle})">
                  <polygon points="0,-12 3,-3 12,-3 6,1 9,10 0,5 -9,10 -6,1 -12,-3 -3,-3" fill="none" stroke="#333" stroke-width="2" class="mandala-section" data-section="outer-star-${i}"/>
                </g>`;
              }).join('')}
            </g>
            
            <!-- Outer boundary -->
            <circle cx="0" cy="0" r="170" fill="none" stroke="#333" stroke-width="3" class="mandala-section" data-section="boundary"/>
          </g>
        </svg>
      `
    }
  ];

  return (
    <div className="space-y-4">
      {mandalaDesigns.map((mandala) => (
        <div
          key={mandala.id}
          className={`border-2 rounded-lg p-3 cursor-pointer transition-all duration-200 hover:shadow-md ${
            selectedMandala?.id === mandala.id
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}
          onClick={() => onMandalaSelect(mandala)}
        >
          <div className="aspect-square mb-2 bg-gray-50 rounded flex items-center justify-center overflow-hidden">
            <img
              src={mandala.thumbnail}
              alt={mandala.name}
              className="w-full h-full object-contain"
            />
          </div>
          <h3 className="text-sm font-medium text-gray-800 text-center">
            {mandala.name}
          </h3>
        </div>
      ))}
    </div>
  );
};

export default MandalaGallery;