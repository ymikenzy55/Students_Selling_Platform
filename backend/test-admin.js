const http = require('http');

// 1. Setup the Super Admin First
const setupData = JSON.stringify({
  email: 'superadmin@studentmarket.com',
  password: 'supersecurepassword',
  name: 'Global Overseer',
  secretKey: 'init_secret_123'
});

const req = http.request(
  'http://localhost:5000/api/admin/setup',
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': setupData.length
    }
  },
  (res) => {
    let raw = '';
    res.on('data', chunk => raw += chunk);
    res.on('end', () => console.log(`Setup Admin Status: ${res.statusCode}\nBody: ${raw}\n`));
  }
);
req.on('error', console.error);
req.write(setupData);
req.end();
