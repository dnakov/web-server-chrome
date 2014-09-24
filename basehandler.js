var _ = require('lodash');
module.exports = (function() { 
    
    var MIMETYPES = require('./mime.js').MIMETYPES;
    var HTTPRESPONSES = require('./httplib.js')

    function BaseHandler() {
        this.headersWritten = false
        this.responseHeaders = {}
        this.responseData = []
        this.responseLength = null
    }
    _.extend(BaseHandler.prototype, {
        get_argument: function(key,def) {
            if (this.request.arguments[key] !== undefined) {
                return this.request.arguments[key]
            } else {
                return def
            }
        },
        setHeader: function(k,v) {
            this.responseHeaders[k] = v
        },
        writeHeaders: function(code, callback) {
            if (code === undefined || isNaN(code)) { code = 200 }
            this.headersWritten = true
            var lines = []
            if (code == 200) {
                lines.push('HTTP/1.1 200 OK')
            } else {
                //console.log(this.request.connection.stream.sockId,'response code',code, this.responseLength)
                lines.push('HTTP/1.1 '+ code + ' ' + HTTPRESPONSES[code])
            }
            console.log(this.request.connection.stream.sockId,'response code',code, 'clen',this.responseLength)
            console.assert(typeof this.responseLength == 'number')
            lines.push('content-length: ' + this.responseLength)

            var p = this.request.path.split('.')
            if (p.length > 1 && ! this.isDirectoryListing) {
                var ext = p[p.length-1].toLowerCase()
                if (MIMETYPES[ext]) {
                    this.setHeader('content-type',MIMETYPES[ext])
                }
            }

            for (key in this.responseHeaders) {
                lines.push(key +': '+this.responseHeaders[key])
            }
            lines.push('\r\n')
            var headerstr = lines.join('\r\n')
            //console.log('write headers',headerstr)
            this.request.connection.write(headerstr, callback)
        },
        write: function(data, code) {
            if (code === undefined) { code = 200 }
            this.responseData.push(data)
            this.responseLength += (data.length || data.byteLength)
            // todo - support chunked response?
            if (! this.headersWritten) {
                this.writeHeaders(code)
            }
            for (var i=0; i<this.responseData.length; i++) {
                this.request.connection.write(this.responseData[i])
            }
            this.responseData = []
            this.finish()
        },
        finish: function() {
            if (this.beforefinish) { this.beforefinish() }
            this.request.connection.curRequest = null
            if (this.request.isKeepAlive() && ! this.request.connection.stream.remoteclosed) {
                this.request.connection.tryRead()
                console.log('webapp.finish(keepalive)')
            } else {
                this.request.connection.close()
                console.log('webapp.finish(close)')
            }
        }
    })
    
    return BaseHandler;
});