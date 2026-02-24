const fs = require('fs');
const cp = require('child_process');

console.log('Deleting node_modules...');
try { fs.rmSync('node_modules', { recursive: true, force: true }); } catch (e) { console.error('Error deleting node_modules', e); }

console.log('Deleting .next...');
try { fs.rmSync('.next', { recursive: true, force: true }); } catch (e) { console.error('Error deleting .next', e); }

console.log('Deleting package-lock.json...');
try { fs.unlinkSync('package-lock.json'); } catch (e) { console.error('Error deleting package-lock.json', e); }

console.log('Running npm install...');
const npm = cp.spawn(/^win/.test(process.platform) ? 'npm.cmd' : 'npm', ['install'], {
    stdio: 'inherit',
    shell: true
});

npm.on('close', (code) => {
    console.log('npm install finished with code', code);
});
