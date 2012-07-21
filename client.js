(function() {

  setModule("client", function() {
    var RedYarn;
    RedYarn = getModule("red-yarn");
    return {
      create: function() {
        var ClientUi, client, clientUi;
        ClientUi = getModule("client-ui");
        clientUi = ClientUi.create();
        client = RedYarn.createClient("drewl.us:9014", function(err, server) {
          window.server = server;
          return server.call("getServerTime", function(err, time) {
            return console.log("server time is " + time);
          });
        });
        client.getClientTime = function(cb) {
          cb(null, Date.now());
          return console.log("the server got my time!");
        };
        client.setMembers = function(members, cb) {
          console.log(members);
          window.members = members;
          return cb();
        };
        window.find = function(name) {
          return _.select(members.households, function(member) {
            return member.coupleName.match(new RegExp(name, "i"));
          });
        };
        window.api = function(url, cb) {
          return server.call("api", url, function(err, data) {
            window.response = data;
            console.log(data);
            return typeof cb === "function" ? cb(err, data) : void 0;
          });
        };
        return client;
      }
    };
  });

}).call(this);
