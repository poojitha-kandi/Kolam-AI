"""
IMPORTANT: Save Your Exact Original Kolam Images

To use your exact original kolam images without any modifications, 
please save your 4 kolam images in the following location with these exact names:

D:\Kolam-AI\backend\original_kolam_images\

File names:
1. kolam_1_interlocking_loops.png  (Your first kolam image)
2. kolam_2_cross_star.png          (Your second kolam image) 
3. kolam_3_curved_loops.png        (Your third kolam image)
4. kolam_4_interwoven_loops.png    (Your fourth kolam image)

Steps:
1. Save each of your 4 original kolam images to the folder above
2. Use the exact file names listed above
3. Restart the server
4. Your exact original images will appear in the "Similar Traditional Kolam Designs" section

The system is now configured to use your exact original images with NO modifications.
"""

import os

# Create the directory
os.makedirs("original_kolam_images", exist_ok=True)

print("Directory created: original_kolam_images/")
print("Please save your 4 exact kolam images in this folder with the specified names.")
print("Then restart the server to see your exact original images.")
