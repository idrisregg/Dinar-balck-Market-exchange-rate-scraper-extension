# Dinar MarketChrome Extension

Algerian dinar exchange rate on the parallel market .

## Features

- Text highlighting on web pages
- Popup interface for user interaction
- Background script for handling extension events
- Content script for manipulating web pages

## Development Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Build the extension:
   ```
   npm run build
   ```

3. For development with watch mode:
   ```
   npm run dev
   ```

4. To preview the build:
   ```
   npm run preview
   ```

## Loading the Extension in Chrome

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" using the toggle in the top right
3. Click "Load unpacked" and select the `dist` directory from this project
4. The extension should now appear in your list of extensions

## Project Structure

- `src/` - TypeScript source files
  - `background.ts` - Background script
  - `content.ts` - Content script
  - `popup.ts` - Popup script
  - `popup.html` - Popup HTML
  - `popup.css` - Popup styles
- `dist/` - Built extension files (generated)
- `vite.config.ts` - Vite configuration
- `tsconfig.json` - TypeScript configuration
- `tsconfig.node.json` - TypeScript configuration for Node.js files
- `manifest.json` - Chrome extension manifest

## How to Use

1. Click on the extension icon in the Chrome toolbar
2. Enter text you want to highlight on the current page
3. Click the "Highlight" button
4. The text will be highlighted on the page

## Customization

You can extend this extension by:
- Adding more UI elements to the popup
- Implementing additional content script functionality
- Expanding background script capabilities
- Adding more permissions to the manifest.json as needed

## Why Vite?

Vite offers several advantages for Chrome extension development:
- Faster builds with native ES modules
- Better development experience with hot module replacement
- Simplified configuration compared to Webpack
- Optimized production builds
