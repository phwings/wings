const http = require('http');

const hostname = 'icsph.com';
const port = 8080;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('NodeJS server running on Shared Hosting\n');
});

server.listen(port, hostname, () => {
  console.log('Server running at http://${hostname}:${port}/');
});