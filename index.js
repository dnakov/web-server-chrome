var _ = require('lodash');

module.exports = {
	Server: require('./webapp.js'),
	Stream: require('./stream.js'),
	Request: require('./request.js'),
	DirHandler: require('./directoryHandler.js')
}

console.log(new module.exports.Server({handlers:['.*', module.exports.DirHandler], port:8887}));