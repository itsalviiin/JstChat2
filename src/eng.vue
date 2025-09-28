<template>
  <div id="main">
    <br>
    <div class="container">
      <div id="title">Just Chat 2</div>
      <br>
      <div id="description">
        JstChat2 is a Twitch chat overlay tool that is able to display emotes from BetterTTV, FrankerFaceZ, and 7TV. You
        can use this in OBS and other streaming softwares that supports browser sources. There are many features with
        this tool (listed below), many of which are customizable. In the settings below, hovering over text with
        underlines like <span class="tooltip" style="font-weight: 600;"><span class="tooltiptextexample"><img
              src="https://cdn.7tv.app/emote/01H0405680000AJFXTYVX2PNJ7/2x.webp"></span>this</span> will give more
        details about the setting :3
        <br><br>
        <div id="heading">
          List of features:
        </div>
        <div id="list">
          <br>• Displays emotes from Twitch, BetterTTV, FrankerFaceZ, and 7TV
          <br>• Auto updates 7TV emotes that are added/removed/renamed to the channel
          <br>• Chat commands that mods and broadcasters can use (!refreshoverlay, !refreshemotes, !hideoverlay,
          !showoverlay, !pauseoverlay, !unpauseoverlay)
          <br>• Zero width emotes are displayed nicely
          <br>• Variety of fonts to choose from including custom ones that are installed on your PC
          <br>• Option to animate chat messages when they appear and fade
          <br>• Option to display system messages
          <br>• Option to highlight first time messages or highlight messages from channel points
          <br>• Option to hide 7TV paints and third-party badges
          <br>• Option to hide personal, unlisted, or private 7TV emotes
          <br>• Option to display shared chat badges
          <br>• Option to hide bots and other users
          <br>• Create custom regex phrases to filter out unwanted messages
        </div>
        <br>
      </div>
    </div>

    <br>

    <div class="container">
      <div class="settings">
        <div class="param">
          <span class="setting-name">
            Channel:
          </span>
          <input id="channel" type="text" placeholder="Channel Name" v-model="channel" />
        </div>

        <div class="param">
          <span class="setting-name">Font:</span>
          <select class="selector" v-model="font" @change="changeCustomFont">
            <option value="Roboto">Roboto</option>
            <option value="Quicksand">Quicksand</option>
            <option value="Segoe UI">Segoe UI (used in Chatterino)</option>
            <option value="Open Sans">Open Sans</option>
            <option value="Montserrat">Montserrat</option>
            <option value="Fredoka">Fredoka</option>
            <option value="Comfortaa">Comfortaa</option>
            <option value="Lato">Lato</option>
            <option value="Noto Sans">Noto Sans</option>
            <option value="Poppins">Poppins</option>
            <option value="Comic Sans MS">Comic Sans MS</option>
            <option value="Jetbrains Mono">Jetbrains Mono</option>
            <option value="Sriracha">Sriracha</option>
            <option value="Pacifico">Pacifico</option>
            <option value="Minecraftia">Minecraftia</option>
            <option value="Custom">[Custom]</option>
          </select>

          <div class="param">
            <span id="customFont">You can use any font installed on your PC:</span>
            <input id="customFont" type="text" placeholder="Font Name" v-model="custom_font" />
          </div>
        </div>

        <div class="param">
          <span class="setting-name">
            Font Size:
          </span>
          <input type="number" min="10" max="60" step="1" placeholder="36" v-model="font_size" />
          <span class="setting-text">px</span>
        </div>

        <div class="param">
          <span class="setting-name tooltip">
            <span class="tooltiptext">Adjust the thickness of the font<br>(Not all fonts will have all possible font
              weights)</span>
            Font Weight:
          </span>
          <input type="number" min="100" max="900" step="100" placeholder="800" v-model="font_weight" />
        </div>
      </div>
    </div>
    <br>
    <div class="container" style="background: none; filter: opacity(1)">
      <div id="example"
        v-bind:style="{ fontFamily: font != 'Custom' ? font : custom_font, fontWeight: font_weight, fontSize: font_size + 'px', backgroundColor: Background, filter: Shadow }">
        <div id="message_example" v-bind:style="{ borderTop: Border }">
          <img class="badges" src="https://static-cdn.jtvnw.net/badges/v1/5527c58c-fb7d-422d-b71b-f309dcb85cc1/2" />
          <img class="badges" src="https://static-cdn.jtvnw.net/badges/v1/5d9f2208-5dd8-11e7-8513-2ff4adfae661/2" />
          <img class="badges" src="https://static-cdn.jtvnw.net/badges/v1/2de71f4f-b152-4308-a426-127a4cf8003a/2" />
          <img class="badges" src="https://cdn.7tv.app/badge/01JM3F4N2Y65KKHDGWDEDFTJNA/2x.webp" />
          <span class="nickname_example" type="itsalviiin">itsalviiin: </span>
          <span id="content_example">
            <div class="emote">
              <span class="zero-width-emote-container" style="justify-content: center;">
                <img class="emote" src="https://cdn.7tv.app/emote/01J0DY2ZD8000396FKBWMCJBB6/2x.webp" zerowidth="false">
                <img class="emote" src="https://cdn.7tv.app/emote/01FNB9W3VR000EJT2EVEY3DGE0/2x.webp" zerowidth="true">
              </span>
              Hey chat!
            </div>
          </span>
        </div>
        <div id="message_example" v-bind:style="{ borderTop: Border }">
          <img class="badges" src="https://static-cdn.jtvnw.net/badges/v1/3267646d-33f0-4b17-b3df-f923a41db1d0/2" />
          <img class="badges" src="https://static-cdn.jtvnw.net/badges/v1/d12a2e27-16f6-41d0-ab77-b780518f00a3/2" />
          <img class="badges" src="https://cdn.frankerfacez.com/badge/2/2/rounded" />
          <img class="badges" src="https://cdn.frankerfacez.com/badge/4/2/rounded" />
          <span class="nickname_example" type="streamelements">StreamElements </span>
          <span id="content_example" style="color: #5B99FF;">
            <img src="https://static-cdn.jtvnw.net/emoticons/v2/305954156/default/dark/2.0" /> <img class="emoji"
              draggable="false" alt="👉"
              src="https://cdn.jsdelivr.net/gh/jdecked/twemoji@16.0.1/assets/72x72/1f449.png"> Check out this new chat
            overlay
          </span>
        </div>
        <div id="message_example" v-bind:style="{ borderTop: Border }">
          <img class="badges" src="https://static-cdn.jtvnw.net/badges/v1/b817aba4-fad8-49e2-b88a-7cc744dfa6ec/2" />
          <img class="badges" src="https://static-cdn.jtvnw.net/badges/v1/2de71f4f-b152-4308-a426-127a4cf8003a/2" />
          <span class="nickname_example" type="elis">elis: </span>
          <span id="content_example">
            <img src="https://cdn.7tv.app/emote/01HS0YC6PR00053R068FSDQXNG/2x.webp" />
          </span>
        </div>
        <div id="message_example" v-bind:style="{ borderTop: Border }">
          <img class="badges" src="https://cdn.betterttv.net/badges/translator.svg" />
          <img class="badges" src="https://static-cdn.jtvnw.net/badges/v1/ae1c6c62-c057-4fad-a1d4-663bf988701f/2" />
          <span class="nickname_example" type="glorp">glorp: </span>
          <span id="content_example">
            <span class="zero-width-emote-container" style="justify-content: center;">
              <img class="emote" src="https://cdn.7tv.app/emote/01HNEKZY4G0001XDKW9GFY7KKV/2x.webp" style="z-index: -1;"
                zerowidth="true">
              <img class="emote" src="https://cdn.7tv.app/emote/01GGRX0GNR0005JFNK2VC9HTVR/2x.webp" zerowidth="false">
            </span> <img id="bits_example"
              src="https://d3aqoihi2n8ty8.cloudfront.net/actions/cheer/dark/animated/100/2.gif" />
            <span id="bits_example"> 100 </span>
            it's cool I guess
          </span>
        </div>
        <div id="message_example" v-bind:style="{ borderTop: Border, backgroundColor: FirstMessage }">
          <img class="badges" src="https://static-cdn.jtvnw.net/badges/v1/e2ba99f4-6079-44d1-8c07-4ca6b58de61f/2" />
          <img class="badges" src="https://fourtf.com/chatterino/badges/supporter2x.png" />
          <img class="badges" src="https://cdn.7tv.app/badge/01JAT9BASQDPE5VV0PMXRYND9E/3x" />
          <span class="nickname_example" type="goldenkappa">GoldenKappa(골든카파): </span>
          <span id="content_example">
            <img src="https://static-cdn.jtvnw.net/emoticons/v2/80393/default/dark/2.0" />
            hello im new
          </span>
        </div>
        <div id="message_example" v-bind:style="{ borderTop: Border, backgroundColor: RedeemedMessage }">
          <img class="badges" src="https://static-cdn.jtvnw.net/badges/v1/d12a2e27-16f6-41d0-ab77-b780518f00a3/2" />
          <img class="badges" src="https://cdn.frankerfacez.com/badge/3/2/rounded" />
          <img class="badges" src="https://cdn.7tv.app/badge/01H85EF8DR00020G66EN3RFP9G/2x.webp" />
          <span class="nickname_example" type="emiru">Emiru: </span>
          <span id="content_example">
            <div class="emote">
              <span class="zero-width-emote-container" style="justify-content: center;">
                <img class="emote" src="https://cdn.7tv.app/emote/01H0VA5M70000AHHWDRHKKDYW1/2x.webp"
                  style="z-index: -1;" zerowidth="true">
                <img class="emote" src="https://cdn.7tv.app/emote/01JXRRCWWK074S15RFEEBX66HP/2x.webp" zerowidth="false">
              </span>
            </div>
          </span>
          <!-- <span id="content_example">
            <img src="https://cdn.7tv.app/emote/01H0VA5M70000AHHWDRHKKDYW1/2x.webp" />
          </span> -->
        </div>
      </div>
    </div>
    <br>
    <div class="container">
      <div class="settings">
        <div class="param">
          <span class="setting-name tooltip">
            <span class="tooltiptext">The total amount of messages to display</span>
            Max Messages:
          </span>
          <input type="number" min="1" max="100" step="1" placeholder="50" v-model="max_messages" />
        </div>

        <div class="param">
          <span class="setting-name tooltip">
            <span class="tooltiptext">For best results, just leave this at 0<br>• 0 is the default size<br>• Positive
              number (add to default) to make it bigger<br>• Negative number (subtract to default) to make it
              smaller</span>
            Emote Size:
          </span>
          <input type="number" min="-20" max="20" step="1" placeholder="0" v-model="emote_size" />
          <span class="setting-text">px</span>
        </div>

        <div class="param">
          <label class="setting-name tooltip" for="shadow">
            <span class="tooltiptext">Display a small drop shadow, looks slightly better against light
              backgrounds</span>
            Shadow:
          </label>
          <input id="shadow" type="checkbox" v-model="shadow" value="false" checked />
        </div>

        <div class="param">
          <span class="setting-name">Background:</span>
          <select class="selector" @change="changeStyle">
            <option value="1">Transparent</option>
            <option value="2">With background</option>
          </select>
        </div>

        <div class="param">
          <span id="backgrounds" class="tooltip">
            <span class="tooltiptext">Makes the messages have a background color as the messages appear. If
              you want a background that covers the area of the entire overlay, add a custom css in OBS instead</span>
            Background Color (HEX):
          </span>
          <input id="backgrounds" type="text" placeholder="#2E2E2E50" v-model="background" />
        </div>
        <!-- <div class="param">
          <span id="backgrounds">Number of Backgrounds:</span>
          <input id="backgrounds" type="number" placeholder="Num" v-model="num_backgrounds" />
        </div> -->
        <div class="param">
          <label class="setting-name" for="border">Border:</label>
          <input id="border" type="checkbox" v-model="border" value="true" checked />
        </div>

        <div class="param">
          <span class="setting-name">Fade Messages (0 = Permanent):</span>
          <input type="number" min="0" step="5" placeholder="0" v-model="fade" />
          <span class="setting-text"> seconds</span>
        </div>

        <div class="param">
          <label class="setting-name tooltip" for="animate_message">
            <span class="tooltiptext">Chat messages are animated as they come in</span>
            Animate Chat Messages:
          </label>
          <input id="animate_message" type="checkbox" v-model="animate" value="true" checked />
        </div>

        <div class="param">
          <span class="setting-name tooltip">
            <span class="tooltiptext">Messages get displayed in intervals, making messages more readable in fast
              chats<br><br>• 0 seconds = New messages appear instantly<br>• 1 second = New messages appear every 1
              second</span>
            Message Display Interval:
          </span>
          <input type="number" min="0" max="1" step="0.1" placeholder="0.2" v-model="display_interval" />
          <span class="setting-text"> seconds</span>
        </div>

        <div class="param">
          <label class="setting-name tooltip" for="readable_colors">
            <span class="tooltiptext">Brightens username colors that are too dark</span>
            Readable Username Colors:
          </label>
          <input id="readable_colors" type="checkbox" v-model="readable_colors" value="false" checked />
        </div>

        <div class="param">
          <label class="setting-name tooltip" for="display_system_messages">
            <span class="tooltiptext">Display system messages from the overlay, Twitch, or 7TV</span>
            Display System Messages:
          </label>
          <input id="display_system_messages" type="checkbox" @change="changeSystemMessages"
            v-model="display_system_messages" value="true" checked />
        </div>

        <div class="param">
          <span class="systemOptions tooltip" for="display_connected">
            <span class="tooltiptext">Display a message when the overlay connects to chat and when the !refreshemotes
              command is used</span>
            • Display Overlay Messages:
          </span>
          <input id="display_connected" class="systemOptions" type="checkbox" v-model="overlay_system_msg" value="true"
            checked />
        </div>
        <div class="param">
          <span class="systemOptions tooltip">
            <span class="tooltiptext">Display Twitch system messages such as when users subscribe, gift, or raid</span>
            • Display Twitch System Messages:
          </span>
          <input class="systemOptions" type="checkbox" v-model="twitch_system_msg" value="true" checked />
        </div>
        <div class="param">
          <span class="systemOptions tooltip">
            <span class="tooltiptext">Display a message when 7TV emotes are added/removed/renamed</span>
            • Display 7TV System Messages:
          </span>
          <input class="systemOptions" type="checkbox" v-model="stv_system_msg" value="true" checked />
        </div>

        <div class="param">
          <label class="setting-name tooltip" for="highlight_first_time_messages">
            <span class="tooltiptext">Messages from first time chatters will have a semi-transparent background
              color</span>
            Highlight First Time Messages:
          </label>
          <input id="highlight_first_time_messages" type="checkbox" v-model="highlight_first_time_messages"
            value="false" checked />
        </div>

        <div class="param">
          <label class="setting-name tooltip" for="highlight_redeemed_messages">
            <span class="tooltiptext">Messages sent from using channel points will have a semi-transparent background
              color</span>
            Highlight Channel Point Messages:
          </label>
          <input id="highlight_redeemed_messages" type="checkbox" v-model="highlight_redeemed_messages" value="false"
            checked />
        </div>

        <div class="param">
          <label class="setting-name tooltip" for="hide_personal_emotes">
            <span class="tooltiptext">
              Do not display personal emotes from 7TV<br><br>• Personal emotes are emotes where users with 7TV
              subscriptions have set as their own emote set
            </span>
            Hide Personal Emotes:
          </label>
          <input id="hide_personal_emotes" type="checkbox" v-model="hide_personal_emotes" value="true" checked />
        </div>
        <div class="param">
          <label class="setting-name tooltip" for="hide_unlisted_emotes">
            <span class="tooltiptext">
              Do not display unlisted emotes from 7TV<br><br>• Unlisted emotes are emotes that have not been approved,
              either because it is a recently added emote or because it might be slightly NSFW/TOS
            </span>
            Hide Unlisted Emotes:
          </label>
          <input id="hide_unlisted_emotes" type="checkbox" v-model="hide_unlisted_emotes" value="true" checked />
        </div>
        <div class="param">
          <label class="setting-name tooltip" for="hide_private_emotes">
            <span class="tooltiptext">
              Do not display private emotes from 7TV<br><br>• Private emotes are emotes that can no longer be added to
              any channel
            </span>
            Hide Private Emotes:
          </label>
          <input id="hide_private_emotes" type="checkbox" v-model="hide_private_emotes" value="true" checked />
        </div>

        <div class="param">
          <label class="setting-name" for="hide_paints">Hide 7TV Paints:</label>
          <input id="hide_paints" type="checkbox" v-model="hide_paints" value="true" checked />
        </div>

        <div class="param">
          <label class="setting-name tooltip" for="hide_special_badges">
            <span class="tooltiptext">
              Hide badges from BTTV, FFZ, 7TV, and Chatterino.<br><br>• Each one is toggleable
            </span>
            Hide Special Badges:
          </label>
          <input id="hide_special_badges" type="checkbox" @change="changeBadges" v-model="hide_special_badges"
            value="true" checked />
        </div>

        <div class="param">
          <span class="badgeOptions" for="hide_bttv_badges">• Hide BTTV Badges:</span>
          <input class="badgeOptions" type="checkbox" v-model="hide_bttv_badges" value="true" checked />
        </div>
        <div class="param">
          <span class="badgeOptions">• Hide FFZ Badges:</span>
          <input class="badgeOptions" type="checkbox" v-model="hide_ffz_badges" value="true" checked />
        </div>
        <div class="param">
          <span class="badgeOptions">• Hide 7TV Badges:</span>
          <input class="badgeOptions" type="checkbox" v-model="hide_7tv_badges" value="true" checked />
        </div>
        <div class="param">
          <span class="badgeOptions">• Hide Chatterino Badges:</span>
          <input class="badgeOptions" type="checkbox" v-model="hide_chatterino_badges" value="true" checked />
        </div>

        <div class="param">
          <span class="setting-name tooltip">
            <span class="tooltiptext">
              Display a badge for shared chats
              <br><br>• Off - No badge
              <br><br>• Simple - Display <img width="20px" height="20px"
                src="https://raw.githubusercontent.com/Chatterino/chatterino2/refs/heads/master/resources/twitch/sharedChat.png" />
              for all messages that come from different chats
              <br><br>• Profile - Display the channel's profile pic as the badge for the respective chat the message
              came from
            </span>Shared Chat Badge:</span>
          <select class="selector" v-model="display_shared_chat_badge" @change="changeOwnProfile">
            <option value="off">Off</option>
            <option value="simple">Simple</option>
            <option value="profile">Profile Image</option>
          </select>
        </div>
        <div class="param">
          <label id="selfSharedBadgeOption" for="selfSharedBadgeOption">Display own Channel Profile Image:</label>
          <input id="selfSharedBadgeOption" type="checkbox" v-model="self_shared_badge" value="false" checked />
        </div>

        <div class="param">
          <label class="setting-name tooltip" for="hide_bots">
            <span class="tooltiptext">
              Hides messages from popular/well-known bots, such as StreamElements, Fossabot, Nightbot, Supibot,
              PotatBotat, and more
            </span>
            Hide Bots:
          </label>
          <input id="hide_bots" type="checkbox" v-model="hide_bots" value="true" checked />
        </div>

        <div class="param">
          <span class="setting-name">User Ignore List:</span>
          <input id="ignore" type="text" placeholder="Usernames separated by commas" v-model="ignore" />
        </div>

        <div class="param">
          <label class="setting-name tooltip" for="hide_commands">
            <span class="tooltiptext">
              Hide messages that start with "!"
              <br><br>• If there are other prefix commands from other bots that you want to hide, use regex in the
              filter section
            </span>
            Hide Commands:
          </label>
          <input id="hide_commands" type="checkbox" v-model="hide_commands" value="true" checked />
        </div>

        <div class="param">
          <span class="setting-name tooltip" for="filter">
            <span class="tooltiptext">
              Use regular expressions (regex) to filter out messages, useful for getting rid of tos words, links, or
              custom prefixes for commands
              <br><br>Example:
              <br>• Hiding messages that start with "#, -, and $": ^[#-$]
              <!-- <br>• Hiding messages that start with "#": ^# -->
              <!-- <br>• Hiding messages that has the word "lol": \blol\b -->
              <!-- <br>• Hiding messages that include the text "fun": fun -->
              <!-- <br>• Hiding messages that include both "what" & "song": ^(?=.*\bwhat\b)(?=.*\bsong\b).*$ -->
            </span>
            Filter Using Regex:
          </span>
          <label class="setting-text">/</label>
          <input id="filter_messages" type="text" placeholder="Regex" v-model="filter_messages" />
          <label class="setting-text">/i</label>
        </div>
      </div>
    </div>
    <br>
    <div class="container">
      <div class="settings">
        <div class="param">
          <div style="text-align: center; font-size: 2em; font-weight: 700; ">Your URL: (click to
            copy)</div>
          <br> <input id="url" type="url" v-model="url" @click="handleURLClick" readonly />
        </div>
        <br>
        <div id="index">
          <span id="git">Original by: <a id="justririll" href="https://github.com/justririll"
              target="_blank">justririll</a> • fork by <a href="https://twitch.tv/itsalviiin" target="_blank">
              <img class="zoom" src="./images/glitch_flat_purple.png" width="15px">
            </a>
            <a id="itsalviiin" href="https://twitch.tv/itsalviiin" target="_blank"> itsalviiin</a></span>
          <br><br>
          <span id="disclaimer">Not affiliated with Twitch</span>
        </div>
      </div>
    </div>
    <br>
  </div>
</template>

<script>
import Common from '@/utils/common'
export default {
  name: 'MainView',
  data: () => {
    return {
      /** Default Values */
      channel: '',

      font: 'Roboto',
      show_custom_font_option: 'false',
      custom_font: '',
      font_size: '36',
      font_weight: '800',
      max_messages: '50',
      emote_size: '0',
      shadow: 'true',

      show_bg_options: 'false',
      background: 'transparent',
      // num_backgrounds: 0,
      border: 'false',

      fade: '0',
      animate: 'false',
      display_interval: '0.2',
      readable_colors: 'true',
      display_system_messages: 'false',
      overlay_system_msg: 'false',
      twitch_system_msg: 'false',
      stv_system_msg: 'false',
      show_system_options: 'false',
      highlight_first_time_messages: 'false',
      highlight_redeemed_messages: 'false',

      hide_personal_emotes: 'false',
      hide_unlisted_emotes: 'false',
      hide_private_emotes: 'false',

      hide_paints: 'false',
      hide_special_badges: 'false',
      show_badges_options: 'false',
      hide_bttv_badges: 'false',
      hide_ffz_badges: 'false',
      hide_7tv_badges: 'false',
      hide_chatterino_badges: 'false',
      display_shared_chat_badge: 'off',
      show_self_shared_badge_option: 'false',
      self_shared_badge: 'false',

      hide_bots: 'true',
      hide_commands: 'false',
      ignore: '',
      filter_messages: '',
    }
  },
  computed: {
    url() {
      if (this.channel == '') {
        return
      }
      let font = this.font,
        font_size = '',
        font_weight = '',
        max_messages = '',
        emote_size = '',
        shadow = '',
        bg = '',
        // nb = '',
        border = '',
        fade = '',
        animate = '',
        display_interval = '',
        readable_colors = '',
        overlay_system_msg = '',
        twitch_system_msg = '',
        stv_system_msg = '',
        highlight_first_time = '',
        highlight_redeemed = '',
        hide_personal = '',
        hide_unlisted = '',
        hide_private = '',
        hide_paints = '',
        hide_bttv_badge = '',
        hide_ffz_badge = '',
        hide_7tv_badge = '',
        hide_chatterino_badge = '',
        shared_chat_badge = '',
        self_shared_badge = '',
        hide_bots = '',
        hide_commands = '',
        ignore = '',
        filter = ''

      if (this.custom_font != '') {
        font = this.custom_font
      }

      font_size = this.font_size != '36' ? `&font_size=${this.font_size}` : ``
      font_weight = this.font_weight != '800' ? `&font_weight=${this.font_weight}` : ``
      max_messages = this.max_messages != '50' ? `&max_messages=${this.max_messages}` : ``
      emote_size = this.emote_size != '0' ? `&emote_size=${this.emote_size}` : ``
      shadow = this.shadow != 'true' ? `&shadow=${this.shadow}` : ``
      bg = this.background != 'transparent' ? `&background=${this.background[0] == "#" ? this.background.substring(1) : this.background}` : ``
      // nb = this.num_backgrounds != 0 ? `&sb=${this.num_backgrounds}` : ``
      border = this.border != 'false' ? `&border=${this.border}` : ``
      fade = this.fade != '0' ? `&fade_after=${this.fade}` : ``
      animate = this.animate != 'false' ? `&animate=${this.animate}` : ``
      display_interval = parseFloat(this.display_interval) * 1000 != 200 ? `&display_interval=${parseFloat(this.display_interval) * 1000}` : ``
      readable_colors = this.readable_colors != 'true' ? `&readable_colors=${this.readable_colors}` : ``
      overlay_system_msg = this.overlay_system_msg != 'false' && this.display_system_messages ? `&overlay_sys_msg=${this.overlay_system_msg}` : ``
      twitch_system_msg = this.twitch_system_msg != 'false' && this.display_system_messages ? `&twitch_sys_msg=${this.twitch_system_msg}` : ``
      stv_system_msg = this.stv_system_msg != 'false' && this.display_system_messages ? `&stv_sys_msg=${this.stv_system_msg}` : ``
      highlight_first_time = this.highlight_first_time_messages != 'false' ? `&highlight_first_time=${this.highlight_first_time_messages}` : ``
      highlight_redeemed = this.highlight_redeemed_messages != 'false' ? `&highlight_redeemed=${this.highlight_redeemed_messages}` : ``
      hide_personal = this.hide_personal_emotes != 'false' ? `&hide_personal=${this.hide_personal_emotes}` : ``
      hide_unlisted = this.hide_unlisted_emotes != 'false' ? `&hide_unlisted=${this.hide_unlisted_emotes}` : ``
      hide_private = this.hide_private_emotes != 'false' ? `&hide_private=${this.hide_private_emotes}` : ``
      hide_paints = this.hide_paints != 'false' ? `&hide_paints=${this.hide_paints}` : ``
      hide_bttv_badge = this.hide_bttv_badges != 'false' ? `&hide_bttv_badge=${this.hide_bttv_badges}` : ``
      hide_ffz_badge = this.hide_ffz_badges != 'false' ? `&hide_ffz_badge=${this.hide_ffz_badges}` : ``
      hide_7tv_badge = this.hide_7tv_badges != 'false' ? `&hide_7tv_badge=${this.hide_7tv_badges}` : ``
      hide_chatterino_badge = this.hide_chatterino_badges != 'false' ? `&hide_chatterino_badge=${this.hide_chatterino_badges}` : ``
      shared_chat_badge = this.display_shared_chat_badge != 'off' ? `&shared_chat_badge=${this.display_shared_chat_badge}` : ``
      self_shared_badge = this.self_shared_badge != 'false' ? `&self_shared_badge=${this.self_shared_badge}` : ``
      hide_bots = this.hide_bots != 'true' ? `&hide_bots=${this.hide_bots}` : ``
      hide_commands = this.hide_commands != 'false' ? `&hide_commands=${this.hide_commands}` : ``
      ignore = this.ignore != '' ? `&hide=${this.ignore.replace(/\s+/g, '')}` : ``
      filter = this.filter_messages != '' ? `&filter=${encodeURIComponent(this.filter_messages)}` : ``

      return `https://itsalviiin.github.io/JstChat2/#/chat?channel=${this.channel.toLowerCase()}&font=${encodeURIComponent(font)}${font_size}${font_weight}${max_messages}${emote_size}${shadow}${bg}${border}${fade}${animate}${display_interval}${readable_colors}${overlay_system_msg}${twitch_system_msg}${stv_system_msg}${highlight_first_time}${highlight_redeemed}${hide_personal}${hide_unlisted}${hide_private}${hide_paints}${hide_bttv_badge}${hide_ffz_badge}${hide_7tv_badge}${hide_chatterino_badge}${shared_chat_badge}${self_shared_badge}${hide_bots}${hide_commands}${ignore}${filter}`
    },
    showBackgroundOptions() {
      if (this.show_bg_options == 'true') {
        return `initial`
      } else {
        return `none`
      }
    },
    showBadgeOptions() {
      if (this.show_badges_options == 'true') {
        return `initial`
      } else {
        return `none`
      }
    },
    showSystemOptions() {
      if (this.show_system_options == 'true') {
        return `initial`
      } else {
        return `none`
      }
    },
    showSelfSharedBadgeOption() {
      if (this.show_self_shared_badge_option == 'true') {
        return `initial`
      } else {
        return `none`
      }
    },
    showCustomFontOption() {
      if (this.show_custom_font_option == 'true') {
        return `block`
      } else {
        return `none`
      }
    },
    badgeSize() {
      return `${Math.round(0.8 * this.font_size + 4.4)}px`
    },
    filter() {
      try {
        return this.paint_shadows
          .map(
            (v) =>
              `drop-shadow(${v.x_offset * 2}px ${v.y_offset * 2}px ${v.radius}px ${Common.DecimalToStringRGBA(v.color)})`,
          )
          .join(' ')
      } catch {
        return ''
      }
    },
    MessageSize() {
      return `${Math.round(1.33 * this.font_size + 7)}px`
    },
    Background() {
      if (this.show_bg_options) {
        return this.background
      }
      return '#000000'
    },
    Shadow() {
      if (String(this.shadow) == 'true') {
        return `drop-shadow(3px 3px 1.5px black)`
      }
      return `none`
    },
    FirstMessage() {
      if (String(this.highlight_first_time_messages) == 'true') {
        return `rgba(92, 125, 86, 0.4)`
      }
      return `transparent`
    },
    RedeemedMessage() {
      if (String(this.highlight_redeemed_messages) == 'true') {
        return `rgba(64, 121, 128, 0.4)`
      }
      return `transparent`
    },
    Border() {
      if (String(this.border) == 'true') {
        return `2px solid black`
      }
      return `none`
    }
  },
  methods: {
    handleURLClick() {
      if (this.url) {
        document.getElementById("url").select()
        navigator.clipboard.writeText(this.url)
      } else {
        document.getElementById("channel").focus()
      }
    },
    changeCustomFont() {
      if (this.font == 'Custom') {
        this.show_custom_font_option = 'true'
      } else {
        this.show_custom_font_option = 'false'
      }
    },
    changeBadges() {
      if (this.hide_special_badges) {
        this.show_badges_options = 'true'
        this.hide_bttv_badges = 'true'
        this.hide_ffz_badges = 'true'
        this.hide_7tv_badges = 'true'
        this.hide_chatterino_badges = 'true'
      } else {
        this.show_badges_options = 'false'
        this.hide_bttv_badges = 'false'
        this.hide_ffz_badges = 'false'
        this.hide_7tv_badges = 'false'
        this.hide_chatterino_badges = 'false'
      }
    },
    changeSystemMessages() {
      if (this.display_system_messages) {
        this.show_system_options = 'true'
        this.overlay_system_msg = 'false'
        this.twitch_system_msg = 'false'
        this.stv_system_msg = 'false'
      } else {
        this.show_system_options = 'false'
        this.overlay_system_msg = 'true'
        this.twitch_system_msg = 'true'
        this.stv_system_msg = 'true'
      }
    },
    changeStyle(event) {
      switch (event.target.value.trim()) {
        case '1':
          this.background = 'transparent'
          // this.num_backgrounds = '0'
          this.show_bg_options = 'false'
          break
        case '2':
          this.background = '#2E2E2E40'
          // this.num_backgrounds = 4
          this.show_bg_options = 'true'
          break
      }
    },
    changeOwnProfile() {
      if (this.display_shared_chat_badge == 'profile') {
        this.show_self_shared_badge_option = 'true'
        this.self_shared_badge = 'true'
      } else {
        this.show_self_shared_badge_option = 'false'
        this.self_shared_badge = 'false'
      }
    }
  },
}
</script>

<style>
* {
  --corner-radius: 20px;
}

html {
  color-scheme: dark !important;
}

body {
  margin: 0;
}

#main {
  animation: gradient 20s ease infinite;
  background: linear-gradient(-45deg, #814bff, #84dcff, #9c80ff, #ffb9be, #c063ff);
  background-size: 600% 600%;
  font-family: 'Roboto', sans-serif;
  min-height: 100dvh;
  position: absolute;
  text-shadow: 2px 2px 0.2rem black;
  width: 100%;
}

@keyframes gradient {
  0% {
    background-position: 0% 50%;
  }

  50% {
    background-position: 100% 50%;
  }

  100% {
    background-position: 0% 50%;
  }
}

.container {
  background-color: #181818;
  border-radius: var(--corner-radius);
  filter: drop-shadow(0px 0px 4px rgba(0, 0, 0, 1));
  margin: auto;
  padding: 20px;
  width: 60%;
}

#title {
  max-width: fit-content;
  margin-inline: auto;
  font-size: 3em;
  font-weight: 800;
}

#index {
  text-align: center;
}

#heading {
  font-size: 20px;
  font-weight: bold;
  text-align: center;
}

#list {
  margin: auto;
  width: 80%;
}

.settings {
  width: fit-content;
  margin-inline: auto;
}

.param {
  margin-top: 20px;
  margin-bottom: 20px;
}

.setting-name {
  font-size: 2em;
  font-weight: 700;
  margin-right: 2em;
}

.setting-text {
  font-size: 2em;
}

.selector {
  border: none;
  background: #2e2e2e;
  width: 12em;
  font-size: 2em;
}

#bits_example {
  color: #9C3EE8;
}

#example {
  display: inline-block;
  width: 100%;
  min-height: v-bind(MessageSize);
  text-shadow: none !important;
  vertical-align: middle;
}

#message_example {
  line-height: 55px;
  /* padding-top: 4px;
  padding-bottom: 4px; */
  padding-left: 5px;
}

.badges {
  height: v-bind('badgeSize');
  padding-right: 5px;
  vertical-align: -4px;
}

.nickname_example[type="itsalviiin"] {
  background-size: cover;
  -webkit-text-fill-color: transparent;
  -webkit-background-clip: text;
  background-clip: text !important;
  background-color: currentcolor;
  background-image: url("https://cdn.7tv.app/paint/01J5RNC5N80001EVC269JT9JJG/layer/01JAMR3AY2E5PC81XDZ0DN720K/1x.webp");
  filter: drop-shadow(rgb(216, 85, 85) 1px 1px 4px) drop-shadow(rgb(230, 188, 188) 0px 0px 2px);
  color: #2FFFF2
}

.nickname_example[type="elis"] {
  background-size: cover;
  -webkit-text-fill-color: transparent;
  -webkit-background-clip: text;
  background-clip: text !important;
  background-color: currentcolor;
  background-image: url("https://cdn.7tv.app/paint/01J5RNC5N80001EVC269JT9JJG/layer/01JAMR3AY2E5PC81XDZ0DN720K/1x.webp");
  filter: drop-shadow(rgb(216, 85, 85) 1px 1px 4px) drop-shadow(rgb(230, 188, 188) 0px 0px 2px);
  color: #FFCECE
}

.nickname_example[type="goldenkappa"] {
  background-size: cover;
  -webkit-text-fill-color: transparent;
  -webkit-background-clip: text;
  background-clip: text !important;
  background-color: currentcolor;
  background-image: repeating-linear-gradient(135deg, rgb(254, 201, 57) 0%, rgb(254, 201, 57) 15%, rgb(255, 237, 148) 15%, rgb(255, 237, 148) 30%);
  filter: drop-shadow(rgb(255, 149, 0) 0px 0px 0.1px) drop-shadow(rgb(255, 149, 0) 0px 0px 4px);
  color: #2FFFF2
}

.nickname_example[type="streamelements"] {
  color: #5B99FF;
}

.nickname_example[type="glorp"] {
  color: #D1EF8D;
}

.nickname_example[type="emiru"] {
  background-size: cover;
  -webkit-text-fill-color: transparent;
  -webkit-background-clip: text;
  background-clip: text !important;
  background-color: currentcolor;
  background-image: repeating-radial-gradient(circle, rgb(255, 255, 255) 17%, rgb(255, 255, 255) 19%, rgb(255, 184, 215) 34%);
  filter: drop-shadow(rgb(255, 184, 242) 0px 0px 1px) drop-shadow(rgb(254, 144, 144) 1px 1px 0.5px) drop-shadow(rgb(106, 36, 36) 0.5px 0.5px 0.5px) drop-shadow(rgb(255, 148, 226) 0.5px 0.5px 0.3px);
  color: #FF69B4;
}

.zero-width-emote-container {
  display: inline-flex;
  align-items: flex-end;
  vertical-align: bottom;
}

#content_example img {
  vertical-align: middle;
}

#content_example .emote {
  display: inline;
  vertical-align: middle;
}

#content_example img[zerowidth='true'] {
  position: absolute;
}

.param>#customFont {
  display: v-bind('showCustomFontOption');
  font-size: 2em;
  color: #aaaaaa;
}

.param>#backgrounds {
  display: v-bind('showBackgroundOptions');
  font-size: 1.5em;
  margin-left: 2em;
}

.param>.badgeOptions {
  display: v-bind('showBadgeOptions');
  font-size: 1.5em;
  margin-left: 2em;
}

.param>.systemOptions {
  display: v-bind('showSystemOptions');
  font-size: 1.5em;
  margin-left: 2em;
}

.param>#selfSharedBadgeOption {
  display: v-bind('showSelfSharedBadgeOption');
  font-size: 1.5em;
  margin-left: 2em;
}

#justririll {
  text-decoration: none;
  color: #FFFFFF;
}

#itsalviiin {
  text-decoration: none;
  color: #2FFFF2;
}

input {
  border: none;
  border-radius: 10px;
  background: #2e2e2e;
  color: white;
  font-size: 2em;
}

input[type='url'] {
  width: 30em;
}

input[id="ignore"] {
  width: 16em;
}

input[type='number'] {
  width: 2.5em;
  background-color: #2e2e2e;
}

input[type='checkbox'] {
  width: 1em;
  transform: scale(2.3);
  vertical-align: baseline;
  accent-color: #2196f3;
}

#content_example .emoji {
  vertical-align: bottom;
  width: auto;
  max-height: 1.5em;
}

/* Tooltip container */
.tooltip {
  position: relative;
  display: inline-block;
  border-bottom: 3px groove #696969;
}

/* Tooltip text */
.tooltip .tooltiptext {
  font-weight: 400;
  font-size: 15px;
  visibility: hidden;
  background-color: #696969;
  color: #FFFFFF;
  text-align: center;
  padding: 5px 5px;
  border-radius: 6px;
  position: absolute;
  z-index: 1;
  width: 360px;
  margin-left: -180px;
  /* Half of width to center */
  bottom: 130%;
  left: 50%;
}

.tooltip .tooltiptextexample {
  font-weight: 400;
  font-size: 15px;
  visibility: hidden;
  background-color: #696969;
  color: #FFFFFF;
  text-align: center;
  padding: 5px 5px;
  border-radius: 6px;
  position: absolute;
  z-index: 1;
  max-width: max-content;
  margin-left: -60px;
  /* Half of width to center */
  bottom: 130%;
  left: 50%;
}

.tooltip:hover .tooltiptext {
  visibility: visible;
}

.tooltip:hover .tooltiptextexample {
  visibility: visible;
}

.tooltip .tooltiptext::after {
  content: " ";
  position: absolute;
  top: 100%;
  /* At the bottom of the tooltip */
  left: 50%;
  margin-left: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: #696969 transparent transparent transparent;
}

.tooltip .tooltiptextexample::after {
  content: " ";
  position: absolute;
  top: 100%;
  /* At the bottom of the tooltip */
  left: 50%;
  margin-left: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: #696969 transparent transparent transparent;
}

ul li {
  float: left;
  width: 50%;
  margin-left: 10em;
  text-align: left;
}

ul {
  columns: 3;
  list-style-type: disc;
  text-align: center;
}

#description {
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 80%;
}

.zoom {
  transition: transform .2s;
}

.zoom:hover {
  transform: scale(1.3);
}
</style>
