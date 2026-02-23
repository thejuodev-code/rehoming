const fs = require('fs');
const path = require('path');

const src = 'd:\\rehoming_center\\video\\hero_vid.mp4';
const dest = 'd:\\rehoming_center\\public\\videos\\hero_bg.mp4';

try {
    fs.copyFileSync(src, dest);
    console.log('Copy successful');
} catch (err) {
    console.error('Copy failed:', err);
    process.exit(1);
}
