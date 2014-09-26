module.exports = {

    parseHeaders: function parseHeaders(lines) {
        var headers = {}
        // TODO - multi line headers?
        for (var i=0;i<lines.length;i++) {
            var l = lines[i].split(':')
            headers[l[0].toLowerCase()] = l[1].trim()
        }
        return headers

    },
    ui82str: function ui82str(arr, startOffset) {
        console.assert(arr)
        if (! startOffset) { startOffset = 0 }
        var length = arr.length - startOffset // XXX a few random exceptions here
        var str = ""
        for (var i=0; i<length; i++) {
            str += String.fromCharCode(arr[i + startOffset])
        }
        return str
    },
    ui82arr: function ui82arr(arr, startOffset) {
        if (! startOffset) { startOffset = 0 }
        var length = arr.length - startOffset
        var outarr = []
        for (var i=0; i<length; i++) {
            outarr.push(arr[i + startOffset])
        }
        return outarr
    },
    str2ab: function str2ab(s) {
        var arr = []
        for (var i=0; i<s.length; i++) {
            arr.push(s.charCodeAt(i))
        }
        return new Uint8Array(arr).buffer
    },

    stringToUint8Array: function(string) {
        var buffer = new ArrayBuffer(string.length);
        var view = new Uint8Array(buffer);
        for(var i = 0; i < string.length; i++) {
            view[i] = string.charCodeAt(i);
        }
        return view;
    },

    arrayBufferToString: function(buffer) {
        var str = '';
        var uArrayVal = new Uint8Array(buffer);
        for(var s = 0; s < uArrayVal.length; s++) {
            str += String.fromCharCode(uArrayVal[s]);
        }
        return str;
    },

}