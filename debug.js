const https = require('https');
const fs = require('fs');

const data = JSON.stringify({
    query: "{ supportPosts { nodes { databaseId title } } }"
});

const options = {
    hostname: 'lovejuo123.mycafe24.com',
    port: 443,
    path: '/graphql',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
    }
};

const req = https.request(options, (res) => {
    let body = '';
    res.on('data', (chunk) => body += chunk);
    res.on('end', () => {
        fs.writeFileSync('out.txt', body);
        console.log('done');
    });
});

req.on('error', (e) => {
    fs.writeFileSync('out.txt', 'Error: ' + e.message);
});

req.write(data);
req.end();
