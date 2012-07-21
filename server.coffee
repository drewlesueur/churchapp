setModule "server", ->
  RedYarn = getModule "red-yarn"
  request = getModule "request"
  async = getModule "async"
  config = getModule "config"
  _ = getModule "underscore"

  # https://tech.lds.org/wiki/index.php/LDS_Mobile_Web_Services 
  # https://tech.lds.org/mobile/ldstools/config.json

  login = (cb) ->
    request.post "https://lds.org/login.html",
      form: 
        username: config.username
        password: config.password
    , (error, response, body) ->
      cb error

  getCurrentUserUnit = (cb) ->
    url = "https://www.lds.org/directory/services/ludrs/mem/current-user-unitNo"
    request url, (err, resp, body) ->
      console.log "user unit"
      unit = JSON.parse(body).message
      cb err, unit

    
  getWardMembers = (ward, cb) ->
    wardUrl = "https://lds.org/directory/services/ludrs/mem/member-detaillist/%@" 
    wardUrl = "https://www.lds.org/directory/services/ludrs/mem/member-detaillist-with-callings/%@"
    wardUrl = wardUrl.replace "%@", ward
    request wardUrl, (error, response, body) ->
      cb error, JSON.parse body


  create: () -> 
    server = RedYarn.createServer "drewl.us:9014", (err, client) ->
      client.call "setWards", wards, () ->
        console.log "set ward"

      client.call "setMembers", members, () ->

    server.getServerTime = (cb) ->
      cb null, Date.now()

    server.api = (url, cb) ->
      request url, (err, response, body) ->
        cb err, body

    wards = []
    members = []
    async.series [login, getCurrentUserUnit], (err, responses) ->
      unit = responses[1]
      getWardMembers unit, (err, _members) ->
        members = _members

    server



