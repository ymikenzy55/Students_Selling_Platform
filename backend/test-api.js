const http = require('http');

const data = JSON.stringify({
  email: 'test2@example.com',
  password: 'password123'
});

const loginReq = http.request(
  'http://localhost:5000/api/auth/login',
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length
    }
  },
  (res) => {
    let responseData = '';
    res.on('data', chunk => responseData += chunk);
    res.on('end', () => {
      const parsedData = JSON.parse(responseData);
      console.log('Login Response:', parsedData);
      
      if (!parsedData.token) {
        console.error('No token received');
        process.exit(1);
      }

      // Now create a listing
      const listingData = JSON.stringify({
        title: 'Used Macbook',
        description: 'Great condition',
        price: 800,
        condition: 'USED_GOOD',
        category: 'ELECTRONICS',
        campus: 'Main',
      });

      const listingReq = http.request(
        'http://localhost:5000/api/listings',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': listingData.length,
            'Authorization': `Bearer ${parsedData.token}`
          }
        },
        (resListing) => {
          let listResponse = '';
          resListing.on('data', chunk => listResponse += chunk);
          resListing.on('end', () => {
             console.log('Create Listing Response:', listResponse);

             // Now get all listings
             http.get('http://localhost:5000/api/listings', (resGet) => {
                let getResponse = '';
                resGet.on('data', chunk => getResponse += chunk);
                resGet.on('end', () => {
                   console.log('Get All Listings Response:', getResponse);
                });
             });
          });
        }
      );
      
      listingReq.write(listingData);
      listingReq.end();
    });
  }
);

loginReq.write(data);
loginReq.end();
