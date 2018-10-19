
/* DEPENDENCIES AND MODULES  */
const http = require('http');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;
const config = require("./config");
const validKey = require('./keys').validKey;


/*   */

const unifiedServer = (req, res) => {
	let parsedURL = url.parse(req.url, true);
	let path = parsedURL.pathname;
	let trimmedPath = path.replace(/^\/+|\/+$/g, '');
	let buffer = "";
	const method = req.method.toLowerCase();
	const queryString = parsedURL.query;
	const key = queryString['key'];
	const decoder = new StringDecoder("utf-8");

	req.on('data', (data) => {
		buffer += decoder.write(data);
	});
	req.on('end', () => {
		buffer += decoder.end();

		if (method == 'post' && validKey(key)) {
			console.log(trimmedPath)
			let choosenHandler = trimmedPath in router ? router[trimmedPath] : handler.notFound;
			console.log(choosenHandler);
			choosenHandler((statusCode, payload) => {
				payload = typeof(payload) == 'object' ? payload : {'error': 'Wrong Destination @ 404'};
				let payloadString = JSON.stringify(payload);
				res.setHeader('Content-Type', 'application/json');
				res.writeHead(statusCode);
				res.end(payloadString)
			});
		} else {
			res.setHeader('Content-Type', 'application/json');
			res.writeHead(404);
			let msg = {
				'warning': 'This API is only for POST request on path @ /hello',
			};
			if (!validKey(key)) {
				msg.error = `The key passed ${key} is not valid...`
			}
			msg = JSON.stringify(msg)
			res.end(msg);
		}
	});
	// console.log(`Path: ${trimmedPath}\nMethod: ${method}`);
};



/* INSTANTIATING SERVER  */
const server = http.createServer(unifiedServer);

server.listen(config.port, () => {
	console.log(`Server listening @ ${config.port}`);
});


/* ROUTING AND HANDLERS  */
let handler = {};
handler.hello = (callback) => {
	let message = {
		'welcome': 'This is just simple Hellp world API',
		'message': 'Hello World',
		'warning': "",
		'error': ""
	}
	callback(200, message);;
};

handler.notFound = (callback) => {
	callback(404);
};

let router = {
	'hello': handler.hello
};
