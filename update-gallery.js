#!/usr/bin/env node

/**
 * Gallery Image List Generator
 * 
 * This script automatically scans the Photos directory and generates
 * an images.json file with all image filenames.
 * 
 * Usage: node update-gallery.js
 * 
 * Run this script whenever you add new images to the Photos folder.
 */

const fs = require('fs');
const path = require('path');

const PHOTOS_DIR = path.join(__dirname, 'Photos');
const OUTPUT_FILE = path.join(PHOTOS_DIR, 'images.json');

// Supported image extensions
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.svg'];

function isImageFile(filename) {
    const ext = path.extname(filename).toLowerCase();
    return IMAGE_EXTENSIONS.includes(ext);
}

function generateImageList() {
    try {
        // Read all files in the Photos directory
        const files = fs.readdirSync(PHOTOS_DIR);
        
        // Filter for image files only and exclude images.json
        const imageFiles = files
            .filter(file => file !== 'images.json' && isImageFile(file))
            .sort(); // Sort alphabetically
        
        // Write to images.json
        fs.writeFileSync(
            OUTPUT_FILE,
            JSON.stringify(imageFiles, null, 4),
            'utf8'
        );
        
        console.log('✅ Gallery updated successfully!');
        console.log(`📸 Found ${imageFiles.length} images:`);
        imageFiles.forEach(file => console.log(`   - ${file}`));
        console.log(`\n📝 Updated: ${OUTPUT_FILE}`);
        
    } catch (error) {
        console.error('❌ Error generating image list:', error.message);
        process.exit(1);
    }
}

// Run the script
generateImageList();

// Made with Bob
