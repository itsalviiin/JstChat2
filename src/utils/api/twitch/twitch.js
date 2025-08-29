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
    this.badges = await this.getGlobalBadges(this.channel)
    this.badges['subscriber'] = await this.getSubscriberBadges(this.userID)
    this.profileImg = userInfo.profile
  }

  async getGlobalBadges(user_id) {
    let badges = {}
    try {
      let response = await fetch('https://api.spanix.team/global_badges/')
      if (response.ok) {
        let json = await response.json()
        for (const value of json.badges) {
          if (!Object.keys(badges).includes(value['setID'])) {
            badges[value["setID"]] = {}
          }
          badges[value["setID"]][value["version"]] = value['image_url_2x']
        }

        /** Add channel specific badges (bits etc.) */
        let channelRequest = await fetch(`https://api.spanix.team/get_info/${user_id}`)
        if (channelRequest.ok) {
          json = await channelRequest.json()
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
    } catch (e) {
      console.log(e)
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
  async getSubscriberBadges(user_id) {
    let subscriber = {}

    const response = await fetch(`https://api.ivr.fi/v2/twitch/badges/channel?id=${user_id}`)
    const json = await response.json()
    if (response.ok && json.length > 0) {
      for (const obj of json) {
        if (obj['set_id'] == 'subscriber') {
          let vers = obj['versions']
          let finalVersions = {}
          for (const value of vers) {
            finalVersions[value['id']] = value['image_url_2x']
          }
          subscriber = finalVersions
          return subscriber
        }
      }
    }
    if (response.status != 404 && json.length > 0) {
      throw 'not loaded'
    }
    return {}
  }
}
