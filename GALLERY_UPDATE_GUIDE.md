# Gallery Update Guide

## 🤖 Automatic Updates (Recommended)

The gallery now updates **automatically** via GitHub Actions! 

### How It Works

1. **Add new images** to the `Photos` folder
2. **Commit and push** to GitHub:
   ```bash
   git add Photos/
   git commit -m "Add new tournament photos"
   git push
   ```
3. **GitHub Actions automatically**:
   - Detects the new images
   - Runs the update script
   - Updates `images.json`
   - Commits and pushes the changes

**That's it!** No manual script execution needed. The gallery will automatically show all your new images.

### Monitoring the Workflow

- Go to your repository on GitHub
- Click on the "Actions" tab
- You'll see the "Auto Update Gallery" workflow running
- It completes in about 30 seconds

---

## 🔧 Manual Update Methods (Optional)

If you prefer to run the update manually or need to update locally:

### Method 1: Using Python

```bash
python3 update-gallery.py
```

### Method 2: Using Node.js

```bash
node update-gallery.js
```

### Method 3: Using Bash (Mac/Linux)

```bash
./update-gallery.sh
```

---

## 📋 Supported Image Formats

- `.jpg` / `.jpeg`
- `.png`
- `.gif`
- `.webp`
- `.bmp`
- `.svg`

---

## 📝 Notes

- The GitHub Action triggers only when files in the `Photos/` folder change
- Images are automatically sorted alphabetically
- Video files (`.mp4`, `.mov`, etc.) are excluded from the gallery
- The workflow uses the Python script for reliability
- All updates are committed by `github-actions[bot]`

---

## 🚀 Quick Start

**To add new photos to your gallery:**

```bash
# 1. Copy your new images to the Photos folder
cp ~/Downloads/new-photo.jpg Photos/

# 2. Commit and push
git add Photos/
git commit -m "Add new photos"
git push

# 3. Wait ~30 seconds for GitHub Actions to complete
# 4. Your gallery is updated automatically! 🎉
```

---

## 🔍 Troubleshooting

**Gallery not updating?**
1. Check the Actions tab on GitHub for any errors
2. Ensure your images are in the `Photos/` folder
3. Verify image file extensions are supported
4. Make sure you pushed to the `main` branch

**Need to update immediately?**
- Run the manual script locally: `python3 update-gallery.py`
- Then commit and push the updated `images.json`