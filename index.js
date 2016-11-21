
require("http").createServer(function (request, response) {
	response.writeHead(200, {'Content-Type': 'text/html'});
	response.end('OK');
}).listen(process.env.PORT | 5000);