module.exports = (function() {    
    // function haveentry(entry) {
    //     window.fs = new FileSystem(entry)
    // }
    // window.haveentry = haveentry

    function FileSystem(entry) {
        this.entry = entry
    }
    _.extend(FileSystem.prototype, {
        getByPath: function(path, callback) {
            if (path == '/') { 
                callback(this.entry)
                return
            }
            var parts = path.split('/')
            var newpath = parts.slice(1,parts.length)
            recursiveGetEntry(this.entry, newpath, callback)
        }
    })

    return FileSystem;
});