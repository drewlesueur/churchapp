(function() {
  var __slice = Array.prototype.slice;

  setModule("rpc", function() {
    return {
      create: function() {
        var self, uuid,
          _this = this;
        self = {};
        self.callbacks = {};
        self.methods = {};
        uuid = function() {
          return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {var r = Math.random()*16|0,v=c=='x'?r:r&0x3|0x8;return v.toString(16);});;
        };
        self.rawSend = function() {};
        self.receive = function(obj) {
          var cb, error, id, method, params, result, _base, _base2;
          if (obj.result || obj.error) {
            result = obj.result, error = obj.error, id = obj.id;
            if (typeof (_base = self.callbacks)[id] === "function") {
              _base[id](error, result);
            }
            return delete self.callbacks[id];
          } else if (obj.method) {
            method = obj.method, params = obj.params, id = obj.id;
            cb = function(err, result) {
              return self.rawSend({
                result: result,
                error: err,
                id: id
              });
            };
            if (typeof (_base2 = self.methods)[method] === "function") {
              _base2[method].apply(_base2, __slice.call(params).concat([cb]));
            }
            return cb;
          }
        };
        self.send = function(method, args, callback) {
          self.lastId = uuid();
          self.callbacks[self.lastId] = callback;
          return self.rawSend({
            method: method,
            params: args,
            id: self.lastId
          });
        };
        return self;
      }
    };
  });

}).call(this);
