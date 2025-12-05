import SevenTVAPI from './twitch/7tv'
import bttv from './twitch/bttv'
import ffz from './twitch/ffz'
import chatterino from './twitch/chatterino'
import TwitchAPI from './twitch/twitch'

export default class API {
  constructor(channel) {
    this.twitch = new TwitchAPI(channel)
    this.sevenTV = SevenTVAPI
    this.bttv = bttv
    this.ffz = ffz
    this.chatterino = chatterino

    this.emotes = {}

    this.stvUserID = null
    this.stvSetID = null
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
    this.emotes = Object.assign(this.emotes, await this.bttv.getBTTVGlobalEmotes())
    this.emotes = Object.assign(this.emotes, await this.ffz.getFFZGlobalEmotes(this.twitch.userID))
    this.emotes = Object.assign(this.emotes, await this.sevenTV.get7TVGlobalEmotes())

    /** Channel Emotes */
    this.emotes = Object.assign(this.emotes, await this.bttv.getBTTVEmotes(this.twitch.userID))

    let ffzData = await this.ffz.getFFZEmotes(this.twitch.channel)
    if (ffzData.modBadge) {
      this.twitch.badges["moderator"] = { '1': ffzData.modBadge }
    }
    if (ffzData.vipBadge) {
      this.twitch.badges["vip"] = { '1': ffzData.vipBadge }
    }
    this.emotes = Object.assign(this.emotes, ffzData.emotes)

    let stvData = await this.sevenTV.get7TVUser(this.twitch.userID)
    this.emotes = Object.assign(this.emotes, stvData.emotes)
    this.stvSetID = stvData.setID
    this.stvUserID = stvData.userID
  }

  async fetchCosmetics() {
    /** Badges */
    this.ffzbadges = await this.ffz.getFfzBadges(this.twitch.channel)
    this.ffzChannelbadges = await this.ffz.getFfzChannelBadges(this.twitch.channel)
    this.bttvbadges = await this.bttv.getBttvBadges(this.twitch.userID)
    this.chatterinobadges = await this.chatterino.getChatterinoBadges()
  }
}
