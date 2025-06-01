<script>
import Nickname from './MessageComponents/Nickname.vue'
import Badge from './MessageComponents/Badge.vue'
import Common from '@/utils/common'
import Chat from '@/utils/api/twitch/chat'

export default {
  name: 'MessageView',
  components: { Nickname, Badge },
  props: {
    payload: Object,
    api: Object,
    pageConfig: Object,
  },
  computed: {
    Badges() {
      let badges = []

      /** Shared Chat Badge */
      if(this.payload.tags["source_room-id"] && this.payload.tags.room_id != this.payload.tags["source_room-id"] && this.pageConfig.sharedChatBadge != 'off') {
        if(this.pageConfig.sharedChatBadge == 'simple') {
          badges.push(this.ChatBadge[this.payload.tags["source_room-id"]])
        } else if(this.pageConfig.sharedChatBadge == 'profile') {
          badges.push(Chat.getProfilePic(this.payload.tags["source_room-id"]))
        }
      }

      if (this.payload.tags.badges != null) {
        for (const [i, k] of Object.entries(this.payload.tags.badges)) {
          badges.push(this.api.twitch.badges[i][k])
        }
      }

      if (this.api.chatterinobadges && this.pageConfig.hideChatterinoBadges == 'false') {
        for (const value of this.api.chatterinobadges) {
          if(value.users.includes(this.payload.tags.user_id)) {
            badges.push(value.url)
          }
        }
      }

      if (this.api.bttvbadges && this.pageConfig.hideBTTVBadges == 'false') {
        for (const value of this.api.bttvbadges) {
          if (value.users.includes(this.payload.tags.user_id)) {
            badges.push(value.url)
          }
        }
      }


      if (this.api.ffzbadges && this.pageConfig.hideFFZBadges == 'false') {
        for (const value of this.api.ffzbadges) {
          if (value.users.includes(Number(this.payload.tags.user_id))) {
            badges.push(value.url)
          }
        }
      }

      if (this.api.ffzChannelbadges && this.pageConfig.hideFFZBadges == 'false') {
        for (const value of this.api.ffzChannelbadges) {
          if (value.users.includes(this.payload.source.nick)) {
            badges.push(value.url)
          }
        }
      }

      if (this.api.stvbadges &&  this.pageConfig.hide7TVBadges == 'false') {
        for (const value of this.api.stvbadges) {
          if (value.users.includes(this.payload.tags.user_id)) {
            badges.push(value.Url)
          }
        }
      }

      return badges
    },
    MessageSize() {
      return `${Math.round(1.33 * this.pageConfig.fontSizeI + 7)}px`
    },
    Background() {
      if(this.pageConfig.backgrounds == 'transparent') {
        if(this.pageConfig.highlightedFirstMessages == 'true') {
          if (this.payload.tags.first_msg && this.payload.tags.first_msg == "1") {
            return `rgba(92, 125, 86, 0.4)`
          }
        }
        if(this.pageConfig.highlightedPointMessages == 'true') {
          if (this.payload.tags.msg_id && this.payload.tags.msg_id == "highlighted-message") {
            return `rgba(64, 121, 128, 0.4)`
          }
        }
      }
      if(this.pageConfig.highlightedFirstMessages == 'true') {
          if (this.payload.tags.first_msg && this.payload.tags.first_msg == "1") {
            return `rgba(92, 125, 86, 1)`
          }
        }
        if(this.pageConfig.highlightedPointMessages == 'true') {
          if (this.payload.tags.msg_id && this.payload.tags.msg_id == "highlighted-message") {
            return `rgba(64, 121, 128, 1)`
          }
        }
      return this.pageConfig.backgrounds[this.payload.background]
    },
    BackgroundOpacity() {
      if (this.payload.tags.first_msg && this.payload.tags.first_msg == "1") {
        return `0.4`
      } else if (this.payload.tags.msg_id && this.payload.tags.msg_id == "highlighted-message") {
        return `0.4`
      }
      return `1`
    },
    TwitchEmotes() {
      if (this.payload.tags.emotes != undefined) {
        return Common.parse_emotes(this.payload.parameters, this.payload.tags['emotes'])
      }
      return {}
    },
    Bits() {
      if (this.payload.tags.bits) {
        return Common.parse_bits(this.payload.parameters, this.payload.tags.bits ,this.api.twitch.emotePrefix)
      }
      return {}
    },
    EmoteSize() {
      return `${this.pageConfig.fontSizeI + 13}px`
    },
    EmojiSize() {
      return `calc(1.5em + ${this.pageConfig.emoteSizeI}px)`
    },
    Border() {
      return `${this.pageConfig.border}px solid black`
    },
    SlashMe() {
      if (this.payload.action == true) {
        if (this.payload.tags.color) {
          return this.pageConfig.readableColors == 'true' ? `${Common.brightenColor(this.payload.tags.color)}` : this.payload.tags.color
        } else {
          return this.pageConfig.readableColors == 'true' ? `${Common.brightenColor(Chat.getColorlessUsers(this.payload.tags.user_id))}` : Chat.getColorlessUsers(this.payload.tags.user_id)
        }
      }
      return `white`
    },
    ActionUsername() {
      if (this.payload.action == true) {
        return ` `
      }
      return `: `
    },
    UserColor() {
      if (this.payload.tags.color) {
        return this.payload.tags.color
      }
      return Chat.getColorlessUsers(this.payload.tags.user_id)
    },
  }
}
</script>

<template>
  <div id="message">
    <Badge
      v-for="(badge, pos) in Badges"
      :key="pos"
      :url="badge"
      :pageConfig="pageConfig" />

    <Nickname
      :nick="payload.tags.display_name.toLowerCase() === payload.source.nick ? payload.tags.display_name : `${payload.source.nick}(${payload.tags.display_name})`"
      :color="UserColor"
      :pageConfig="pageConfig"
      :Background="Background"
      :Paints="api.paints"
      :userid="payload.tags.user_id"
      :action="ActionUsername" />

    <span
      id="content"
      v-emotes="{
        emotes: {
          twitch: TwitchEmotes,
          ext: api.emotes,
          personal: pageConfig.hidePersonalEmotes == 'false' ? api.personalEmotes[payload.source.nick] : undefined,
        },
        scale: pageConfig.emoteSizeI,
      }"
      v-bits="Bits"
      >
      {{ payload.parameters.replace(/\s\s+/g, " ") }}
    </span>
  </div>
</template>

<style>
#message {
  border-top: v-bind(Border);
  color: v-bind('SlashMe');
  background-color: v-bind('Background');
  padding-top: 4px;
  padding-bottom: 4px;
  line-height: 1.5em;
}

/* #content {
  -webkit-text-stroke: 0.2em black;
  paint-order: stroke fill;
} */

#content .emote {
  vertical-align: middle;
}

#content img {
  vertical-align: middle;
}

.zero-width-emote-container {
    display: inline-flex;
    align-items: flex-end;
    vertical-align: bottom;
}

#content img[zerowidth="true"] {
  position: absolute;
}

#content .emoji {
  vertical-align: bottom;
  filter: unset;
  width: auto;
  max-height: v-bind('EmojiSize');
}

</style>
