if (! String.prototype.endsWith) {
    String.prototype.endsWith = function(substr) {
        for (var i=0; i<substr.length; i++) {
            if (this[this.length - 1 - i] !== substr[substr.length - 1 - i]) {
                return false
            }
        }
        return true
    }
}
if (! String.prototype.startsWith) {
    String.prototype.startsWith = function(substr) {
        for (var i=0; i<substr.length; i++) {
            if (this[i] !== substr[i]) {
                return false
            }
        }
        return true
    }
}
 

var _ = require('lodash');

module.exports = {
	Server: require('./webapp.js'),
	Stream: require('./stream.js'),
	Request: require('./request.js'),
	FileSystem: require('./filesystem.js'),
	DirHandler: require('./directoryHandler.js')
}

// console.log(new module.exports.Server({handlers:['.*', module.exports.DirHandler], port:8887}));

