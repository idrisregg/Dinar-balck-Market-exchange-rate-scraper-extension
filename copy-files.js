import { copyFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

const distDir = 'dist';
const iconsDir = join(distDir, 'icons');

if (!existsSync(iconsDir)) {
  mkdirSync(iconsDir, { recursive: true });
}

copyFileSync('manifest.json', join(distDir, 'manifest.json'));

const iconSizes = ['16', '48', '128'];
iconSizes.forEach(size => {
  const iconFile = `icon${size}.png`;
  const srcPath = join('icons', iconFile);
  const destPath = join(iconsDir, iconFile);
  
  if (existsSync(srcPath)) {
    copyFileSync(srcPath, destPath);
  }
});

console.log('Files copied successfully!');