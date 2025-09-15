import cv2
import numpy as np
import io
import base64
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
        """Step 3: Circle/Dot Detection using Hough Circle Transform with improved parameters"""
        # Apply Gaussian blur for better circle detection
        blurred = cv2.medianBlur(self.gray_img, 5)
        
        # Try multiple parameter sets for better dot detection
        circles = None
        
        # Parameter set 1: For larger, clearer dots
        circles1 = cv2.HoughCircles(
            blurred,
            cv2.HOUGH_GRADIENT,
            dp=1,
            minDist=20,  # Reduced minimum distance between circles
            param1=50,   # Reduced upper threshold for edge detection
            param2=15,   # Reduced accumulator threshold
            minRadius=3, # Smaller minimum radius
            maxRadius=25 # Smaller maximum radius
        )
        
        # Parameter set 2: For smaller dots
        circles2 = cv2.HoughCircles(
            blurred,
            cv2.HOUGH_GRADIENT,
            dp=1,
            minDist=15,
            param1=40,
            param2=12,
            minRadius=2,
            maxRadius=15
        )
        
        # Parameter set 3: For very small dots
        circles3 = cv2.HoughCircles(
            blurred,
            cv2.HOUGH_GRADIENT,
            dp=2,
            minDist=10,
            param1=30,
            param2=10,
            minRadius=1,
            maxRadius=10
        )
        
        # Combine all detected circles
        all_circles = []
        for circle_set in [circles1, circles2, circles3]:
            if circle_set is not None:
                circles_rounded = np.uint16(np.around(circle_set))
                for circle in circles_rounded[0, :]:
                    all_circles.append((circle[0], circle[1], circle[2]))
        
        # Remove duplicate circles (if centers are very close)
        if all_circles:
            filtered_circles = []
            for circle in all_circles:
                is_duplicate = False
                for existing in filtered_circles:
                    distance = np.sqrt((circle[0] - existing[0])**2 + (circle[1] - existing[1])**2)
                    if distance < 15:  # If circles are too close, consider as duplicate
                        is_duplicate = True
                        break
                if not is_duplicate:
                    filtered_circles.append(circle)
            self.detected_dots = filtered_circles
        else:
            self.detected_dots = []
        
        print(f"✓ Step 3: Dot detection complete - Found {len(self.detected_dots)} dots with improved parameters")
        return self.detected_dots
    
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
        """Step 7: Mathematical Kolam simulation using Lissajous curves"""
        if self.grid_size is None:
            self.grid_size = max(3, int(np.sqrt(len(self.detected_dots))) if self.detected_dots else 3)
        
        def generate_lissajous_kolam(grid_size, a=None, b=None, delta=None, num_points=1000):
            """Generate Lissajous curve for Kolam pattern"""
            if a is None: a = grid_size
            if b is None: b = grid_size - 1
            if delta is None: delta = np.pi / 2
            
            t = np.linspace(0, 2 * np.pi, num_points)
            x = (grid_size / 2) * np.sin(a * t + delta) + (grid_size / 2)
            y = (grid_size / 2) * np.sin(b * t) + (grid_size / 2)
            
            return list(zip(x, y))
        
        # Generate multiple Lissajous patterns
        patterns = []
        for i in range(3):
            pattern = generate_lissajous_kolam(
                self.grid_size, 
                a=self.grid_size + i, 
                b=self.grid_size - 1 + i, 
                delta=np.pi / (2 + i)
            )
            patterns.append(pattern)
        
        print(f"✓ Step 7: Mathematical simulation complete - Generated {len(patterns)} Lissajous patterns")
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
        
        # Create dots visualization with improved visibility
        dots_img = original_resized.copy()
        for x, y, r in self.detected_dots:
            # Scale coordinates
            x_scaled = int(x * width / self.original_img.shape[1])
            y_scaled = int(y * height / self.original_img.shape[0])
            r_scaled = max(3, int(r * width / self.original_img.shape[1]))
            
            # Draw multiple circles for better visibility
            cv2.circle(dots_img, (x_scaled, y_scaled), r_scaled + 4, (0, 255, 0), 3)  # Green outer circle
            cv2.circle(dots_img, (x_scaled, y_scaled), r_scaled, (255, 255, 255), -1)  # White filled circle
            cv2.circle(dots_img, (x_scaled, y_scaled), r_scaled, (0, 0, 255), 2)       # Blue outline
            cv2.circle(dots_img, (x_scaled, y_scaled), 3, (255, 0, 0), -1)             # Red center dot
        
        # Create mathematical simulation visualization with better visibility
        math_img = np.zeros((height, width, 3), dtype=np.uint8)
        math_img.fill(40)  # Dark gray background instead of black
        
        # Draw Lissajous pattern with improved visibility
        if self.grid_size > 0:
            # Generate more points for smoother curves
            t = np.linspace(0, 4 * np.pi, 2000)  # More points and longer curve
            
            # Create multiple overlapping patterns for richness
            patterns = [
                (self.grid_size, self.grid_size - 1, np.pi/2, (255, 100, 255)),  # Purple
                (self.grid_size + 1, self.grid_size, 0, (100, 255, 255)),       # Cyan
                (self.grid_size - 1, self.grid_size + 1, np.pi/4, (255, 255, 100)) # Yellow
            ]
            
            for a, b, delta, color in patterns:
                x_liss = (self.grid_size / 2) * np.sin(a * t + delta) + (self.grid_size / 2)
                y_liss = (self.grid_size / 2) * np.sin(b * t) + (self.grid_size / 2)
                
                # Scale to image size with padding
                padding = 50
                x_scaled = ((x_liss + 1) * (width - 2*padding) / (self.grid_size + 2) + padding).astype(int)
                y_scaled = ((y_liss + 1) * (height - 2*padding) / (self.grid_size + 2) + padding).astype(int)
                
                # Ensure coordinates are within bounds
                x_scaled = np.clip(x_scaled, 0, width-1)
                y_scaled = np.clip(y_scaled, 0, height-1)
                
                # Draw the curve with varying thickness
                for i in range(len(x_scaled) - 1):
                    cv2.line(math_img, (x_scaled[i], y_scaled[i]), (x_scaled[i+1], y_scaled[i+1]), color, 3)
            
            # Add grid dots with better visibility
            dot_spacing = min((width - 2*padding) // max(1, self.grid_size), (height - 2*padding) // max(1, self.grid_size))
            for i in range(self.grid_size):
                for j in range(self.grid_size):
                    x_dot = padding + i * dot_spacing
                    y_dot = padding + j * dot_spacing
                    # Draw larger, more visible dots
                    cv2.circle(math_img, (x_dot, y_dot), 12, (255, 255, 255), -1)
                    cv2.circle(math_img, (x_dot, y_dot), 12, (0, 0, 0), 3)
                    # Add small inner dot
                    cv2.circle(math_img, (x_dot, y_dot), 4, (255, 0, 0), -1)
        
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