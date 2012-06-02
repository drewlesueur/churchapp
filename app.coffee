# this is line an index.html but for the server

require "poor-module"
require "./node_modules/red-yarn/rpc.js"
require "./node_modules/red-yarn/red-yarn.js"
require "./server.js"
config = require("../config.js").churchapp


console.log config

request = require "request"
async = require "async"

_ = require "underscore"
ws = require "ws"

setModule "underscore", -> _
setModule "async", -> async
setModule "ws", -> ws
setModule "request", -> request
setModule "config", -> config

Server = getModule "server"
Server.create()




