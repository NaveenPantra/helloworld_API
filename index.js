
/* DEPENDENCIES AND MODULES  */
const http = require('http');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;
const config = require("./config");


/*  MAIN HADLER */
const unifiedServer = (req, res) => {
	let parsedURL = url.parse(req.url, true);
	let path = parsedURL.pathname;
	let trimmedPath = path.replace(/^\/+|\/+$/g, '');
	let method = req.method.toLowerCase();
	let queryString = parsedURL.queryString;
	let headers = req.headers;
	let decoder = new StringDecoder("utf-8");
	let buffer = "";

	req.on('data', (data) => {
		buffer += decoder.write(data);
	});
	req.on('end', () => {
		buffer += decoder.end();

		if (method == 'post') {
			let choosenHandler = trimmedPath in router ? router[trimmedPath] : handler.notFound;
			let data = {
			trimmedPath,
			queryString,
			method,
			headers,
			'payload': buffer
			};
			choosenHandler(data, (statusCode, payload) => {
				statusCode = typeof(statusCode) == 'number' ? statusCode : 200;
				payload = typeof(payload) == 'object' ? payload : {'message': 'Wrong Destination @ 404'};
				let payloadString = JSON.stringify(payload);
				res.setHeader('Content-Type', 'application/json');
				res.writeHead(statusCode);
				res.end(payloadString)
			});
		} else {
			let msg = {
				'message': 'This API is only for POST request on path @ /hello'
			};
			msg = JSON.stringify(msg)
			res.setHeader('Content-Type', 'application/json');
			res.writeHead(404);
			res.end(msg);
		}
	});
	// console.log(`Path: ${trimmedPath}\nMethod: ${method}`);
	// res.end(`Path: ${trimmedPath}\nMethod: ${method}`);
};



/* INSTANTIATING SERVER  */
const server = http.createServer(unifiedServer);

server.listen(config.port, () => {
	console.log(`Server listening @ ${config.port}`);
});


/* ROUTING AND HANDLERS  */
let handler = {};
handler.hello = (data, callback) => {
	callback(200, {'Welcome': 'Just an simple Hello World API'});;
};

handler.notFound = (data, callback) => {
	callback(404);
};

let router = {
	'hello': handler.hello
};
