const http = require('http');

const app = require('./backend/app');

const server = http.createServer((req, res)=>{
    res.end('This is my first response');
});

server.listen(process.env.PORT || 3000);   

