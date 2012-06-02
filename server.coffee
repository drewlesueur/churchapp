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

  getStakeUnits = (cb) ->
    request "https://lds.org/directory/services/ludrs/unit/current-user-stake-wards", (error, response, body) ->
      cb error, JSON.parse body


  findTwinKnollsWard = (wards) ->
    twinKnolls = _.find wards, (ward) ->
      ward.wardName == "Twin Knolls Ward"
    twinKnolls.wardUnitNo

  getWardMembers = (ward, cb) ->
    wardUrl = "https://lds.org/directory/services/ludrs/mem/member-detaillist/%@" 
    wardUrl = wardUrl.replace "%@", ward
    request wardUrl, (error, response, body) ->
      cb error, JSON.parse body


  create: () -> 
    server = RedYarn.createServer "drewl.us:9014", (err, client) ->
      client.call "setWards", wards, () ->
        console.log "set ward"

      client.call "setTwinKnowllsMembers", members, () ->

    server.getServerTime = (cb) ->
      cb null, Date.now()

    wards = []
    members = []
    async.series [login, getStakeUnits], (err, responses) ->
      wards = responses[1]
      console.log "wards are"
      console.log wards
      twinKnollsId = findTwinKnollsWard wards
      getWardMembers twinKnollsId, (err, _members) ->
        members = _members

    server



