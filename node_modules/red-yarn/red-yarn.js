(function() {
  var getUrlInfo, makeWebSocketServer,
    __slice = Array.prototype.slice;

  setModule("red-yarn", function() {
    var Rpc, giveRpcMyMethods, _;
    _ = getModule("underscore");
    Rpc = getModule("rpc");
    giveRpcMyMethods = function(me, rpc) {
      var methods;
      methods = _.methods(me);
      _.each(methods, function(method) {
        return rpc.methods[method] = me[method];
      });
      return methods;
    };
    return {
      createServer: function(url, callback) {
        var server, wss;
        server = {};
        server.connect = function(client) {};
        server.clients = [];
        wss = makeWebSocketServer(url, function() {});
        wss.on("connection", function(ws) {
          var client, rpc;
          client = {};
          client.ws = ws;
          rpc = Rpc.create();
          giveRpcMyMethods(server, rpc);
          rpc.rawSend = function(obj) {
            return ws.send(JSON.stringify(obj));
          };
          client.call = function() {
            var args, callback, method, _i;
            method = arguments[0], args = 3 <= arguments.length ? __slice.call(arguments, 1, _i = arguments.length - 1) : (_i = 1, []), callback = arguments[_i++];
            return rpc.send(method, args, callback);
          };
          server.clients.push(ws);
          server.connect(client);
          console.log("**connection**");
          ws.on("message", function(message) {
            return rpc.receive(JSON.parse(message));
          });
          return callback(null, client);
        });
        wss.on("close", function(ws) {});
        wss.on("error", function(ws) {});
        return server;
      },
      createClient: function(url, callback) {
        var client, rpc, ws;
        client = {};
        ws = new WebSocket("ws://" + url);
        window.ws = ws;
        rpc = Rpc.create();
        ws.onopen = function() {
          var server;
          server = {};
          rpc = Rpc.create();
          giveRpcMyMethods(client, rpc);
          rpc.rawSend = function(obj) {
            return ws.send(JSON.stringify(obj));
          };
          server.call = function() {
            var args, callback, method, _i;
            method = arguments[0], args = 3 <= arguments.length ? __slice.call(arguments, 1, _i = arguments.length - 1) : (_i = 1, []), callback = arguments[_i++];
            return rpc.send(method, args, callback);
          };
          return callback(null, server);
        };
        ws.onmessage = function(event) {
          return rpc.receive(JSON.parse(event.data));
        };
        ws.onerror = function() {};
        return client;
      }
    };
  });

  getUrlInfo = function(url) {
    var splitUrl;
    url || (url = "");
    splitUrl = url.split(":");
    return {
      host: splitUrl[0] || "127.0.0.1",
      port: splitUrl[1] || 80
    };
  };

  makeWebSocketServer = function(url, callback) {
    var WebSocketServer, host, port, ws, wss, _ref;
    ws = getModule("ws");
    WebSocketServer = require("ws").Server;
    _ref = getUrlInfo(url), host = _ref.host, port = _ref.port;
    wss = new WebSocketServer({
      port: port,
      host: host
    }, callback);
    return wss;
  };

}).call(this);
