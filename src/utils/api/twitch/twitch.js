export default class TwitchAPI {
  constructor(channel) {
    this.channel = channel
    this.badges = {}
    this.userID = null
    this.emotePrefix = null
    this.profileImg = null
  }

  async fetchData() {
    let userInfo = await this.getUserID(this.channel)
    this.userID = userInfo.id
    this.emotePrefix = userInfo.isPartner ? userInfo.prefix : null
    this.badges = await this.getBadges(this.userID, this.channel)
    this.profileImg = userInfo.profile
  }

  async getBadges(user_id, channel) {
    let badges = {}
    try {
      let response = await fetch('https://api.ivr.fi/v2/twitch/badges/global')
      if (response.ok) {
        let json = await response.json()
        for (const value of json) {
          let vers = value['versions']
          let finalVersions = {}
          for (const value of vers) {
            finalVersions[value['id']] = value['image_url_2x']
          }
          badges[value['set_id']] = finalVersions
        }

        /** Add channel specific badges (bits etc.) */
        let channelRequest = await fetch(`https://api.ivr.fi/v2/twitch/badges/channel?id=${user_id}`)
        if (channelRequest.ok) {
          json = await channelRequest.json()
          for (const value of json) {
            let vers = value['versions']
            let finalVersions = {}
            for (const value of vers) {
              finalVersions[value['id']] = value['image_url_2x']
            }
            badges[value['set_id']] = finalVersions
          }

          return badges
        }
      }
      return {}
    } catch (e) {
      console.log(e)
      let response = await fetch('https://api.spanix.team/global_badges/', { signal: AbortSignal.timeout(5000) })
      if (response.ok) {
        let json = await response.json()
        for (const value of json.badges) {
          if (!Object.keys(badges).includes(value['setID'])) {
            badges[value["setID"]] = {}
          }
          badges[value["setID"]][value["version"]] = value['image_url_2x']
        }

        /** Add channel specific badges (bits etc.) */
        let channelRequest = await fetch(`https://api.spanix.team/get_info/${channel}`)
        if (channelRequest.ok) {
          json = await channelRequest.json()
          console.log(json)
          for (const value of json.user.broadcastBadges) {
            if (value['setID'] != 'subscriber') {
              if (!Object.keys(badges).includes(value['setID'])) {
                badges[value["setID"]] = {}
              }
              badges[value["setID"]][value["version"]] = value['image_url_2x']
            }
          }

          return badges
        }
      }
    }
    return {}
  }
  async getUserID(channel) {
    const response = await fetch(`https://api.ivr.fi/v2/twitch/user?login=${channel}`)
    if (response.ok) {
      const json = await response.json()
      return {
        id: json[0].id,
        prefix: json[0].emotePrefix,
        isPartner: json[0].roles.isPartner,
        profile: json[0].logo
      }
    }
    throw 'Unable to get user id from ivr API!'
  }
}
