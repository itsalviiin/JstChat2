import SevenTVAPI from './twitch/7tv'
import bttv from './twitch/bttv'
import ffz from './twitch/ffz'
import chatterino from './twitch/chatterino'
import TwitchAPI from './twitch/twitch'

// https://7tv.io/v3/emote-sets/global
const SevenTVGlobalEmoteSetID = '01HKQT8EWR000ESSWF3625XCS4'

export default class API {
  constructor(channel) {
    this.twitch = new TwitchAPI(channel)
    this.SevenTV = SevenTVAPI
    this.BTTV = bttv
    this.FFZ = ffz
    this.Chatterino = chatterino

    this.emotes = {}

    this.seventv_id = null
    this.paints = []
    this.stvbadges = []
    this.personalEmotes = {}

    this.ffzbadges = []
    this.ffzChannelbadges = []
    this.bttvbadges = []
    this.chatterinobadges = []

  }

  async fetchEmotes(hideUnlistedEmotes, hidePrivateEmotes) {
    let em;

    /** Global Emotes */
    this.emotes = Object.assign(this.emotes, await this.BTTV.getBttvGlobalEmotes())
    this.emotes = Object.assign(this.emotes, await this.FFZ.getFfzGlobalEmotes(this.twitch.userID))
    this.emotes = Object.assign(this.emotes, await this.SevenTV.get7tvEmoteSetObj(SevenTVGlobalEmoteSetID, hideUnlistedEmotes, hidePrivateEmotes))

    this.emotes = Object.assign(this.emotes, await this.BTTV.getBttvEmotes(this.twitch.userID))

    em = await this.FFZ.getFfzEmotes(this.twitch.channel)
    if (em[1] != undefined) {
      this.twitch.badges["moderator"] = { '1': em[1] }
    }
    if (em[2] != undefined) {
      this.twitch.badges["vip"] = { '1': em[2] }
    }
    this.emotes = Object.assign(this.emotes, em[0])

    try {
      let s = await this.SevenTV.get7tvEmotes(this.twitch.userID, hideUnlistedEmotes, hidePrivateEmotes)
      this.emotes = Object.assign(this.emotes, s[0])
      this.seventv_id = s[1]
    } catch (err) {
      console.log(err)
    }

    /** Badges */
    this.ffzbadges = await this.FFZ.getFfzBadges(this.twitch.channel)
    this.ffzChannelbadges = await this.FFZ.getFfzChannelBadges(this.twitch.channel)
    this.bttvbadges = await this.BTTV.getBttvBadges(this.twitch.userID)
    this.chatterinobadges = await this.Chatterino.getChatterinoBadges()

    // console.log("Fetched Third Party Data.")
  }
}
