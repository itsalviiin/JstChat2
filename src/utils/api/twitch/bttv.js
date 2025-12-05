export default {
  async getBTTVEmotes(user_id) {
    let emotes = {}
    try {
      const response = await fetch(`https://api.betterttv.net/3/cached/users/twitch/${user_id}`)
      if (response.ok) {
        const json = await response.json()
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
      }
      if (response.status != 404) {
        throw 'not loaded'
      }
    } catch (e) {
      console.log(e)
    }
    return {}
  },
  async getBTTVGlobalEmotes() {
    let emotes = {}

    try {

      const response = await fetch(`https://api.betterttv.net/3/cached/emotes/global`)
      if (response.ok) {
        const json = await response.json()
        for (const value of json) {
          emotes[value.code] = {
            id: value.id,
            type: 'BTTV',
            zeroWidth: value.id == '567b5b520e984428652809b6'   // SoSnowy
              || value.id == '567b5c080e984428652809ba'         // CandyCane
              || value.id == '567b5dc00e984428652809bd'         // ReinDeer
              || value.id == '58487cc6f52be01a7ee5f205'         // SantaHat
              || value.id == '5849c9a4f52be01a7ee5f79d'         // IceCold
              || value.id == '5849c9c8f52be01a7ee5f79e'         // TopHat
              || value.id == '5e76d338d6581c3724c0f0b2'         // cvHazmat
              || value.id == '5e76d399d6581c3724c0f0b8',        // cvMask
            width: value.width ? value.width * 2 : 56,
            height: value.height ? value.height * 2 : 56
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
  async getBttvBadges() {
    let badges = {}
    try {
      const response = await fetch(`https://api.betterttv.net/3/cached/badges/twitch`)
      if (response.ok) {
        const json = await response.json()
        for (const b of json) {
          if (!badges[b.badge.type]) {
            badges[b.badge.type] = { id: b.type, url: b.badge.svg, users: [] }
          }
          badges[b.badge.type].users.push(b.providerId)
        }
        return [...Object.values(badges)]
      }
      if (response.status != 404) {
        throw 'not loaded'
      }
    } catch (e) {
      console.log(e)
    }
    return {}
  },
}
