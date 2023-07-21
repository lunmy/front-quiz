const http = require('follow-redirects').http;

const options = {
  host: '0.0.0.0',
  port: 3000,
  path: '/',
  method: 'GET',
  timeout: 2000
};


const healthCheck = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  if (res.statusCode === 200) {
    process.exit(0);
  }
  else {
    process.exit(1);
  }
});

healthCheck.on('error', function (err) {
  console.error(err);
  process.exit(1);
});

healthCheck.end();
