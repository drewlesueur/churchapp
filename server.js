(function() {

  setModule("server", function() {
    var RedYarn, async, config, findTwinKnollsWard, getStakeUnits, getWardMembers, login, request, _;
    RedYarn = getModule("red-yarn");
    request = getModule("request");
    async = getModule("async");
    config = getModule("config");
    _ = getModule("underscore");
    login = function(cb) {
      return request.post("https://lds.org/login.html", {
        form: {
          username: config.username,
          password: config.password
        }
      }, function(error, response, body) {
        return cb(error);
      });
    };
    getStakeUnits = function(cb) {
      return request("https://lds.org/directory/services/ludrs/unit/current-user-stake-wards", function(error, response, body) {
        return cb(error, JSON.parse(body));
      });
    };
    findTwinKnollsWard = function(wards) {
      var twinKnolls;
      twinKnolls = _.find(wards, function(ward) {
        return ward.wardName === "Twin Knolls Ward";
      });
      return twinKnolls.wardUnitNo;
    };
    getWardMembers = function(ward, cb) {
      var wardUrl;
      wardUrl = "https://lds.org/directory/services/ludrs/mem/member-detaillist/%@";
      wardUrl = wardUrl.replace("%@", ward);
      return request(wardUrl, function(error, response, body) {
        return cb(error, JSON.parse(body));
      });
    };
    return {
      create: function() {
        var members, server, wards;
        server = RedYarn.createServer("drewl.us:9014", function(err, client) {
          client.call("setWards", wards, function() {
            return console.log("set ward");
          });
          return client.call("setTwinKnowllsMembers", members, function() {});
        });
        server.getServerTime = function(cb) {
          return cb(null, Date.now());
        };
        wards = [];
        members = [];
        async.series([login, getStakeUnits], function(err, responses) {
          var twinKnollsId;
          wards = responses[1];
          console.log("wards are");
          console.log(wards);
          twinKnollsId = findTwinKnollsWard(wards);
          return getWardMembers(twinKnollsId, function(err, _members) {
            return members = _members;
          });
        });
        return server;
      }
    };
  });

}).call(this);
