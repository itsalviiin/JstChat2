export default {
  /** Used for Personal Emotes */
  async get7tvEmoteSet(set_id, hideUnlistedEmotes, hidePrivateEmotes) {
    const response = await fetch(`https://7tv.io/v3/emote-sets/${set_id}`)
    if (response.ok) {
      let emotes = []

      const json = await response.json()
      if (json.emotes != undefined) {
        for (const emote of json.emotes) {
          if (hideUnlistedEmotes == 'true') {
            if (!emote.data.listed) {
              continue
            }
          }
          if (hidePrivateEmotes == 'true') {
            if (emote.data.flags == 1) {
              continue
            }
          }
          emotes.push({
            Name: emote.name,
            ID: emote.id,
            Type: '7TV',
            ZeroWidth: emote.flags == 1,
            width: emote.data.host.files[1].width,
            height: emote.data.host.files[1].height,
          })
        }

        let owner
        for (const connection of json.owner.connections) {
          if (connection.platform == "TWITCH") {
            owner = connection.id
          }
        }

        return [emotes, owner]
      } else {
        return [undefined, undefined]
      }
    }
    throw 'failed to fetch 7tv emote set'
  },

  /** Used for channel emotes */
  async get7tvEmotes(user_id, hideUnlistedEmotes, hidePrivateEmotes) {
    let emotes = {}

    const response = await fetch(`https://7tv.io/v3/users/twitch/${user_id}`)
    if (response.ok) {
      const json = await response.json()
      for (const value of json.emote_set.emotes) {
        if (hideUnlistedEmotes == 'true') {
          if (!value.data.listed) {
            continue
          }
        }
        if (hidePrivateEmotes == 'true') {
          if (value.data.flags == 1) {
            continue
          }
        }
        emotes[value.name] = {
          ID: value.id,
          Type: '7TV',
          ZeroWidth: value.flags == 1,
          width: value.data.host.files[1].width,
          height: value.data.host.files[1].height,
        }
      }
      return [emotes, json.emote_set.id]
    }
    if (response.status != 404) {
      throw '7tv not loaded'
    }
    return {}
  },

  async get7tvEmoteSetObj(emoteSetID, hideUnlistedEmotes, hidePrivateEmotes) {
    let emotes = {}

    const response = await fetch(`https://7tv.io/v3/emote-sets/${emoteSetID}`)
    if (response.ok) {
      const json = await response.json()
      for (const value of json.emotes) {
        if (hideUnlistedEmotes == 'true') {
          if (!value.data.listed) {
            continue
          }
        }
        if (hidePrivateEmotes == 'true') {
          if (value.data.flags == 1) {
            continue
          }
        }
        emotes[value.name] = {
          ID: value.id,
          Type: '7TV',
          ZeroWidth: value.flags == 1,
          width: value.data.host.files[1].width,
          height: value.data.host.files[1].height,
        }
      }
      return emotes
    }
    if (response.status != 404) {
      throw 'not loaded'
    }
    return {}
  },
}
