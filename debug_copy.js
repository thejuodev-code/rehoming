const fs = require('fs');
const path = require('path');

const src = 'd:\\rehoming_center\\video\\hero_vid.mp4';
const dest = 'd:\\rehoming_center\\public\\hero_bg.mp4';

console.log('Starting copy...');
console.log('Source:', src);
console.log('Destination:', dest);

try {
    if (!fs.existsSync(src)) {
        console.error('Source does not exist');
        process.exit(1);
    }
    fs.copyFileSync(src, dest);
    console.log('Copy successful');
    const stats = fs.statSync(dest);
    console.log('File size:', stats.size);
} catch (err) {
    console.error('Copy failed:', err);
    process.exit(1);
}
