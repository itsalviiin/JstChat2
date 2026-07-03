export default {
  async getFFZGlobalEmotes() {
    try {
      const response = await fetch(`https://api.frankerfacez.com/v1/set/global`, { signal: AbortSignal.timeout(10000) })
      if (response.ok) {
        const json = await response.json()

        var emotes = {}

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
      } else {
        console.log(`[FFZ API] Failed to fetch FFZ Global Emotes`)
      }
    } catch {
      console.log(`[FFZ API] Failed to fetch FFZ Global Emotes`)
    }
    return {}
  },

  async getFFZEmotes(channel) {
    /** Returns emotes, custom mod badge, and custom vip badge */

    /** Emotes */
    try {
      const response = await fetch(`https://api.frankerfacez.com/v1/room/${channel}`, { signal: AbortSignal.timeout(10000) })
      if (response.ok) {
        const json = await response.json()

        var emotes = {}

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
        var modBadge = json.room.mod_urls ? `https://cdn.frankerfacez.com/room-badge/mod/${channel}/2/rounded` : undefined
        var vipBadge = json.room.vip_badge ? `https://cdn.frankerfacez.com/room-badge/vip/${channel}/2` : undefined
        return { emotes, modBadge, vipBadge }
      } else {
        console.log(`[FFZ API] Failed to fetch FFZ Channel Emotes`)
      }
    } catch {
      console.log(`[FFZ API] Failed to fetch FFZ Channel Emotes`)
    }
    return []
  },

  async getFFZBadges() {
    try {
      const response = await fetch(`https://api.frankerfacez.com/v1/badges/ids`, { signal: AbortSignal.timeout(10000) })
      if (response.ok) {
        const json = await response.json()

        var badges = []

        for (const b of json.badges) {
          badges.push({ id: b.id, name: b.name, url: `https://cdn.frankerfacez.com/badge/${b.id}/2/rounded`, users: json.users[b.id] })
        }
        return badges
      } else {
        console.log(`[FFZ API] Failed to fetch FFZ Badges`)
      }
    } catch {
      console.log(`[FFZ API] Failed to fetch FFZ Badges`)
    }
    return []
  },

  async getFFZChannelBadges(channel) {
    try {
      const channelResponse = await fetch(`https://api.frankerfacez.com/v1/_room/${channel}`, { signal: AbortSignal.timeout(10000) })
      if (channelResponse.ok) {
        const channelJson = await channelResponse.json()

        var badges = []

        if (channelJson.room.user_badges['2']) {
          badges.push({ id: '2', url: `https://cdn.frankerfacez.com/badge/2/2/rounded`, users: channelJson.room.user_badges['2'] })
        }
        return badges
      } else {
        console.log(`[FFZ API] Failed to fetch FFZ Channel Badges`)
      }
    } catch {
      console.log(`[FFZ API] Failed to fetch FFZ Channel Badges`)
    }
    return []
  }
}
