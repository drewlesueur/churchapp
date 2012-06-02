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
          return server.call("getServerTime", function(err, time) {
            return console.log("server time is " + time);
          });
        });
        client.getClientTime = function(cb) {
          cb(null, Date.now());
          return console.log("the server got my time!");
        };
        client.setWards = function(wards, cb) {
          console.log(wards);
          return cb();
        };
        client.setTwinKnowllsMembers = function(members, cb) {
          console.log(members);
          return cb();
        };
        return client;
      }
    };
  });

}).call(this);
