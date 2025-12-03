export default {
  async getFfzEmotes(channel) {
    /** Returns emotes, custom mod badge, and custom vip badge */
    let emotes = {}

    /** Emotes */
    try {
      const response = await fetch(`https://api.frankerfacez.com/v1/room/${channel}`)
      if (response.ok) {
        const json = await response.json()
        for (const value of json.sets[json.room.set.toString()].emoticons) {
          emotes[value.name] = {
            id: value.id,
            type: 'FFZ',
            animated: 'animated' in value,
            width: value.width * 2,
            height: value.height * 2
          }
        }

        /** Custom Badges */
        let mod_badge = undefined
        if (json.room.mod_urls != undefined) mod_badge = `https://cdn.frankerfacez.com/room-badge/mod/${channel}/2/rounded`

        let vip_badge = undefined
        if (json.room.vip_badge != undefined) vip_badge = `https://cdn.frankerfacez.com/room-badge/vip/${channel}/2`
        return [emotes, mod_badge, vip_badge]
      }
      if (response.status != 404) {
        throw 'not loaded'
      }
    } catch (e) {
      console.log(e)
    }
    return []
  },

  async getFfzGlobalEmotes() {
    let emotes = {}

    try {
      const response = await fetch(`https://api.frankerfacez.com/v1/set/global`)
      if (response.ok) {
        const json = await response.json()
        for (const value of json.sets['3'].emoticons) {
          emotes[value.name] = {
            id: value.id,
            type: 'FFZ',
            animated: 'animated' in value,
            width: value.width * 2,
            height: value.height * 2
          }
        }
        return emotes
      }
      if (response.status != 404) {
        throw 'not loaded'
      }
    } catch (e) {
      console.log(e)
    }
    return {}
  },

  async getFfzBadges() {
    let badges = []
    try {
      const response = await fetch(`https://api.frankerfacez.com/v1/badges/ids`)
      if (response.ok) {
        const json = await response.json()
        for (const b of json.badges) {
          badges.push({ id: b.id, name: b.name, url: `https://cdn.frankerfacez.com/badge/${b.id}/2/rounded`, users: json.users[b.id] })
        }
        return badges
      }
      if (response.status != 404) {
        throw 'not loaded'
      }
    } catch (e) {
      console.log(e)
    }
  },

  async getFfzChannelBadges(channel) {
    let badges = []
    try {
      const channelResponse = await fetch(`https://api.frankerfacez.com/v1/_room/${channel}`)
      if (channelResponse.ok) {
        const channelJson = await channelResponse.json()
        if (channelJson.room.user_badges['2']) {
          badges.push({ id: '2', url: `https://cdn.frankerfacez.com/badge/2/2/rounded`, users: channelJson.room.user_badges['2'] })
        }
        return badges
      }
      if (channelResponse.status != 404) {
        throw 'not loaded'
      }
    } catch (e) {
      console.log(e)
    }
  }
}
