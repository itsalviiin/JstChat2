<script>
import Message from './chat/Message.vue'
import TwitchClient from '@/utils/chat_clients/twitch/client'
import API from '@/utils/api/api'
import Common from '@/utils/common'
import EventAPI from '@/utils/eventapi/seventv'

export default {
  name: 'ChatView',
  components: { Message },
  data: function () {
    return {
      EventAPI: null,
      client: null,
      api: null,
      showOverlay: true,
      messages: [],
      temp: [],
      useBG: 0,
      filterRegex: null,

      botsList: [
        "100135110",  // StreamElements
        "237719657",  // Fossabot
        "19264788",   // Nightbot
        "68136884",   // Supibot
        "865895441",  // PotatBotat
        "1564983",    // Moobot
        "268612479",  // TitleChange_Bot
        "82008718",   // pajbot
        "64313471",   // HuwoBot
        "425363834",  // ThePositiveBot
        "105166207",  // Streamlabs
        "519435394",  // PokemonCommunityGame
        "196500227",  // FeelsOkayBot
        "790479925",  // kunszgbot
        "500670723",  // VJBotardo
        "122770725",  // Scriptorex
        "621622210",  // BeptoBot
        "1008673103", // oshbt
        "754201843",  // Spanixbot
        "898503704",  // streamqbot
        "870280719",  // TwirApp
        "198445737",  // RoboWeest
        "87695884",   // cvk3
      ],

      pageConfig: {
        maxMes: 50,
        channel: this.$route.query.channel,
        fontName: this.$route.query.font || 'Roboto',
        fontWeight: parseInt(this.$route.query.font_weight || '800'),

        fontSizeI: parseInt(this.$route.query.font_size || '36'),
        emoteSizeI: parseInt(this.$route.query.emote_size || '0'),
        shadow: this.$route.query.shadow || 'true',

        backgrounds: [this.$route.query.background || 'transparent'],
        calcSecondBackgrounds: parseInt(this.$route.query.sb || '5'),
        border: this.$route.query.border || '0',
        fade: parseInt(this.$route.query.fade_after || '0'),

        animate: this.$route.query.animate || 'false',
        displayInterval: parseInt(this.$route.query.display_interval || '200'),
        readableColors: this.$route.query.readable_colors || 'true',
        highlightedFirstMessages: this.$route.query.highlight_first_time || 'false',
        highlightedPointMessages: this.$route.query.highlight_redeemed || 'false',

        hidePersonalEmotes: this.$route.query.hide_personal || 'false',
        hideUnlistedEmotes: this.$route.query.hide_unlisted || 'false',
        hidePrivateEmotes: this.$route.query.hide_private || 'false',
        hide7TVPaints: this.$route.query.hide_paints || 'false',
        hideBTTVBadges: this.$route.query.hide_bttv_badge || 'false',
        hideFFZBadges: this.$route.query.hide_ffz_badge || 'false',
        hide7TVBadges: this.$route.query.hide_7tv_badge || 'false',
        hideChatterinoBadges: this.$route.query.hide_chatterino_badge || 'false',
        sharedChatBadge: this.$route.query.shared_chat_badge || 'off',
        selfSharedBadge: this.$route.query.self_shared_badge || 'true',

        hideBots: this.$route.query.hide_bots || 'true',
        hideCommands: this.$route.query.hide_commands || 'false',
        hideUsers: this.$route.query.hide?.toLowerCase().split(',') || [],
        filter: decodeURIComponent(this.$route.query.filter) || '',

      },
    }
  },
  methods: {
    async onEmoteAdd(e) {
      this.api.emotes[e.value.name] = { ID: e.value.id, Type: '7TV' }
    },
    async onEmoteDelete(e) {
      delete this.api.emotes[e.old_value.name]
    },
    async onEmoteRename(e) {
      this.api.emotes[e.value.name] = this.api.emotes[e.old_value.name]
      delete this.api.emotes[e.old_value.name]
    },
    async onBadgeCreate(e) {
      for (const i in this.api.stvbadges) {
        if (this.api.stvbadges[i].id == e.data.id) {
          this.api.stvbadges[i].users.push(e.user.id)
          return
        }
      }
      let pos = this.api.stvbadges.push({ Url: `https:${e.data.host.url}/2x`, id: e.data.id }) - 1
      this.api.stvbadges[pos].users = [e.user.id]
    },
    async onBadgeDelete(e) {
      for (const i in this.api.stvbadges) {
        if (this.api.stvbadges[i].id == e.data.id) {
          this.api.stvbadges[i].users = this.api.stvbadges[i].users.filter(function (item) {
            return item !== e.user.id
          })
          break
        }
      }
    },
    async onPaintCreate(e) {
      for (const i in this.api.paints) {
        if (this.api.paints[i].id == e.data.id) {
          this.api.paints[i].users.push(e.user.id)
          return
        }
      }
      let pos = this.api.paints.push(e.data) - 1
      this.api.paints[pos].users = [e.user.id]
    },
    async onPaintDelete(e) {
      for (const i in this.api.paints) {
        if (this.api.paints[i].id == e.data.id) {
          this.api.paints[i].users = this.api.paints[i].users.filter(function (item) {
            return item != e.user.id
          })
          break
        }
      }
    },
    async onPersonalEmotes(e, user) {
      if (e != undefined && user != undefined) {
        this.api.personalEmotes[user] = e
      }
    },
    createTwitchMessage(message) {
      if (this.messages.length >= this.pageConfig.maxMes) {
        this.messages.shift()
      }
      message.type = 'twitch'

      message.background = this.useBG
      if (this.useBG + 1 > this.pageConfig.backgrounds.length - 1) {
        this.useBG = 0
      } else {
        this.useBG += 1
      }

      if(this.pageConfig.hideBots == 'true') {
        if(this.botsList.includes(message.tags.user_id)) {
          return
        }
      }

      /** Remove when messages start with a command */
      if (this.pageConfig.hideCommands.toLowerCase() === 'true') {
        if (
          message.parameters.startsWith('!')
        ) {
          return
        }
      }

      /** Remove users in the ignore list */
      if (this.pageConfig.hideUsers.length !== 0) {
        if (this.pageConfig.hideUsers.includes(message.source.nick)) {
          return
        }
      }

      if (this.filterRegex) {
        if(message.parameters.match(this.filterRegex)) {
          return
        }
      }

      if(this.pageConfig.displayInterval != 0) {
        this.temp.push(message)
      } else {
        this.messages.push(message)
      }
    },
    async createSystemMessage(message) {
      if (this.messages.length >= this.pageConfig.maxMes) {
        this.messages.shift()
      }
      let mes = {
        parameters: message,
        tags: { display_name: '', id: '0', color: "#999999" },
        source: { nick: 'system' },
        action: true
      }
      mes.type = 'system'

      mes.background = this.useBG
      if (this.useBG + 1 > this.pageConfig.backgrounds.length - 1) {
        this.useBG = 0
      } else {
        this.useBG += 1
      }

      this.messages.push(mes)
    },
  },
  created: async function () {
    if (
      this.pageConfig.calcSecondBackgrounds > 0 &&
      this.pageConfig.backgrounds[0] != 'transparent'
    ) {
      for (let index = 0; index < this.pageConfig.calcSecondBackgrounds; index++) {
        let minus = 1
        let ind = index

        if (this.pageConfig.calcSecondBackgrounds / 2 <= index) {
          ind = this.pageConfig.calcSecondBackgrounds - index - 1
        }

        let gray = Common.toGray(this.pageConfig.backgrounds[ind])
        if (gray > 0.38) {
          minus = -30 / gray
        }

        this.pageConfig.backgrounds.push(
          Common.pSBC(0.01 * minus, this.pageConfig.backgrounds[ind]),
        )
      }
    }

    if (this.pageConfig.filter != '') {
      this.filterRegex = new RegExp(this.pageConfig.filter, "i")
    }

    this.api = new API(this.pageConfig.channel)
    await this.api.twitch.fetchData(this.api.fetchEmotes)

    await this.api.fetchEmotes(this.pageConfig.hideUnlistedEmotes, this.pageConfig.hidePrivateEmotes)

    /** Connecting to 7TV EventAPI */
    this.EventAPI = new EventAPI(this.api.seventv_id, this.api.twitch.userID)

    this.EventAPI.onDelete = this.onEmoteDelete
    this.EventAPI.onRename = this.onEmoteRename
    this.EventAPI.onAdd = this.onEmoteAdd

    this.EventAPI.onBadgeCreate = this.onBadgeCreate
    this.EventAPI.onBadgeDelete = this.onBadgeDelete
    this.EventAPI.onPaintCreate = this.onPaintCreate
    this.EventAPI.onPaintDelete = this.onPaintDelete

    this.EventAPI.onPersonalEmotes = this.onPersonalEmotes

    this.EventAPI.Connect()

    this.client = new TwitchClient(this.pageConfig.channel)
    this.client.OnPrivateMessage = this.createTwitchMessage
    this.client.newSystemMessage = this.createSystemMessage
    this.client.OnUserId = (id) => {
      if (this.userID == null) {
        this.userID = id
      }
    }
    this.client.OnClearChat = async (payload) => {
      if (payload.parameters == null) {
        /** if paramaters, its a timeout. if not, its a clear chat */
        this.messages = []
      } else {
        this.messages = this.messages.filter((item) => item.source.nick !== payload.parameters)
      }
    }
    this.client.OnClearMessage = async (payload) => {
      this.messages = this.messages.filter((item) => item.parameters !== payload.parameters)
    }
    this.client.OnFadeAfter = async (payload) => {
      if (this.pageConfig.fade != '0') {
        setTimeout(
          () => {
            const message = this.messages.find(
              (item) => item.tags['id'] === payload.tags.id || item.tags['id'] === '0',
            )
            if (message) {
              /** Add fadeOut flag to the message */
              message.fadeOut = true
            }
            /** Optionally remove the message after fade-out animation */
            setTimeout(() => {
              this.messages = this.messages.filter(
                (item) => item.tags['id'] !== payload.tags.id && item.tags['id'] !== '0',
              )
            }, 1000) /** Wait for the fade-out animation to finish */
          },
          parseInt(this.pageConfig.fade) * 1000
        )
      }
    }
    this.client.OnCommandExecution = async (payload) => {
      switch (payload?.command?.botCommand.toLowerCase()) {
        case "refreshoverlay":
          window.location.reload()
          break
        case "refreshemotes":
          this.api.fetchEmotes(this.pageConfig.hideUnlistedEmotes, this.pageConfig.hidePrivateEmotes)
          // this.createSystemMessage('Emotes have been reloaded.')
          break
        case "hideoverlay":
          if(this.showOverlay) {
            this.showOverlay = false
          }
          break
        case "showoverlay":
          if(!this.showOverlay) {
            this.showOverlay = true
          }
          break
      }
    }
    this.client.connect()
  },
  computed: {
    fontSize() {
      return `${this.pageConfig.fontSizeI}px`
    },
    isTransparent() {
      return this.pageConfig.backgrounds[0] == 'transparent'
    },
    fontName() {
      return this.pageConfig.fontName
    },
    fontWeight() {
      return this.pageConfig.fontWeight
    },
    animation() {
      if (this.pageConfig.animate == 'true') {
        return `fadeInUp 0.3s ease forwards`
      }
      return `0s`
    },
    shadow() {
      if (this.pageConfig.shadow == 'true') {
        return `drop-shadow(3px 3px 1.5px black)`
      }
      return `none`
    }
  },
  mounted() {
    if(this.pageConfig.displayInterval != 0) {
      this.displayInterval = setInterval(() => {
        if (this.temp.length > 0) {
          this.messages.push(...this.temp);
        }
        let linesToDelete = this.messages.length - 50
        while(linesToDelete > 0) {
          this.messages.shift()
          linesToDelete--
        }
        this.temp = []
      }, this.pageConfig.displayInterval);
    }
  },
  beforeUnmount() {
    clearInterval(this.displayInterval);
  }
}
</script>

<template>
  <div id="chat" :transparent="isTransparent" v-show="showOverlay">
    <Message v-for="(item, i) in messages" :key="item.tags.id" :payload="item" :api="api" :pageConfig="pageConfig"
      :pos="i" :class="{ fadeOut: item.fadeOut }" />
  </div>
</template>

<style>
#chat {
  font-family: v-bind('fontName');
  font-weight: v-bind('fontWeight');
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  font-size: v-bind('fontSize');
  overflow: hidden;
  overflow-wrap: break-word;
}

@keyframes fadeInUp {
  from {
    transform: translate3d(0, 0.2em, 0);
  }

  to {
    transform: translate3d(0, 0, 0);
  }
}

@keyframes fadeOut {
  from {
    opacity: 1;
  }

  to {
    opacity: 0;
  }
}

#chat>div {
  animation: v-bind('animation');
  filter: v-bind('shadow');
  /* text-shadow: 2px 2px 6px black; */
}

#chat>div.fadeOut {
  animation: fadeOut 0.5s forwards;
}
</style>
