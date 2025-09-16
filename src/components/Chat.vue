<script>
import Message from './chat/Message.vue'
import TwitchClient from '@/utils/chat_clients/twitch/client'
import API from '@/utils/api/api'
// import Common from '@/utils/common'
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
      pauseOverlay: false,
      messages: [],
      temp: [],
      useBG: 0,
      systemIdx: 0,
      systemMsgID: 0,
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
        maxMes: this.$route.query.max_messages || 50,
        channel: this.$route.query.channel,
        fontName: this.$route.query.font || 'Roboto',
        fontWeight: parseInt(this.$route.query.font_weight || '800'),

        fontSizeI: parseInt(this.$route.query.font_size || '36'),
        emoteSizeI: parseInt(this.$route.query.emote_size || '0'),
        shadow: this.$route.query.shadow || 'true',

        // backgrounds: this.$route.query.background || ['transparent'],
        background: this.$route.query.background || 'transparent',
        calcSecondBackgrounds: parseInt(this.$route.query.sb || '5'),
        border: this.$route.query.border || 'false',

        /** Overlay Visual */
        fade: parseInt(this.$route.query.fade_after || '0'),
        animate: this.$route.query.animate || 'false',
        displayInterval: parseInt(this.$route.query.display_interval || '200'),
        readableColors: this.$route.query.readable_colors || 'true',

        /** Customizable Messages */
        overlaySysMsg: this.$route.query.overlay_sys_msg || 'false',
        twitchSysMsg: this.$route.query.twitch_sys_msg || 'false',
        stvSysMsg: this.$route.query.stv_sys_msg || 'false',
        systemMsgColor: this.$route.query.system_color || '#999999',
        // highlightSystemMessages: this.$route.query.highlight_system || 'false',
        highlightFirstMessages: this.$route.query.highlight_first_time || 'false',
        highlightPointMessages: this.$route.query.highlight_redeemed || 'false',

        /** Emotes & Cosmetics */
        hideSubMessages: this.$route.query.hide_sub_messages || 'false',
        hideBitMessages: this.$route.query.hide_bit_messages || 'false',
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

        /** Filters */
        hideBots: this.$route.query.hide_bots || 'true',
        hideCommands: this.$route.query.hide_commands || 'false',
        hideUsers: this.$route.query.hide?.toLowerCase().split(',') || [],
        filter: decodeURIComponent(this.$route.query.filter) || '',
      },
    }
  },
  methods: {
    async onEmoteAdd(e) {
      this.api.emotes[e.value.name] = {
        ID: e.value.id,
        Type: '7TV',
        ZeroWidth: e.value.flags == 1,
        width: e.value.data.host.files[1].width,
        height: e.value.data.host.files[1].height,
      }
      if (this.pageConfig.stvSysMsg == 'true') {
        this.createSystemMessage(`[7TV] Added ${e.value.name}`)
      }
    },
    async onEmoteDelete(e) {
      delete this.api.emotes[e.old_value.name]
      if (this.pageConfig.stvSysMsg == 'true') {
        this.createSystemMessage(`[7TV] Removed ${e.value.name}`)
      }
    },
    async onEmoteRename(e) {
      this.api.emotes[e.value.name] = this.api.emotes[e.old_value.name]
      delete this.api.emotes[e.old_value.name]
      if (this.pageConfig.stvSysMsg == 'true') {
        this.createSystemMessage(`[7TV] Renamed ${e.old_value.name} to ${e.value.name}`)
      }
    },
    async onBadgeCreate(e) {
      for (const i in this.api.stvbadges) {
        if (this.api.stvbadges[i].id == e.data.id) {
          this.api.stvbadges[i].users.push(e.user.id)
          return
        }
      }
      let pos = this.api.stvbadges.push({ url: `https:${e.data.host.url}/2x`, id: e.data.id }) - 1
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
    async OnFadeAfter(id) {
      if (this.pageConfig.fade != 0) {
        setTimeout(
          () => {
            const message = this.messages.find(
              (item) => item.tags.id == id,
            )
            if (message) {
              /** Add fadeOut flag to the message */
              message.fadeOut = true
            }
          },
          parseInt(this.pageConfig.fade) * 1000
        )
      }
    },
    createTwitchMessage(message) {
      if (this.pageConfig.hideBots == 'true') {
        if (this.botsList.includes(message.tags.user_id)) {
          return
        }
      }

      /** Remove when messages start with a command */
      if (this.pageConfig.hideCommands.toLowerCase() == 'true') {
        if (
          message.parameters.startsWith('!')
        ) {
          return
        }
      }

      /** Remove users in the ignore list */
      if (this.pageConfig.hideUsers.length != 0) {
        if (this.pageConfig.hideUsers.includes(message.source.nick)) {
          return
        }
      }

      /** Remove messages that match the regex */
      if (this.filterRegex) {
        if (message.parameters.match(this.filterRegex)) {
          return
        }
      }

      if (this.pageConfig.hideSubMessages == 'true') {
        if (message.command.command == 'USERNOTICE') {
          return
        }
      }

      if (this.pageConfig.hideBitMessages == 'true') {
        if (message.tags.bits) {
          return
        }
      }

      /** If overlay is paused, don't add messages */
      if (this.pauseOverlay) {
        return
      }

      if (this.messages.length >= this.pageConfig.maxMes) {
        this.messages.shift()
      }
      message.type = 'twitch'

      message.background = `#${this.pageConfig.background}`

      if (this.pageConfig.displayInterval != 0) {
        this.temp.push(message)
      } else {
        this.messages.push(message)
      }
      this.OnFadeAfter(message.tags.id)
    },
    async createSystemMessage(message) {
      if (this.messages.length >= this.pageConfig.maxMes) {
        this.messages.shift()
      }
      let sysMsg = {
        parameters: message,
        tags: { display_name: '', id: `${this.systemMsgID}`, color: this.pageConfig.systemMsgColor },
        source: { nick: '' },
        action: true
      }
      sysMsg.type = 'system'

      sysMsg.background = `#${this.pageConfig.background}`

      if (this.pageConfig.displayInterval != 0) {
        this.temp.push(sysMsg)
      } else {
        this.messages.push(sysMsg)
      }
      this.OnFadeAfter(sysMsg.tags.id)
      this.systemMsgID++
    },
    createTwitchUsernoticeMessage(message) {
      if (this.pageConfig.twitchSysMsg == 'true') {
        if (this.messages.length >= this.pageConfig.maxMes) {
          this.messages.shift()
        }
        let sysMsg = {
          parameters: message,
          tags: { display_name: '', id: `${this.systemMsgID}`, color: this.pageConfig.systemMsgColor },
          source: { nick: '' },
          action: true
        }
        sysMsg.type = 'system'

        sysMsg.background = `#${this.pageConfig.background}`

        if (this.pageConfig.displayInterval != 0) {
          this.temp.push(sysMsg)
        } else {
          this.messages.push(sysMsg)
        }
        this.OnFadeAfter(sysMsg.tags.id)
        this.systemMsgID++
      }
    },
  },
  created: async function () {
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
    this.client.OnSystemMessage = this.createTwitchUsernoticeMessage
    this.client.OnFadeAfter = this.OnFadeAfter
    this.client.OnUserID = (id) => {
      if (this.userID == null) {
        this.userID = id
      }
    }
    this.client.OnClearChat = async (payload) => {
      if (payload.parameters == null) {
        this.messages = []
      } else {
        if (this.pageConfig.displayInterval != 0) {
          this.temp = this.temp.filter((item) => item.source.nick !== payload.parameters)
        }
        this.messages = this.messages.filter((item) => item.source.nick !== payload.parameters)
      }
    }
    this.client.OnClearMessage = async (payload) => {
      this.messages = this.messages.filter((item) => item.parameters !== payload.parameters)
    }
    this.client.OnCommandExecution = async (payload) => {
      switch (payload?.command?.botCommand.toLowerCase()) {
        case "refreshoverlay":
        case "reloadoverlay":
          window.location.reload()
          break
        case "refreshemotes":
        case "reloademotes":
          this.api.fetchEmotes(this.pageConfig.hideUnlistedEmotes, this.pageConfig.hidePrivateEmotes)
          if (this.pageConfig.stvSysMsg == 'true') {
            this.createSystemMessage('Emotes have been reloaded.')
          }
          break
        case "hideoverlay":
          if (this.showOverlay) {
            this.showOverlay = false
          }
          break
        case "showoverlay":
          if (!this.showOverlay) {
            this.showOverlay = true
          }
          break
        case "pauseoverlay":
          if (!this.pauseOverlay) {
            this.pauseOverlay = true
            this.createSystemMessage('Paused Overlay.')
          }
          break
        case "unpauseoverlay":
        case "resumeoverlay":
          if (this.pauseOverlay) {
            this.pauseOverlay = false
            this.createSystemMessage('Unpaused Overlay.')
          }
          break
      }
    }
    this.client.connect()
    if (this.pageConfig.overlaySysMsg == 'true') {
      this.createSystemMessage(`Connected to #${this.pageConfig.channel}!`)
    }
  },
  computed: {
    fontSize() {
      return `${this.pageConfig.fontSizeI}px`
    },
    isTransparent() {
      return this.pageConfig.background == 'transparent'
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
        return `drop-shadow(3px 3px 0.1rem black)`
      }
      return `none`
    }
  },
  mounted() {
    if (this.pageConfig.displayInterval != 0) {
      this.displayInterval = setInterval(() => {
        if (this.temp.length > 0) {
          this.messages.push(...this.temp);
        }
        this.messages.splice(0, this.messages.length - this.pageConfig.maxMes)
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
    transform: translate3d(0, 0.5em, 0);
    /* opacity: 0.75; */
  }

  to {
    transform: translate3d(0, 0, 0);
    /* opacity: 1; */
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
}

#chat>div.fadeOut {
  animation: fadeOut 0.5s forwards;
}

.chat-enter-from {
  opacity: 0;
}

.chat-enter-to {
  opacity: 1;
}

.chat-enter-active {
  transition: opacity 0s linear 150ms;
  /* Adjust duration as needed */
  /* transition-delay: 0.2s; */
  /* Delay the new message's entrance */
}

.chat-move {
  transition: transform 150ms linear;
  /* Smoothly move existing messages up */
}

/* .chat-enter-active {
  transition: opacity 0s linear 0.2s;
}

.chat-enter-from {
  opacity: 0;
}

.chat-enter-to {
  opacity: 1;
}

.chat-move {
  transition: transform 0.15s linear;
}

#chat>* {
  will-change: transform;
} */

/* .chat-enter-active {
  transition: transform 0.15s ease;
}

.chat-enter-from {
  transform: translateY(75%);
  opacity: 0;
}

.chat-enter-to {
  transform: translateY(0);
  opacity: 1;
}

.chat-move {
  transition: transform 0.15s ease;
} */

/* 1. declare transition */
/* .fade-move,
.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
} */

/* 2. declare enter from and leave to state */
/* .fade-enter-from,
.fade-leave-to {
  animation: v-bind('animation');
} */
/* opacity: 0.5; */
/* transform: scaleY(0.01) translate(30px, 0); */
/* transform: scaleY(0.01) translate(30px, 0); */

/* 3. ensure leaving items are taken out of layout flow so that moving
      animations can be calculated correctly. */
/* .fade-leave-active {
  position: absolute;
} */
</style>
