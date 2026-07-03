export default {
  async getBTTVGlobalEmotes() {
    try {
      const response = await fetch(`https://api.betterttv.net/3/cached/emotes/global`, { signal: AbortSignal.timeout(10000) })
      if (response.ok) {
        const json = await response.json()

        var emotes = {}

        for (const value of json) {
          emotes[value.code] = {
            id: value.id,
            type: 'BTTV',
            zeroWidth: value.id === '567b5b520e984428652809b6'   // SoSnowy
              || value.id === '567b5c080e984428652809ba'         // CandyCane
              || value.id === '567b5dc00e984428652809bd'         // ReinDeer
              || value.id === '58487cc6f52be01a7ee5f205'         // SantaHat
              || value.id === '5849c9a4f52be01a7ee5f79d'         // IceCold
              || value.id === '5849c9c8f52be01a7ee5f79e'         // TopHat
              || value.id === '5e76d338d6581c3724c0f0b2'         // cvHazmat
              || value.id === '5e76d399d6581c3724c0f0b8',        // cvMask
            width: value.width ? value.width * 2 : 56,
            height: value.height ? value.height * 2 : 56
          }
        }
        return emotes
      } else {
        console.log(`[BTTV API] Failed to fetch BTTV Global Emotes`)
      }
    } catch {
      console.log(`[BTTV API] Failed to fetch BTTV Global Emotes`)
    }
    return {}
  },

  async getBTTVEmotes(userID) {
    try {
      const response = await fetch(`https://api.betterttv.net/3/cached/users/twitch/${userID}`, { signal: AbortSignal.timeout(10000) })
      if (response.ok) {
        const json = await response.json()

        var emotes = {}

        if (json.sharedEmotes) {
          for (const value of json.sharedEmotes) {
            emotes[value.code] = {
              id: value.id,
              type: 'BTTV',
              width: value.width ? value.width * 2 : 56,
              height: value.height ? value.height * 2 : 56
            }
          }
        }
        if (json.channelEmotes) {
          for (const value of json.channelEmotes) {
            emotes[value.code] = {
              id: value.id,
              type: 'BTTV',
              width: value.width ? value.width * 2 : 56,
              height: value.height ? value.width * 2 : 56
            }
          }
        }
        return emotes
      } else {
        console.log(`[BTTV API] Failed to fetch BTTV Channel Emotes`)
      }
    } catch {
      console.log(`[BTTV API] Failed to fetch BTTV Channel Emotes`)
    }
    return {}
  },

  async getBTTVBadges() {
    try {
      const response = await fetch(`https://api.betterttv.net/3/cached/badges/twitch`, { signal: AbortSignal.timeout(10000) })
      if (response.ok) {
        const json = await response.json()

        var badges = {}

        for (const b of json) {
          if (!badges[b.badge.type]) {
            badges[b.badge.type] = { id: b.type, url: b.badge.svg, users: [] }
          }
          badges[b.badge.type].users.push(b.providerId)
        }
        return [...Object.values(badges)]
      } else {
        console.log(`[BTTV API] Failed to fetch BTTV Badges`)
      }
    } catch {
      console.log(`[BTTV API] Failed to fetch BTTV Badges`)
    }
    return {}
  },
}
