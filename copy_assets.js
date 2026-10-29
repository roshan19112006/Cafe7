const fs = require('fs');
const path = require('path');

const imgDir = path.join(__dirname, 'public', 'images');

const mapping = {
  'CARAMEL LATTE.JPG.jpeg': 'caramel-latte.jpeg',
  'CHICKEN CHEESE BALLS.jpeg': 'chicken-cheese-balls.jpeg',
  'CHICKEN NUGGETS.jpeg': 'chicken-nuggets.jpeg',
  'FIRE CRACKERS CHICKEN BITES.jpeg': 'firecracker-chicken-bites.jpeg',
  'FIRE KISS BBQ WINGS.jpeg': 'fire-kiss-bbq-wings.jpeg',
  'HONEY GLAZE POPCORN.jpeg': 'honey-blaze-popcorn.jpeg',
  'IRISH LATTE.png': 'irish-latte.png',
  'JALAPENO CHEESE POPPERS.jpeg': 'jalapeno-cheese-poppers.jpeg',
  'KOREAN HOT WINGS.jpeg': 'korean-hot-wings.jpeg',
  'LATTE.jpeg': 'classic-latte.jpeg',
  'Menu 1.jpeg': 'menu-1.jpeg',
  'Menu 2.jpeg': 'menu-2.jpeg',
  'RED BLAST HOT WINGS1.jpeg': 'red-blast-wings.jpeg',
  'SPANISH LATTE.jpeg': 'spanish-latte.jpeg',
  'VANILLA VELVET LATTE.JPG.jpeg': 'vanilla-velvet-latte.jpeg',
  'VOLCANO PERI PERI WINGS.jpeg': 'volcano-wings.jpeg'
};

for (const [src, dest] of Object.entries(mapping)) {
  const srcPath = path.join(imgDir, src);
  const destPath = path.join(imgDir, dest);
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, destPath);
    console.log(`Copied: ${src} -> ${dest}`);
  } else {
    console.warn(`File not found: ${srcPath}`);
  }
}
