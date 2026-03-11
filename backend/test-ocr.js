const http = require('http');

// A sample publicly available image of a dummy ID card with a fake name.
const MOCK_CARD_URL = 'https://tesseract.projectnaptha.com/img/eng_bw.png'; 

const data = JSON.stringify({
  name: 'Mildred', // "Mildred" is present in the sample tesseract image
  ghanaCardImageUrl: MOCK_CARD_URL
});

const req = http.request(
  'http://localhost:5000/api/auth/me',
  {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.argv[2]}` // Pass token from command line if testing manual scripts
    }
  },
  (res) => {
    let raw = '';
    res.on('data', chunk => raw += chunk);
    res.on('end', () => console.log(`Status: ${res.statusCode}\nBody:\n${raw}`));
  }
);

req.on('error', console.error);
req.write(data);
req.end();
