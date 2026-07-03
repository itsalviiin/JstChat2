export default {
  async get7TVGlobalEmotes() {
    try {
      const globalEmotesData = await fetch(`https://7tv.io/v4/gql`, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          operationName: 'GetGlobalEmotes',
          query: `
              query GetGlobalEmotes() {
                emoteSets {
                  global {
                    id
                    name
                    capacity
                    kind
                    tags
                    owner {
                      id
                      connections {
                        platform
                        platformId
                        platformUsername
                        platformDisplayName
                      }
                      mainConnection {
                        platformDisplayName
                        platformAvatarUrl
                      }
                    }
                    emotes {
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
                      totalCount
                    }
                  }
                }
              }
            `,
        }),
      }, { signal: AbortSignal.timeout(10000) });

      const globalEmotes = await globalEmotesData.json()

      var emotes = {}

      if (globalEmotes.data.emoteSets.global.emotes) {
        for (const emote of globalEmotes.data.emoteSets.global.emotes.items) {
          var width, height

          for (const image of emote.emote.images) {
            if (image.scale === 2) {
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

        return emotes
      }
    } catch {
      console.log(`[7TV API] Failed to fetch 7TV Global Emotes`)
    }
    return {}
  },

  async get7TVUser(userID) {
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
      return userData
    } catch {
      console.log(`[7TV API] Failed to fetch 7TV User Data`)
    }
    return {}
  },

  async getEmotes(userID) {
    var emotes = {}
    try {
      var userData = await this.get7TVUser(userID),
        currentSetID = userData.data.users.userByConnection.style.activeEmoteSetId,
        currentSetEmotes

      for (const set of userData.data.users.userByConnection.emoteSets) {
        if (set.id === currentSetID) {
          currentSetEmotes = set
        }
      }

      if (!currentSetEmotes) {
        var emoteDataSet = await this.getEmoteSetData(currentSetID)

        if (emoteDataSet) {
          return {
            userID: userData.data.users.userByConnection.id,
            emotes: emoteDataSet[0],
            setID: currentSetID,
          }
        } else {
          return {}
        }
      } else {
        for (const emote of currentSetEmotes.emotes.items) {
          var width, height

          for (const image of emote.emote.images) {
            if (image.scale === 2) {
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

        return {
          userID: userData.data.users.userByConnection.id,
          emotes: emotes,
          setID: currentSetID,
        }
      }
    } catch {
      console.log(`[7TV API] Failed to fetch 7TV Channel Emotes`)
      return {}
    }
  },

  async getEmoteSetData(setID) {
    try {
      const getEmoteSet = await fetch(`https://7tv.io/v4/gql`, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          operationName: 'GetEmoteSet',
          variables: {
            id: setID,
          },
          query: `
              query GetEmoteSet($id: Id!) {
                emoteSets {
                  emoteSet(id: $id) {
                    id
                    name
                    capacity
                    kind
                    tags
                    owner {
                      id
                      connections {
                        platform
                        platformId
                        platformUsername
                        platformDisplayName
                      }
                      mainConnection {
                        platformDisplayName
                        platformAvatarUrl
                      }
                    }
                    emotes {
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
                      totalCount
                    }
                  }
                }
              }
            `,
        }),
      }, { signal: AbortSignal.timeout(10000) });

      const emoteSetData = await getEmoteSet.json()

      var emotes = {}, owner

      if (emoteSetData.data.emoteSets.emoteSet.emotes) {
        for (const emote of emoteSetData.data.emoteSets.emoteSet.emotes.items) {
          var width, height

          for (const image of emote.emote.images) {
            if (image.scale === 2) {
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

        for (const connection of emoteSetData.data.emoteSets.emoteSet.owner.connections) {
          if (connection.platform === "TWITCH") {
            owner = connection.platformId
          }
        }

        return [emotes, owner]
      }
      return undefined
    } catch {
      console.log(`[7TV API] Failed to fetch 7TV Emote Set`)
    }
    return undefined
  }
}
