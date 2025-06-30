# MAROO GAMER - Gaming Portfolio Website

A fully responsive and animated 3D gaming portfolio website for content creator MAROO GAMER.

## Features

### 🎮 Interactive Elements
- **3D PS5 Controller**: Custom-built CSS 3D controller with hover effects
- **Animated Logo**: Glowing and pulsing MAROO GAMER logo
- **Background Music**: Auto-playing background music with toggle control
- **Smooth Scrolling**: Parallax effects and smooth section transitions
- **3D Card Effects**: Interactive social media cards with tilt effects

### 🎨 Visual Design
- **Color Scheme**: Pink, white, and dark theme as requested
- **Neon Effects**: Glowing buttons and hover effects
- **Particle Animation**: Moving background particles
- **Grid Overlay**: Animated grid background
- **Cursor Trail**: Interactive mouse trail effect

### 📱 Mobile Responsive
- **Mobile-First Design**: Optimized for all screen sizes
- **Touch-Friendly**: Large buttons and touch targets
- **Hamburger Menu**: Mobile navigation menu
- **Responsive Controller**: Scaled PS5 controller for mobile

### 🔗 Social Integration
- **YouTube**: Link to @MarooGamer321
- **Discord**: Link to gaming community server
- **TikTok**: Link to @maroogamer
- **Interactive Buttons**: 3D animated social media buttons

### ⚡ Performance
- **Service Worker**: PWA capabilities for faster loading
- **Lazy Loading**: Optimized image loading
- **Smooth Animations**: 60fps animations with requestAnimationFrame
- **Error Handling**: Graceful fallbacks for all features

## File Structure

```
maroogamer/
├── index.html          # Main HTML file
├── styles.css          # All CSS styles and animations
├── script.js           # JavaScript functionality
├── sw.js              # Service Worker for PWA
├── README.md          # This file
└── used sources/
    ├── MAROO GAMER.jpg    # Logo image
    └── background-music.mp3 # Background music
```

## Setup Instructions

1. **Local Development**:
   - Open `index.html` in a modern web browser
   - For best experience, serve from a local server (due to audio autoplay policies)

2. **Web Server**:
   - Upload all files to your web hosting
   - Ensure proper MIME types for audio files
   - HTTPS recommended for full functionality

## Browser Compatibility

- **Chrome/Edge**: Full support
- **Firefox**: Full support
- **Safari**: Full support (iOS 13+)
- **Mobile Browsers**: Optimized for all major mobile browsers

## Customization

### Colors
The color scheme can be modified in the CSS variables at the top of `styles.css`:
```css
:root {
    --primary-pink: #ff1493;
    --secondary-pink: #ff69b4;
    --primary-white: #ffffff;
    /* ... other colors */
}
```

### Content
- Update social media links in `index.html`
- Replace logo in `used sources/MAROO GAMER.jpg`
- Replace background music in `used sources/background-music.mp3`

### Animations
All animations can be disabled by adding `prefers-reduced-motion: reduce` media query styles.

## Features Implemented

✅ **3D PS5 Controller** (replaced the Spline 3D model)  
✅ **Pink and White Color Scheme** (green changed to white as requested)  
✅ **Background Music** with toggle control  
✅ **Mobile Optimization** with perfect mobile responsiveness  
✅ **Interactive Scrolling** with parallax effects  
✅ **3D Mouse Animations** throughout the site  
✅ **Social Media Integration** with animated buttons  
✅ **Logo Integration** with glow effects  
✅ **Performance Optimization** for fast loading  

## Technical Details

- **Pure CSS 3D**: No external 3D libraries needed
- **Vanilla JavaScript**: No framework dependencies
- **Progressive Enhancement**: Works without JavaScript
- **Accessibility**: Keyboard navigation and screen reader friendly
- **SEO Optimized**: Proper meta tags and semantic HTML

## Support

For any issues or customizations, the code is well-commented and modular for easy modification.

---

**MAROO GAMER** - Gaming Content Creator & Streamer  
🎮 YouTube | 💬 Discord | 📱 TikTok