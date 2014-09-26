var _ = require('lodash');

var entryCache = require('./entrycache.js').entryCache;
var entryFileCache = require('./entrycache.js').entryCache;

module.exports = (function() {    
    // function haveentry(entry) {
    //     window.fs = new FileSystem(entry)
    // }
    // window.haveentry = haveentry

    function FileSystem(entry) {
        this.entry = entry;
    }
    _.extend(FileSystem.prototype, {
        getByPath: function(path, callback) {
            if (path == '/') { 
                callback(this.entry)
                return
            }
            var parts = path.split('/')
            var newpath = parts.slice(1,parts.length)
            this.recursiveGetEntry(this.entry, newpath, callback)
        },
        recursiveGetEntry: function(filesystem, path, callback) {
            var cacheKey = filesystem.filesystem.name +
                filesystem.fullPath +
                '/' + path.join('/')
            var inCache = entryCache.get(cacheKey)
            if (inCache) { 
                //console.log('cache hit');
                callback(inCache); return
            }

            var state = {e:filesystem}

            function recurse(e) {
                if (path.length == 0) {
                    if (e.name == 'TypeMismatchError') {
                        state.e.getDirectory(state.path, {create:false}, recurse, recurse)
                    } else if (e.isFile) {
                        entryCache.set(cacheKey,e)
                        callback(e)
                    } else if (e.isDirectory) {
                        //console.log(filesystem,path,cacheKey,state)
                        entryCache.set(cacheKey,e)
                        callback(e)
                    } else {
                        callback({error:'path not found'})
                    }
                } else if (e.isDirectory) {
                    if (path.length > 1) {
                        // this is not calling error callback, simply timing out!!!
                        e.getDirectory(path.shift(), {create:false}, recurse, recurse)
                    } else {
                        state.e = e
                        state.path = _.clone(path)
                        e.getFile(path.shift(), {create:false}, recurse, recurse)
                    }
                } else {
                    callback({error:'file exists'})
                }
            }
            recurse(filesystem)
        }
    })

    return FileSystem;
})();