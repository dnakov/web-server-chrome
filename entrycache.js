var _ = require('lodash');

module.exports = {};
module.exports.entryCache = (function() {

    function EntryCache() {
        this.cache = {}
        if ( arguments.callee._singletonInstance )
            return arguments.callee._singletonInstance;
        arguments.callee._singletonInstance = this;
    }
    var EntryCacheprototype = {
        clearTorrent: function() {
            // todo
        },
        clearKey: function(skey) {
            var todelete = []
            for (var key in this.cache) {
                if (key.startsWith(skey)) {
                    todelete.push(key)
                }
            }
            for (var i=0; i<todelete.length; i++) {
                delete this.cache[todelete[i]]
            }
        },
        clear: function() {
            this.cache = {}
        },
        unset: function(k) {
            delete this.cache[k]
        },
        set: function(k,v) {
            this.cache[k] = {v: v};
            // Copy the last-modified date for later verification.
            if (v.lastModifiedDate) {
                this.cache[k].lastModifiedDate = v.lastModifiedDate;
            }
        },
        get: function(k) {
            if (this.cache[k]) {
                var v = this.cache[k].v;
                // If the file was modified, then the file object's last-modified date
                // will be different (greater than) the copied date. In this case the
                // file object will have stale contents so we must invalidate the cache.
                // This happens when reading files from Google Drive.
                if (v.lastModifiedDate && this.cache[k].lastModifiedDate < v.lastModifiedDate) {
                    console.log("invalidate file by lastModifiedDate");
                    this.unset(k);
                    return null;
                } else {
                    return v;
                }
            }
        }
    }
    _.extend(EntryCache.prototype, EntryCacheprototype)

    return new EntryCache()
    // window.entryFileCache = new EntryCache

})();
module.exports.entryFileCache = (function() {

    function EntryCache() {
        this.cache = {}
        if ( arguments.callee._singletonInstance )
            return arguments.callee._singletonInstance;
        arguments.callee._singletonInstance = this;
    }
    var EntryCacheprototype = {
        clearTorrent: function() {
            // todo
        },
        clearKey: function(skey) {
            var todelete = []
            for (var key in this.cache) {
                if (key.startsWith(skey)) {
                    todelete.push(key)
                }
            }
            for (var i=0; i<todelete.length; i++) {
                delete this.cache[todelete[i]]
            }
        },
        clear: function() {
            this.cache = {}
        },
        unset: function(k) {
            delete this.cache[k]
        },
        set: function(k,v) {
            this.cache[k] = {v: v};
            // Copy the last-modified date for later verification.
            if (v.lastModifiedDate) {
                this.cache[k].lastModifiedDate = v.lastModifiedDate;
            }
        },
        get: function(k) {
            if (this.cache[k]) {
                var v = this.cache[k].v;
                // If the file was modified, then the file object's last-modified date
                // will be different (greater than) the copied date. In this case the
                // file object will have stale contents so we must invalidate the cache.
                // This happens when reading files from Google Drive.
                if (v.lastModifiedDate && this.cache[k].lastModifiedDate < v.lastModifiedDate) {
                    console.log("invalidate file by lastModifiedDate");
                    this.unset(k);
                    return null;
                } else {
                    return v;
                }
            }
        }
    }
    _.extend(EntryCache.prototype, EntryCacheprototype)

    return new EntryCache()
    // window.entryFileCache = new EntryCache

})();

console.log(module.exports);