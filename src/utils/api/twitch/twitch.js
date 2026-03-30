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
    var badges = {}

    try {
      const response = await fetch('https://api.spanix.team/global_badges/', { signal: AbortSignal.timeout(5000) })
      if (response.ok) {
        const json = await response.json()
        for (const value of json.badges) {
          if (!Object.keys(badges).includes(value['setID'])) {
            badges[value["setID"]] = {}
          }
          badges[value["setID"]][value["version"]] = value['image_url_2x']
        }
      }
    } catch {
      console.log(`Unable to fetch global badges, trying alterative api`)
      try {
        const response = await fetch('https://api.ivr.fi/v2/twitch/badges/global', { signal: AbortSignal.timeout(5000) })
        if (response.ok) {
          const json = await response.json()
          for (const value of json) {
            let vers = value['versions']
            let finalVersions = {}
            for (const value of vers) {
              finalVersions[value['id']] = value['image_url_2x']
            }
            badges[value['set_id']] = finalVersions
          }
        }

      } catch {
        console.log(`Failed to fetch global badges`)
      }
    }

    /** Add channel specific badges (bits etc.) */
    try {
      const channelRequest = await fetch(`https://api.spanix.team/get_info/${channel}`, { signal: AbortSignal.timeout(5000) })
      if (channelRequest.ok) {
        const json = await channelRequest.json()
        for (const value of json.user.broadcastBadges) {
          if (!Object.keys(badges).includes(value['setID'])) {
            badges[value["setID"]] = {}
          }
          badges[value["setID"]][value["version"]] = value['image_url_2x']
        }
      }
    } catch {
      console.log(`Unable to fetch channel badges, trying alterative api`)
      try {
        const channelRequest = await fetch(`https://api.ivr.fi/v2/twitch/badges/channel?id=${user_id}`, { signal: AbortSignal.timeout(5000) })
        if (channelRequest.ok) {
          const json = await channelRequest.json()
          for (const value of json) {
            let vers = value['versions']
            let finalVersions = {}
            for (const value of vers) {
              finalVersions[value['id']] = value['image_url_2x']
            }
            badges[value['set_id']] = finalVersions
          }

        }
      } catch {
        console.log(`Failed to fetch channel badges`)
      }
    }
    return badges
  }

  async getUserID(channel) {
    try {
      const response = await fetch(`https://api.ivr.fi/v2/twitch/user?login=${channel}`, { signal: AbortSignal.timeout(5000) })
      if (response.ok) {
        const json = await response.json()
        return {
          id: json[0].id,
          prefix: json[0].emotePrefix,
          isPartner: json[0].roles.isPartner,
          profile: json[0].logo
        }
      }
    } catch {
      console.log(`Unable to get user id, trying alternative`)
      try {
        let channelRequest = await fetch(`https://api.spanix.team/get_info/${channel}`, { signal: AbortSignal.timeout(5000) })
        if (channelRequest.ok) {
          const json = await channelRequest.json()
          return {
            id: json.user.id,
            prefix: undefined,
            isPartner: json.user.roles.isPartner,
            profile: json.user.profileImageURL.replaceAll("150", "600")
          }
        }
      } catch {
        console.log(`Failed to get user id`)
      }
    }
    return {
      id: "",
      prefix: undefined,
      isPartner: undefined,
      profile: null
    }
  }
}
