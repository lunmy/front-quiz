const http = require('follow-redirects').https;

// Prevent check certificate error
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
const options = {
  host: '0.0.0.0',
  port: 3000,
  path: '/login',
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
