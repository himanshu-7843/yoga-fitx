#!/bin/bash
cd /vercel/share/v0-project
git add -A
git commit -m "Mobile-friendly design updates

- Enhanced responsive CSS with mobile breakpoints (1024px, 768px, 480px)
- Added fullscreen slide-out mobile navigation menu
- Optimized typography with clamp() for smooth scaling
- Improved touch-friendly button sizing and spacing
- Updated JavaScript for mobile menu toggle functionality
- Better footer and gallery grid layouts for mobile
- Optimized hero section for mobile viewing"
git push origin mobile-friendly-website
