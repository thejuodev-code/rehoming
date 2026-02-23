const fs = require('fs');
const path = require('path');

const src = 'd:\\rehoming_center\\video\\hero_vid.mp4';
const dest = 'd:\\rehoming_center\\public\\videos\\hero_bg.mp4';

console.log('Starting stream copy...');

const readStream = fs.createReadStream(src);
const writeStream = fs.createWriteStream(dest);

readStream.on('error', (err) => {
    console.error('Read error:', err);
    process.exit(1);
});

writeStream.on('error', (err) => {
    console.error('Write error:', err);
    process.exit(1);
});

writeStream.on('finish', () => {
    console.log('Copy finished successfully');
    process.exit(0);
});

readStream.pipe(writeStream);

setTimeout(() => {
    console.log('Timeout reached, still copying...');
}, 10000);
