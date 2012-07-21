(function() {

  setModule("server", function() {
    var RedYarn, async, config, getCurrentUserUnit, getWardMembers, login, request, _;
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
    getCurrentUserUnit = function(cb) {
      var url;
      url = "https://www.lds.org/directory/services/ludrs/mem/current-user-unitNo";
      return request(url, function(err, resp, body) {
        var unit;
        console.log("user unit");
        unit = JSON.parse(body).message;
        return cb(err, unit);
      });
    };
    getWardMembers = function(ward, cb) {
      var wardUrl;
      wardUrl = "https://lds.org/directory/services/ludrs/mem/member-detaillist/%@";
      wardUrl = "https://www.lds.org/directory/services/ludrs/mem/member-detaillist-with-callings/%@";
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
          return client.call("setMembers", members, function() {});
        });
        server.getServerTime = function(cb) {
          return cb(null, Date.now());
        };
        server.api = function(url, cb) {
          return request(url, function(err, response, body) {
            return cb(err, body);
          });
        };
        wards = [];
        members = [];
        async.series([login, getCurrentUserUnit], function(err, responses) {
          var unit;
          unit = responses[1];
          return getWardMembers(unit, function(err, _members) {
            return members = _members;
          });
        });
        return server;
      }
    };
  });

}).call(this);
