setModule "client", () ->
  RedYarn = getModule "red-yarn"
  create: ->
    ClientUi = getModule("client-ui")
    clientUi = ClientUi.create()
    client = RedYarn.createClient "drewl.us:9014", (err, server) ->
      server.call "getServerTime", (err, time) ->
        console.log "server time is #{time}"

    client.getClientTime = (cb) ->
      cb null, Date.now()
      console.log "the server got my time!"

    client.setWards = (wards, cb) ->
      console.log wards
      cb()

    client.setTwinKnowllsMembers = (members, cb) ->
      console.log members
      cb()

    client



