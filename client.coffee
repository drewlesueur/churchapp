setModule "client", () ->
  RedYarn = getModule "red-yarn"
  create: ->
    ClientUi = getModule("client-ui")
    clientUi = ClientUi.create()
    client = RedYarn.createClient "drewl.us:9014", (err, server) ->
      window.server = server
      server.call "getServerTime", (err, time) ->
        console.log "server time is #{time}"

    client.getClientTime = (cb) ->
      cb null, Date.now()
      console.log "the server got my time!"

    client.setMembers = (members, cb) ->
      console.log members
      window.members = members
      cb()

    window.find = (name) ->
      _.select members.households, (member) ->
        member.coupleName.match new RegExp(name, "i")

    window.api = (url, cb) ->
      server.call "api", url, (err, data) ->
        window.response = data
        console.log data
        cb?(err, data)


    client



