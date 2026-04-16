#!/bin/bash

# Gallery Image List Generator
# 
# This script automatically scans the Photos directory and generates
# an images.json file with all image filenames.
# 
# Usage: ./update-gallery.sh
# 
# Run this script whenever you add new images to the Photos folder.

PHOTOS_DIR="$(cd "$(dirname "$0")/Photos" && pwd)"
OUTPUT_FILE="$PHOTOS_DIR/images.json"

echo "🔍 Scanning Photos directory..."

# Find all image files (excluding images.json)
cd "$PHOTOS_DIR" || exit 1

# Create array of image files
images=()
for file in *; do
    if [[ -f "$file" && "$file" != "images.json" ]]; then
        # Check if it's an image file
        case "${file,,}" in
            *.jpg|*.jpeg|*.png|*.gif|*.webp|*.bmp|*.svg)
                images+=("$file")
                ;;
        esac
    fi
done

# Sort the array
IFS=$'\n' sorted=($(sort <<<"${images[*]}"))
unset IFS

# Generate JSON
echo "[" > "$OUTPUT_FILE"
for i in "${!sorted[@]}"; do
    if [ $i -eq $((${#sorted[@]} - 1)) ]; then
        echo "    \"${sorted[$i]}\"" >> "$OUTPUT_FILE"
    else
        echo "    \"${sorted[$i]}\"," >> "$OUTPUT_FILE"
    fi
done
echo "]" >> "$OUTPUT_FILE"

echo "✅ Gallery updated successfully!"
echo "📸 Found ${#sorted[@]} images:"
for img in "${sorted[@]}"; do
    echo "   - $img"
done
echo ""
echo "📝 Updated: $OUTPUT_FILE"

# Made with Bob
