# Custom Font Installation

## new-science-extended Font

Place your custom font files in this directory:

### Required Files:
- `new-science-extended.woff2` (recommended for best performance)
- `new-science-extended.woff` (fallback for older browsers)

### Font Specifications:
- **Family:** new-science-extended, sans-serif
- **Weight:** 400
- **Size:** 192px (for hero title)
- **Line Height:** 173px
- **Color:** #FCF9EA

### How to Add Your Font:
1. Obtain the font files from your font provider
2. Copy the .woff2 and .woff files to this directory
3. The font is already configured in `/app/globals.css`

### If Using Different File Names:
Update the `@font-face` declaration in `/app/globals.css` to match your file names.