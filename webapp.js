
var IOStream = require('./stream.js');
var HTTPConnection = require('./connection.js');

module.exports = (function(){
    var sockets = chrome.sockets;

    function WebApplication(opts) {
        this.opts = opts
        this.handlers = opts.handlers
        this.handlersMatch = []

        for (var i=0; i<this.handlers.length; i++) {
            var repat = this.handlers[i][0]
            this.handlersMatch.push( [new RegExp(repat), this.handlers[i][1]] )
        }

        this.host = opts.host || '127.0.0.1'
        this.port = opts.port
        this.sockInfo = null
        this.lasterr = null
        this.stopped = false
    }

    WebApplication.prototype = {
        error: function(data) {
            console.error(data)
            this.lasterr = data
        },
        stop: function(cb) {
            sockets.tcp.disconnect(this.sockInfo.socketId)
            this.stopped = true
            cb();
        },
        start: function(cb) {
            sockets.tcpServer.create({name:"listenSocket"},function(sockInfo) {
                this.sockInfo = sockInfo;
                sockets.tcpServer.listen(this.sockInfo.socketId,
                                         this.host,
                                         this.port,
                              function(result) {
                                  if (result < 0) {
                                      this.error({message:'unable to bind to port',
                                                  errno:result})
                                      cb(this.lasterr);
                                  } else {
                                      console.log('Listening on',this.port,result)
                                      this.bindAcceptCallbacks()
                                      cb(null,this.sockInfo.socketId);
                                  }
                              }.bind(this))
            }.bind(this));
        },
        bindAcceptCallbacks: function() {
            sockets.tcpServer.onAcceptError.addListener(this.onAcceptError.bind(this))
            sockets.tcpServer.onAccept.addListener(this.onAccept.bind(this))
        },
        onAcceptError: function(acceptInfo) {
            console.error('accept error',this.sockInfo.socketId,acceptInfo)
            // set unpaused, etc
        },
        onAccept: function(acceptInfo) {
            //console.log('onAccept',acceptInfo);
            if (acceptInfo.socketId) {
                //var stream = new IOStream(acceptInfo.socketId)
                var stream = new IOStream(acceptInfo.clientSocketId)
                var connection = new HTTPConnection(stream)
                connection.addRequestCallback(this.onRequest.bind(this))
                connection.tryRead()
            }
            if (! this.stopped) {
                //this.doAccept() // new API no longer need to call this
            }
        },
        onRequest: function(request) {
            console.log('handle',request.method, request.uri)
            for (var i=0; i<this.handlersMatch.length; i++) {
                var re = this.handlersMatch[i][0]
                var reresult = re.exec(request.uri)
                if (reresult) {
                    var cls = this.handlersMatch[i][1]
                    var requestHandler = new cls(request)
                    requestHandler.request = request
                    var handlerMethod = requestHandler[request.method.toLowerCase()]
                    if (handlerMethod) {
                        handlerMethod.apply(requestHandler, reresult.slice(1))
                        return
                    }
                }
            }
            console.error('unhandled request',request)
        }
    }

    
    return WebApplication;

})();

