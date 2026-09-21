import sharp from 'sharp';
import fs from 'fs';

async function optimizeImages() {
  console.log('Optimizing images...');
  
  if (fs.existsSync('src/image/about.png')) {
    await sharp('src/image/about.png')
      .webp({ quality: 60 })
      .toFile('src/image/about.webp');
    console.log('about.png converted to about.webp');
  }

  if (fs.existsSync('src/image/logo/logo.png')) {
    await sharp('src/image/logo/logo.png')
      .resize({ width: 800 }) // Logo shouldn't be larger than 800px wide
      .webp({ quality: 75 })
      .toFile('src/image/logo/logo.webp');
    console.log('logo.png converted to logo.webp');
  }

  console.log('Done!');
}

optimizeImages().catch(console.error);
