# Hero Video Setup

## Video Files for Hero Section

Place your hero video files in this directory.

### Required Files:
- `hero-video.mp4` (main video file)
- `hero-video.webm` (optional, for better browser compatibility)
- `hero-poster.jpg` (optional, poster image shown before video loads)

### Video Specifications:
- **Format:** MP4 (H.264 codec recommended)
- **Resolution:** 1920x1080 or higher for best quality
- **Aspect Ratio:** 16:9 recommended
- **Duration:** Loop-friendly (seamless end-to-start transition)

### Important Notes:
- Video will be muted by default (autoplay requires muted videos)
- Video will autoplay and loop continuously
- Video should be optimized for web (compressed file size)
- Consider mobile users - keep file size reasonable

### How to Add Your Video:
1. Prepare your video file in MP4 format
2. Rename it to `hero-video.mp4`
3. Place it in this directory (`/public/videos/`)
4. Optionally add a poster image named `hero-poster.jpg`

### Changing Video Source:
Edit `/app/components/HeroSection.tsx` to change the video source path.