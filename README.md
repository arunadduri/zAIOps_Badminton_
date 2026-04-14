# zAIOps Badminton Tournament 2026 Website

A complete tournament management website with registration system, rules, gallery, and player statistics.

## 🏸 Features

### Landing Page
- **Split-screen design** with auto-rotating image slideshow
- **"Register Now" button** for quick access to registration
- **"What You're Looking For?"** section with 5 quick-access cards

### Registration System
- Gender-based category selection (Male/Female)
- 5 tournament categories:
  - Men's Singles
  - Women's Singles
  - Men's Doubles
  - Women's Doubles
  - Mixed Doubles
- Partner details collection for doubles/mixed categories
- Real-time validation:
  - IBM email verification (@ibm.com)
  - Gender consistency check
  - Duplicate registration prevention
  - Reverse partner combination checking
- Success overlay with registered categories
- "Register Another Category" functionality

### Navigation
- **Collapsible sidebar** with quick links
- **Search functionality** across all sections
- Smooth section transitions

### Tournament Information
- **Rules Page**: Complete BWF-standard tournament rules
- **Gallery**: Two tabs (Earlier Tournaments / zAIOps 2026)
- **All Registrations**: View all registered players by category
- **Fixtures**: Coming Soon
- **Stats**: Coming Soon

### Backend
- **PostgreSQL/Supabase** database
- Real-time data synchronization
- Secure API integration

## 📁 Project Structure

```
zaiops-tournament/
├── index.html          # Main HTML file
├── css/
│   └── styles.css      # All styling
├── js/
│   ├── config.js       # Supabase configuration
│   ├── navigation.js   # Navigation & UI logic
│   ├── registration.js # Registration form logic
│   └── display.js      # Data display logic
├── images/             # Tournament images (empty - add your photos here)
└── README.md           # This file
```

## 🚀 Getting Started

### Prerequisites
- A web browser (Chrome, Firefox, Safari, Edge)
- Internet connection (for Supabase and external images)

### Installation

1. **Download the project**
   ```bash
   # The project is in the zaiops-tournament folder
   ```

2. **Open the website**
   - Simply open `index.html` in your web browser
   - Or use a local server:
     ```bash
     # Using Python
     python -m http.server 8000
     
     # Using Node.js
     npx http-server
     ```

3. **Access the website**
   - Direct: Open `index.html` in browser
   - Local server: Navigate to `http://localhost:8000`

### Deployment

#### GitHub Pages
1. Create a new repository on GitHub
2. Upload the `zaiops-tournament` folder contents
3. Go to Settings → Pages
4. Select branch and `/root` folder
5. Save and access your site at `https://yourusername.github.io/repository-name`

#### Netlify
1. Drag and drop the `zaiops-tournament` folder to Netlify
2. Your site will be live instantly

#### Vercel
1. Import the project from GitHub
2. Deploy with one click

## 🔧 Configuration

### Supabase Setup
The database is already configured. If you need to change it:

1. Open `js/config.js`
2. Update the credentials:
   ```javascript
   const SUPABASE_URL = 'your-project-url';
   const SUPABASE_KEY = 'your-anon-key';
   ```

### Database Schema
Table: `registrations`
- `id` (uuid, primary key)
- `name` (text)
- `email` (text)
- `gender` (text)
- `category` (text)
- `partner_name` (text, nullable)
- `partner_email` (text, nullable)
- `timestamp` (timestamp)

## 🎨 Customization

### Colors
Edit `css/styles.css` to change the color scheme:
```css
:root {
    --primary-cyan: #00d4ff;
    --primary-orange: #ff6b35;
    --dark-bg: #0a1628;
    --card-bg: #1a2942;
}
```

### Images
- Replace slideshow images in `index.html` (lines with `background-image`)
- Add tournament photos to the `images/` folder
- Update gallery section to display your images

### Logo
Replace the SVG logo in `index.html` with your own image:
```html
<img src="images/your-logo.png" alt="zAIOps Logo" class="landing-logo">
```

## 📱 Responsive Design
The website is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones

## 🔒 Security Features
- Email validation (@ibm.com domain)
- Gender consistency enforcement
- Duplicate registration prevention
- Partner email validation
- Reverse partner combination checking

## 🐛 Troubleshooting

### Registration not working
- Check browser console for errors
- Verify Supabase credentials in `config.js`
- Ensure internet connection is active

### Images not loading
- Check image URLs in `index.html`
- Verify internet connection
- Replace with local images if needed

### Styling issues
- Clear browser cache
- Check if `styles.css` is loading correctly
- Verify CSS file path in `index.html`

## 📄 License
This project is created for the zAIOps Badminton Tournament 2026.

## 🤝 Support
For issues or questions, contact the tournament organizers.

## 🎯 Future Enhancements
- [ ] Fixtures management system
- [ ] Live scoring
- [ ] Player statistics dashboard
- [ ] Image upload for gallery
- [ ] Tournament bracket visualization
- [ ] Email notifications
- [ ] Admin dashboard

---

**Built with ❤️ for zAIOps Badminton Tournament 2026**