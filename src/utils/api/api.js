import SevenTVAPI from './twitch/7tv'
import bttv from './twitch/bttv'
import ffz from './twitch/ffz'
import chatterino from './twitch/chatterino'
import TwitchAPI from './twitch/twitch'

const SevenTVGlobalEmoteSetID = 'global'

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

  async fetchEmotes() {
    /** Global Emotes */
    this.emotes = Object.assign(this.emotes, await this.BTTV.getBttvGlobalEmotes())
    this.emotes = Object.assign(this.emotes, await this.FFZ.getFfzGlobalEmotes(this.twitch.userID))
    this.emotes = Object.assign(this.emotes, await this.SevenTV.get7tvEmoteSetObj(SevenTVGlobalEmoteSetID))

    /** Channel Emotes */
    this.emotes = Object.assign(this.emotes, await this.BTTV.getBttvEmotes(this.twitch.userID))

    let ffzData = await this.FFZ.getFfzEmotes(this.twitch.channel)
    if (ffzData[1] != undefined) {
      this.twitch.badges["moderator"] = { '1': ffzData[1] }
    }
    if (ffzData[2] != undefined) {
      this.twitch.badges["vip"] = { '1': ffzData[2] }
    }
    this.emotes = Object.assign(this.emotes, ffzData[0])

    let stvData = await this.SevenTV.get7TVUser(this.twitch.userID)
    this.emotes = Object.assign(this.emotes, stvData[0])
    this.seventv_id = stvData[1]

    /** Badges */
    this.ffzbadges = await this.FFZ.getFfzBadges(this.twitch.channel)
    this.ffzChannelbadges = await this.FFZ.getFfzChannelBadges(this.twitch.channel)
    this.bttvbadges = await this.BTTV.getBttvBadges(this.twitch.userID)
    this.chatterinobadges = await this.Chatterino.getChatterinoBadges()
  }
}
