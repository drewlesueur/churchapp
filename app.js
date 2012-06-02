(function() {
  var Server, async, config, request, ws, _;

  require("poor-module");

  require("./node_modules/red-yarn/rpc.js");

  require("./node_modules/red-yarn/red-yarn.js");

  require("./server.js");

  config = require("../config.js").churchapp;

  console.log(config);

  request = require("request");

  async = require("async");

  _ = require("underscore");

  ws = require("ws");

  setModule("underscore", function() {
    return _;
  });

  setModule("async", function() {
    return async;
  });

  setModule("ws", function() {
    return ws;
  });

  setModule("request", function() {
    return request;
  });

  setModule("config", function() {
    return config;
  });

  Server = getModule("server");

  Server.create();

}).call(this);
