export default {
  /** Used for Personal Emotes */
  async get7tvEmoteSet(set_id) {
    const response = await fetch(`https://7tv.io/v3/emote-sets/${set_id}`, { signal: AbortSignal.timeout(10000) })
    if (response.ok) {
      let emotes = []

      const json = await response.json()
      if (json.emotes != undefined) {
        for (const emote of json.emotes) {
          emotes.push({
            Name: emote.name,
            id: emote.id,
            type: '7TV',
            zeroWidth: emote.flags == 1,
            unlisted: !emote.data.listed,
            private: emote.data.flags == 1,
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

  async get7tvEmoteSetObj(emoteSetID) {
    let emotes = {}

    const response = await fetch(`https://7tv.io/v3/emote-sets/${emoteSetID}`, { signal: AbortSignal.timeout(10000) })
    if (response.ok) {
      const json = await response.json()
      for (const value of json.emotes) {
        emotes[value.name] = {
          id: value.id,
          type: '7TV',
          zeroWidth: value.flags == 1,
          unlisted: !value.data.listed,
          private: value.data.flags == 1,
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

  async get7TVUser(userID) {
    let emotes = {}
    try {

      const getUser = await fetch(`https://7tv.io/v4/gql`, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          operationName: 'GetUserByConnection',
          variables: {
            platform: 'TWITCH',
            platformId: userID,
          },
          query: `
            query GetUserByConnection($platform: Platform!, $platformId: String!) {
              users {
                userByConnection(platform: $platform, platformId: $platformId) {
                  id
                  style {
                    activeBadgeId
                    activePaintId
                    activeEmoteSetId
                  }
                  mainConnection {
                    platform
                    platformId
                    platformUsername
                    platformDisplayName
                    platformAvatarUrl
                  }
                  emoteSets {
                    id
                    name
                    description
                    tags
                    capacity
                    ownerId
                    kind
                    updatedAt
                    searchUpdatedAt
                    emotes {
                      totalCount
                      pageCount
                      items {
                        id
                        alias
                        addedAt
                        addedById
                        originSetId
                        flags {
                          zeroWidth
                          overrideConflicts
                        }
                        emote {
                          id
                          ownerId
                          defaultName
                          tags
                          imagesPending
                          aspectRatio
                          deleted
                          updatedAt
                          flags {
                            publicListed
                            private
                            nsfw
                            defaultZeroWidth
                            approvedPersonal
                            deniedPersonal
                            animated
                          }
                          images {
                            url
                            mime
                            size
                            scale
                            width
                            height
                            frameCount
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          `,
        }),
      }, { signal: AbortSignal.timeout(10000) });

      const userData = await getUser.json()
      let currentSetID = userData.data.users.userByConnection.style.activeEmoteSetId
      let currentSetEmotes

      for (const set of userData.data.users.userByConnection.emoteSets) {
        if (set.id == currentSetID) {
          currentSetEmotes = set
        }
      }

      for (const emote of currentSetEmotes.emotes.items) {
        let width, height

        for (const image of emote.emote.images) {
          if (image.scale == 2) {
            width = image.width
            height = image.height
            break
          }
        }

        emotes[emote.alias] = {
          id: emote.id,
          type: '7TV',
          zeroWidth: emote.flags.zeroWidth,
          unlisted: !emote.emote.flags.publicListed,
          private: emote.emote.flags.private,
          width: width,
          height: height,
        }
      }

      return [emotes, currentSetID]
    } catch {
      return {}
    }
  }
}
