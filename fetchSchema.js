const https = require('https');
const fs = require('fs');

const data = JSON.stringify({
    query: `
    query {
      __type(name: "CreateAnimalInput") {
        inputFields {
          name
        }
      }
    }
  `
});

const options = {
    hostname: 'rehoming.thejuo.com',
    port: 443,
    path: '/graphql',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

const req = https.request(options, res => {
    let body = '';
    res.on('data', chunk => body += chunk);
    res.on('end', () => {
        fs.writeFileSync('schema_input.json', body);
        console.log('Done');
    });
});

req.on('error', error => {
    fs.writeFileSync('schema_input.json', JSON.stringify({ error: error.message }));
    console.error(error);
});

req.write(data);
req.end();
