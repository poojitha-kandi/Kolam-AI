import cv2
import numpy as np
import io
import base64
import os
from datetime import datetime
from PIL import Image
from collections import deque
import math

class KolamAIProcessor:
    """
    Complete Kolam AI processing pipeline following the notebook steps:
    1. Upload Image
    2. Preprocessing (grayscale, threshold)
    3. Circle/Dot Detection (Hough Transform)
    4. Skeletonization
    5. Noise Removal & Cleanup
    6. Tracing Kolam Path
    7. Mathematical Kolam Simulation (Lissajous)
    8. Grid Size Analysis
    9. Final Output & Visualization
    """
    
    def __init__(self):
        self.original_img = None
        self.gray_img = None
        self.binary_img = None
        self.detected_dots = []
        self.skeleton_img = None
        self.grid_size = None
        self.processed_results = {}
    
    def step1_upload_image(self, image_bytes):
        """Step 1: Upload and read image"""
        nparr = np.frombuffer(image_bytes, np.uint8)
        self.original_img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        print(f"✓ Step 1: Image uploaded - Shape: {self.original_img.shape}")
        return self.original_img
    
    def step2_preprocessing(self):
        """Step 2: Convert to grayscale and apply binary thresholding"""
        # Convert to grayscale
        self.gray_img = cv2.cvtColor(self.original_img, cv2.COLOR_BGR2GRAY)
        
        # Apply binary thresholding
        _, self.binary_img = cv2.threshold(self.gray_img, 127, 255, cv2.THRESH_BINARY_INV)
        
        print("✓ Step 2: Preprocessing complete - Grayscale & Binary threshold applied")
        return self.gray_img, self.binary_img
    
    def step3_detect_dots(self):
        """Step 3: Precise Kolam Dot Detection - Based on proven notebook algorithm"""
        print("🎯 Detecting Kolam dots using notebook-proven algorithm...")
        
        height, width = self.gray_img.shape
        
        # Use the exact same approach as the working notebook
        # Apply median blur for noise reduction (same as notebook)
        blurred = cv2.medianBlur(self.gray_img, 5)
        
        # Use Hough Circle Transform with notebook-proven parameters
        circles = cv2.HoughCircles(
            self.gray_img,  # Use grayscale directly (like notebook)
            cv2.HOUGH_GRADIENT,
            dp=1,
            minDist=20,     # Same as notebook
            param1=50,      # Same as notebook  
            param2=12,      # Same as notebook - key parameter for sensitivity
            minRadius=5,    # Same as notebook
            maxRadius=15    # Same as notebook
        )
        
        self.detected_dots = []
        
        if circles is not None:
            # Convert the circle parameters to integers (same as notebook)
            circles = np.uint16(np.around(circles))
            
            print(f"📊 Hough Circles found: {len(circles[0])} dots using notebook parameters")
            
            # Simple filtering to ensure quality dots
            candidate_dots = []
            
            for i in circles[0, :]:
                x, y, r = int(i[0]), int(i[1]), int(i[2])
                
                # Basic edge margin check
                edge_margin = 15
                if (edge_margin <= x <= width - edge_margin and 
                    edge_margin <= y <= height - edge_margin):
                    
                    # Basic quality check - ensure it's in a reasonable area
                    roi_size = max(r * 2, 10)
                    x1, y1 = max(0, x - roi_size), max(0, y - roi_size)
                    x2, y2 = min(width, x + roi_size), min(height, y + roi_size)
                    
                    if x2 > x1 and y2 > y1:
                        roi = self.gray_img[y1:y2, x1:x2]
                        roi_std = np.std(roi)
                        
                        # Only require minimal contrast (more permissive)
                        if roi_std > 5:  # Very low threshold
                            candidate_dots.append((x, y, r, roi_std))
            
            # Sort by quality (contrast) but keep most dots
            candidate_dots.sort(key=lambda dot: dot[3], reverse=True)
            
            # Apply minimal spacing constraints - more permissive than before
            final_dots = []
            min_spacing = 15  # Reduced minimum spacing
            
            for x, y, r, quality in candidate_dots:
                # Check spacing from already selected dots
                valid_spacing = True
                for fx, fy, fr in final_dots:
                    distance = np.sqrt((x - fx)**2 + (y - fy)**2)
                    if distance < min_spacing:
                        valid_spacing = False
                        break
                
                if valid_spacing:
                    final_dots.append((x, y, r))
            
            self.detected_dots = final_dots
            
        else:
            print("❌ No circles detected with notebook parameters")
            
            # Fallback: Try with even more sensitive parameters
            print("🔄 Trying more sensitive detection...")
            
            circles_sensitive = cv2.HoughCircles(
                blurred,
                cv2.HOUGH_GRADIENT,
                dp=1,
                minDist=15,     # Reduced min distance
                param1=30,      # Lower edge threshold
                param2=8,       # Even lower accumulator threshold
                minRadius=3,    # Smaller minimum radius
                maxRadius=20    # Larger maximum radius
            )
            
            if circles_sensitive is not None:
                circles_sensitive = np.uint16(np.around(circles_sensitive))
                print(f"📊 Sensitive detection found: {len(circles_sensitive[0])} dots")
                
                # Take the best dots from sensitive detection
                for i in circles_sensitive[0, :]:
                    x, y, r = int(i[0]), int(i[1]), int(i[2])
                    
                    edge_margin = 10
                    if (edge_margin <= x <= width - edge_margin and 
                        edge_margin <= y <= height - edge_margin):
                        self.detected_dots.append((x, y, r))
                        
                        if len(self.detected_dots) >= 9:  # Limit to 9 dots
                            break
            
            # Final fallback: Use grid estimation if still no dots
            if len(self.detected_dots) == 0:
                print("🔄 Final fallback: Grid estimation...")
                
                # Create a 3x3 grid estimation
                margin = min(width, height) // 6
                grid_width = width - 2 * margin
                grid_height = height - 2 * margin
                
                for i in range(3):
                    for j in range(3):
                        x = margin + (grid_width * (i + 1)) // 4
                        y = margin + (grid_height * (j + 1)) // 4
                        r = max(5, min(width, height) // 60)
                        self.detected_dots.append((x, y, r))
        
        # Ensure we don't have too many dots (limit to reasonable number)
        if len(self.detected_dots) > 12:
            # Keep the first 12 dots (they're already sorted by quality)
            self.detected_dots = self.detected_dots[:12]
        
        print(f"✅ Step 3: Notebook-based dot detection complete - Found {len(self.detected_dots)} dots")
        print(f"   📍 Dot positions: {[(x, y) for x, y, r in self.detected_dots[:3]]}{'...' if len(self.detected_dots) > 3 else ''}")
        
        return self.detected_dots
    
    def debug_dot_detection(self, save_debug_images=True):
        """Debug function to visualize dot detection process"""
        if self.gray_img is None:
            print("❌ No grayscale image available for debugging")
            return
        
        print("🔬 Debug: Creating dot detection visualization...")
        
        height, width = self.gray_img.shape
        
        # Create debug visualization
        debug_img = cv2.cvtColor(self.gray_img, cv2.COLOR_GRAY2BGR)
        
        # Draw all detected dots with different colors based on quality
        for i, (x, y, r) in enumerate(self.detected_dots):
            # Color based on detection order (quality ranking)
            if i == 0:
                color = (0, 255, 0)      # Best quality: Green
            elif i < 3:
                color = (0, 255, 255)    # High quality: Yellow
            elif i < 6:
                color = (255, 165, 0)    # Medium quality: Orange
            else:
                color = (255, 0, 255)    # Lower quality: Magenta
            
            # Draw detection circle
            cv2.circle(debug_img, (x, y), r + 3, color, 2)
            cv2.circle(debug_img, (x, y), 3, (0, 0, 255), -1)  # Red center
            
            # Add number label
            cv2.putText(debug_img, str(i+1), (x-10, y-r-10), cv2.FONT_HERSHEY_SIMPLEX, 0.6, color, 2)
        
        # Add statistics text
        text_lines = [
            f"Total Dots Detected: {len(self.detected_dots)}",
            f"Image Size: {width}x{height}",
            f"Grid Estimate: {self.grid_size}x{self.grid_size}" if self.grid_size else "Grid: Not calculated"
        ]
        
        for i, line in enumerate(text_lines):
            cv2.putText(debug_img, line, (10, 30 + i*25), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)
        
        if save_debug_images:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            debug_filename = f"debug_dots_{timestamp}.png"
            debug_path = os.path.join("generated_images", debug_filename)
            cv2.imwrite(debug_path, debug_img)
            print(f"💾 Debug image saved: {debug_path}")
        
        return debug_img
    
    def step4_skeletonization(self):
        """Step 4: Skeletonization to thin lines to single-pixel width using OpenCV"""
        # Invert binary image for skeletonization
        inverted = cv2.bitwise_not(self.binary_img)
        
        # OpenCV-based skeletonization using morphological operations
        skeleton = np.zeros(inverted.shape, np.uint8)
        kernel = cv2.getStructuringElement(cv2.MORPH_CROSS, (3, 3))
        
        while True:
            # Erode the image
            eroded = cv2.erode(inverted, kernel)
            # Dilate the eroded image
            opened = cv2.dilate(eroded, kernel)
            # Subtract the opened image from the original
            subset = cv2.subtract(inverted, opened)
            # Union of skeleton and subset
            skeleton = cv2.bitwise_or(skeleton, subset)
            # Update inverted image
            inverted = eroded.copy()
            
            # If the image is completely eroded, break
            if cv2.countNonZero(inverted) == 0:
                break
        
        self.skeleton_img = skeleton
        
        print("✓ Step 4: Skeletonization complete - Lines thinned using OpenCV morphology")
        return self.skeleton_img
    
    def step5_noise_removal(self):
        """Step 5: Noise removal and cleanup using morphological operations"""
        # Define kernel for morphological operations
        kernel = np.ones((3, 3), np.uint8)
        
        # Apply opening (erosion followed by dilation) to remove noise
        opened = cv2.morphologyEx(self.binary_img, cv2.MORPH_OPEN, kernel)
        
        # Apply closing (dilation followed by erosion) to close gaps
        closed = cv2.morphologyEx(opened, cv2.MORPH_CLOSE, kernel)
        
        # Update binary image with cleaned version
        self.binary_img = closed
        
        print("✓ Step 5: Noise removal complete - Morphological operations applied")
        return closed
    
    def step6_trace_kolam_path(self):
        """Step 6: Trace continuous paths using BFS/DFS approach"""
        def find_connected_components(skeleton):
            """Find connected components in skeleton image"""
            visited = np.zeros_like(skeleton, dtype=bool)
            components = []
            
            directions = [(-1,-1), (-1,0), (-1,1), (0,-1), (0,1), (1,-1), (1,0), (1,1)]
            
            for i in range(skeleton.shape[0]):
                for j in range(skeleton.shape[1]):
                    if skeleton[i,j] > 0 and not visited[i,j]:
                        # Start BFS from this point
                        component = []
                        queue = deque([(i,j)])
                        visited[i,j] = True
                        
                        while queue:
                            y, x = queue.popleft()
                            component.append((x, y))
                            
                            # Check 8-connected neighbors
                            for dy, dx in directions:
                                ny, nx = y + dy, x + dx
                                if (0 <= ny < skeleton.shape[0] and 
                                    0 <= nx < skeleton.shape[1] and
                                    skeleton[ny, nx] > 0 and 
                                    not visited[ny, nx]):
                                    visited[ny, nx] = True
                                    queue.append((ny, nx))
                        
                        if len(component) > 10:  # Only keep significant components
                            components.append(component)
            
            return components
        
        traced_paths = find_connected_components(self.skeleton_img)
        print(f"✓ Step 6: Path tracing complete - Found {len(traced_paths)} continuous paths")
        return traced_paths
    
    def step7_mathematical_simulation(self):
        """Step 7: Mathematical Kolam simulation using enhanced Lissajous curves"""
        if self.grid_size is None:
            self.grid_size = max(3, int(np.sqrt(len(self.detected_dots))) if self.detected_dots else 3)
        
        def generate_kolam_lissajous(grid_size, pattern_type=1):
            """Generate Kolam-style Lissajous curves with different patterns"""
            t = np.linspace(0, 4 * np.pi, 2000)
            
            if pattern_type == 1:
                # Primary interwoven pattern
                a, b = grid_size, grid_size - 1
                delta = np.pi / 2
            elif pattern_type == 2:
                # Secondary supporting pattern
                a, b = grid_size + 1, grid_size
                delta = 0
            else:
                # Tertiary decorative pattern
                a, b = grid_size - 1, grid_size + 1
                delta = np.pi / 4
            
            x = np.sin(a * t + delta)
            y = np.sin(b * t)
            
            return list(zip(x, y))
        
        # Generate multiple complementary patterns
        patterns = []
        for i in range(3):
            pattern = generate_kolam_lissajous(self.grid_size, i + 1)
            patterns.append(pattern)
        
        print(f"✓ Step 7: Mathematical simulation complete - Generated {len(patterns)} enhanced Lissajous patterns")
        return patterns
    
    def step8_grid_analysis(self):
        """Step 8: Analyze grid structure from detected dots"""
        if not self.detected_dots:
            self.grid_size = 3
            return self.grid_size
        
        # Extract dot positions
        dot_positions = [(x, y) for x, y, r in self.detected_dots]
        
        if len(dot_positions) < 4:
            self.grid_size = max(2, int(np.sqrt(len(dot_positions))))
        else:
            # Estimate grid size based on dot distribution
            x_coords = [pos[0] for pos in dot_positions]
            y_coords = [pos[1] for pos in dot_positions]
            
            # Calculate approximate grid dimensions
            x_range = max(x_coords) - min(x_coords)
            y_range = max(y_coords) - min(y_coords)
            
            # Estimate based on spacing
            if len(dot_positions) > 1:
                # Sort by x to find horizontal spacing
                sorted_x = sorted(set([int(x/20)*20 for x in x_coords]))  # Quantize to reduce noise
                if len(sorted_x) > 1:
                    avg_spacing = np.mean(np.diff(sorted_x))
                    estimated_cols = max(2, int(x_range / avg_spacing) + 1) if avg_spacing > 0 else int(np.sqrt(len(dot_positions)))
                else:
                    estimated_cols = int(np.sqrt(len(dot_positions)))
                
                self.grid_size = max(2, min(estimated_cols, int(np.sqrt(len(dot_positions)) + 1)))
            else:
                self.grid_size = int(np.sqrt(len(dot_positions)))
        
        print(f"✓ Step 8: Grid analysis complete - Estimated grid size: {self.grid_size}x{self.grid_size}")
        return self.grid_size
    
    def step9_final_visualization(self):
        """Step 9: Create final output combining all elements using OpenCV"""
        # Create a comprehensive visualization using OpenCV
        
        # Resize all images to the same size for consistent display
        height, width = 400, 400
        
        # Prepare images - include both grayscale and binary
        original_resized = cv2.resize(self.original_img, (width, height))
        grayscale_resized = cv2.resize(self.gray_img, (width, height))  # Use grayscale instead of binary
        binary_resized = cv2.resize(self.binary_img, (width, height))
        skeleton_resized = cv2.resize(self.skeleton_img, (width, height))
        
        # Create dots visualization with improved visibility and correct positioning
        dots_img = original_resized.copy()
        
        # Get original image dimensions
        orig_height, orig_width = self.original_img.shape[:2]
        
        print(f"Debug: Original image size: {orig_width}x{orig_height}, Resized: {width}x{height}")
        
        for i, (x, y, r) in enumerate(self.detected_dots):
            # Correctly scale coordinates from original image to resized image
            x_scaled = int(x * width / orig_width)
            y_scaled = int(y * height / orig_height)
            r_scaled = max(3, int(r * width / orig_width))
            
            # Ensure coordinates are within bounds
            x_scaled = max(0, min(x_scaled, width - 1))
            y_scaled = max(0, min(y_scaled, height - 1))
            
            if i < 5:  # Debug first 5 dots
                print(f"Debug dot {i}: orig({x},{y}) -> scaled({x_scaled},{y_scaled})")
            
            # Draw multiple circles for better visibility
            cv2.circle(dots_img, (x_scaled, y_scaled), r_scaled + 4, (0, 255, 0), 3)  # Green outer circle
            cv2.circle(dots_img, (x_scaled, y_scaled), r_scaled, (255, 255, 255), -1)  # White filled circle
            cv2.circle(dots_img, (x_scaled, y_scaled), r_scaled, (0, 0, 255), 2)       # Blue outline
            cv2.circle(dots_img, (x_scaled, y_scaled), 3, (255, 0, 0), -1)             # Red center dot
        
        # Create mathematical simulation visualization with proper Kolam patterns
        math_img = np.zeros((height, width, 3), dtype=np.uint8)
        math_img.fill(40)  # Dark gray background instead of black
        
        # Draw Lissajous pattern with improved visibility
        if self.grid_size > 0:
            # Generate more points for smoother curves
            t = np.linspace(0, 4 * np.pi, 2000)  # More points and longer curve
            
            # Create mathematical Kolam patterns based on grid size
            center_x, center_y = width // 2, height // 2
            scale = min(width, height) // 3
            
            # Pattern 1: Main Lissajous curve (Purple)
            a, b = self.grid_size, self.grid_size - 1
            x_liss1 = center_x + scale * np.sin(a * t + np.pi/2)
            y_liss1 = center_y + scale * np.sin(b * t)
            
            # Pattern 2: Secondary curve (Cyan)
            x_liss2 = center_x + scale * 0.8 * np.sin((a+1) * t)
            y_liss2 = center_y + scale * 0.8 * np.sin(b * t + np.pi/4)
            
            # Pattern 3: Tertiary curve (Yellow)
            x_liss3 = center_x + scale * 0.6 * np.sin(a * t + np.pi/3)
            y_liss3 = center_y + scale * 0.6 * np.sin((b+1) * t + np.pi/6)
            
            patterns = [
                (x_liss1, y_liss1, (255, 100, 255), 3),  # Purple, thick
                (x_liss2, y_liss2, (100, 255, 255), 2),  # Cyan, medium
                (x_liss3, y_liss3, (255, 255, 100), 2)   # Yellow, medium
            ]
            
            for x_curve, y_curve, color, thickness in patterns:
                # Convert to integer coordinates and ensure bounds
                x_scaled = np.clip(x_curve.astype(int), 0, width-1)
                y_scaled = np.clip(y_curve.astype(int), 0, height-1)
                
                # Draw the curve
                for i in range(len(x_scaled) - 1):
                    cv2.line(math_img, (x_scaled[i], y_scaled[i]), (x_scaled[i+1], y_scaled[i+1]), color, thickness)
            
            # Add strategic grid dots based on actual Kolam structure (not a full grid)
            if self.grid_size >= 3:
                # Only add key intersection points, not every grid point
                key_points = [
                    (center_x, center_y),  # Center
                    (center_x - scale//2, center_y - scale//2),  # Top-left
                    (center_x + scale//2, center_y - scale//2),  # Top-right
                    (center_x - scale//2, center_y + scale//2),  # Bottom-left
                    (center_x + scale//2, center_y + scale//2),  # Bottom-right
                ]
                
                # Add some intermediate points for larger grids
                if self.grid_size >= 4:
                    key_points.extend([
                        (center_x, center_y - scale//2),  # Top-center
                        (center_x, center_y + scale//2),  # Bottom-center
                        (center_x - scale//2, center_y),  # Left-center
                        (center_x + scale//2, center_y),  # Right-center
                    ])
                
                # Draw key dots
                for x_dot, y_dot in key_points:
                    if 0 <= x_dot < width and 0 <= y_dot < height:
                        cv2.circle(math_img, (x_dot, y_dot), 8, (255, 255, 255), -1)
                        cv2.circle(math_img, (x_dot, y_dot), 8, (0, 0, 0), 2)
                        cv2.circle(math_img, (x_dot, y_dot), 3, (255, 0, 0), -1)
        
        # Create enhanced Kolam
        enhanced_img = self.create_enhanced_kolam()
        enhanced_resized = cv2.resize(enhanced_img, (width, height))
        
        # Convert grayscale and skeleton to 3-channel for concatenation
        grayscale_3ch = cv2.cvtColor(grayscale_resized, cv2.COLOR_GRAY2BGR)
        skeleton_3ch = cv2.cvtColor(skeleton_resized, cv2.COLOR_GRAY2BGR)
        
        # Create a 2x3 grid of images
        top_row = np.hstack([original_resized, grayscale_3ch, dots_img])
        bottom_row = np.hstack([skeleton_3ch, math_img, enhanced_resized])
        final_img = np.vstack([top_row, bottom_row])
        
        # Add titles using OpenCV text with better visibility
        font = cv2.FONT_HERSHEY_SIMPLEX
        font_scale = 0.8
        thickness = 2
        
        # Top row titles
        cv2.putText(final_img, "1. Original Image", (10, 35), font, font_scale, (255, 255, 255), thickness)
        cv2.putText(final_img, "2. Grayscale", (width + 10, 35), font, font_scale, (255, 255, 255), thickness)
        cv2.putText(final_img, f"3. Detected Dots ({len(self.detected_dots)})", (2*width + 10, 35), font, font_scale, (0, 255, 0), thickness)
        
        # Bottom row titles
        cv2.putText(final_img, "4. Skeleton Pattern", (10, height + 35), font, font_scale, (255, 255, 255), thickness)
        cv2.putText(final_img, "5. Mathematical Curves", (width + 10, height + 35), font, font_scale, (255, 100, 255), thickness)
        cv2.putText(final_img, "6. Enhanced Recreation", (2*width + 10, height + 35), font, font_scale, (255, 255, 0), thickness)
        
        # Convert to PIL Image and then to base64
        final_img_rgb = cv2.cvtColor(final_img, cv2.COLOR_BGR2RGB)
        pil_img = Image.fromarray(final_img_rgb)
        
        buf = io.BytesIO()
        pil_img.save(buf, format='PNG')
        buf.seek(0)
        
        return buf.getvalue()
    
    def create_enhanced_kolam(self):
        """Create an enhanced version combining detected elements with artistic rendering"""
        # Create a clean background
        height, width = self.original_img.shape[:2]
        enhanced = np.ones((height, width, 3), dtype=np.uint8) * 50  # Dark background
        
        # Draw detected dots
        for x, y, r in self.detected_dots:
            cv2.circle(enhanced, (x, y), r+2, (255, 255, 255), -1)  # White filled circles
            cv2.circle(enhanced, (x, y), r+2, (200, 100, 255), 3)   # Purple outline
        
        # Draw skeleton paths in bright color
        skeleton_colored = cv2.cvtColor(self.skeleton_img, cv2.COLOR_GRAY2BGR)
        mask = self.skeleton_img > 0
        enhanced[mask] = [255, 150, 100]  # Orange/coral color for paths
        
        return enhanced
    
    def process_complete_pipeline(self, image_bytes):
        """Execute the complete 9-step Kolam AI pipeline"""
        print("🎨 Starting Kolam AI Complete Pipeline...")
        
        # Execute all steps in sequence
        self.step1_upload_image(image_bytes)
        self.step2_preprocessing()
        self.step3_detect_dots()
        
        # Add debug visualization for dot detection
        self.debug_dot_detection(save_debug_images=True)
        
        self.step4_skeletonization()
        self.step5_noise_removal()
        self.step6_trace_kolam_path()
        self.step8_grid_analysis()  # Do grid analysis before mathematical simulation
        lissajous_patterns = self.step7_mathematical_simulation()
        final_visualization = self.step9_final_visualization()
        
        # Prepare results
        self.processed_results = {
            'original_shape': self.original_img.shape,
            'detected_dots_count': len(self.detected_dots),
            'grid_size': self.grid_size,
            'processing_complete': True,
            'final_visualization': base64.b64encode(final_visualization).decode('utf-8')
        }
        
        print("✅ Kolam AI Pipeline Complete!")
        return self.processed_results