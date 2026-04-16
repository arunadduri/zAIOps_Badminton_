# Gallery Update Guide

## Overview

The gallery automatically loads images from the `Photos/images.json` file. When you add new images to the `Photos` folder, you need to update this JSON file.

## Automatic Update Methods

### Method 1: Using Node.js (Recommended)

```bash
node update-gallery.js
```

**Requirements:** Node.js installed on your system

### Method 2: Using Python

```bash
python update-gallery.py
```

or

```bash
python3 update-gallery.py
```

**Requirements:** Python 3 installed on your system

### Method 3: Using Bash (Mac/Linux)

```bash
chmod +x update-gallery.sh
./update-gallery.sh
```

**Requirements:** Bash shell (available by default on Mac/Linux)

## Workflow

1. **Add new images** to the `Photos` folder
2. **Run one of the update scripts** (choose your preferred method above)
3. **Commit and push** the changes to Git:
   ```bash
   git add Photos/images.json
   git commit -m "Update gallery images"
   git push
   ```

## Manual Update

If you prefer to update manually, edit `Photos/images.json` and add your image filenames:

```json
[
    "image1.jpg",
    "image2.jpg",
    "new_image.jpg"
]
```

## Supported Image Formats

- `.jpg` / `.jpeg`
- `.png`
- `.gif`
- `.webp`
- `.bmp`
- `.svg`

## Notes

- The scripts automatically exclude `images.json` from the list
- Images are sorted alphabetically
- Video files (`.mp4`, `.mov`, etc.) are not included in the gallery
- The gallery will display images in the order they appear in the JSON file