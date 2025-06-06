<template>
  <div id="main">
    <div id="index">
      <div id="title">Just Chat 2</div>
      <br />
      <div id="description">
        JstChat2 is a Twitch chat overlay tool that is able to display emotes from BetterTTV, FrankerFaceZ, and 7TV. You can use this in OBS and other streaming softwares that supports browser sources. There are many features with this tool (listed below), many of which are customizable. In the settings below, hovering over text with underlines like <span class="tooltip" style="font-weight: 600;"><span class="tooltiptextexample"><img src="https://cdn.7tv.app/emote/01H0405680000AJFXTYVX2PNJ7/2x.webp"></span>this</span> will give more details about the setting :3

        <br /><br />List of features:
        <div id="list">
          <br />• Displays emotes from Twitch (including bits), BetterTTV, FrankerFaceZ, and 7TV
          <br />• Auto updates 7TV emotes that are added/removed to the channel
          <br />• Chat commands that mods and broadcasters can use (!refreshoverlay, !refreshemotes, !hideoverlay, !showoverlay)
          <br />• Zero width emotes are displayed nicely
          <br />• Variety of fonts to use including custom ones that are installed in your PC
          <br />• Option to animate chat messages when they appear and fade
          <br />• Option to display 7TV paints and third-party badges
          <br />• Option to hide personal, unlisted, or private 7TV emotes
          <br />• Option to display shared chat badges
          <br />• Option to highlight first time messages or messages using channel points
          <br />• Option to hide bots and other users
          <br />• Create custom regex phrases to filter out unwanted messages
        </div>
      </div>
    </div>

    <div id="params">
      <br />
      <div id="param">
        <span id="info" v-bind:style="{ fontWeight: 700 }">
          Channel:
        </span>
        <input type="text" placeholder="Channel Name" v-model="channel" />
      </div>

      <div id="param">
        <span id="info" v-bind:style="{ fontWeight: 700 }">Font:</span>
        <select id="selector" v-model="font" @change="changeCustomFont">
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

        <div id="param">
          <span id="customFont">You can use any font installed on your PC:</span>
          <input id="customFont" type="text" placeholder="Font Name" v-model="custom_font" />
        </div>
      </div>

      <div id="param">
        <span id="info" v-bind:style="{ fontWeight: 700 }">
          Font Size:
        </span>
        <input type="number" min="10" max="128" step="1" placeholder="36" v-model="font_size" />
        <span id="info">px</span>
      </div>

      <div id="param">
        <span id="info" class="tooltip" v-bind:style="{ fontWeight: 700 }">
          <span class="tooltiptext">Adjust the thickness of the font<br />Play around until you find the right thickness for the font<br />(Not all fonts will have all possible font weights)</span>
          Font Weight:
        </span>
        <input type="number" min="100" max="900" step="100" placeholder="800" v-model="font_weight" />
      </div>

      <br />
      <br />
      <br />

      <div id="example" v-bind:style="{ fontFamily: font != 'Custom' ? font : custom_font, fontWeight: font_weight, fontSize: font_size + 'px', backgroundColor: Background }">
        <div id="message_example">
          <img class="badges" src="https://static-cdn.jtvnw.net/badges/v1/5527c58c-fb7d-422d-b71b-f309dcb85cc1/2" />
          <img class="badges" src="https://static-cdn.jtvnw.net/badges/v1/5d9f2208-5dd8-11e7-8513-2ff4adfae661/2" />
          <img class="badges" src="https://static-cdn.jtvnw.net/badges/v1/2de71f4f-b152-4308-a426-127a4cf8003a/2" />
          <img class="badges" src="https://cdn.7tv.app/badge/01JM3F4N2Y65KKHDGWDEDFTJNA/2x.webp" />
          <span id="nickname" type="itsalviiin">itsalviiin: </span>
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
        <div id="message_example">
          <img class="badges" src="https://static-cdn.jtvnw.net/badges/v1/3267646d-33f0-4b17-b3df-f923a41db1d0/2" />
          <img class="badges" src="https://static-cdn.jtvnw.net/badges/v1/d12a2e27-16f6-41d0-ab77-b780518f00a3/2" />
          <img class="badges" src="https://cdn.frankerfacez.com/badge/2/2/rounded" />
          <img class="badges" src="https://cdn.frankerfacez.com/badge/4/2/rounded" />
          <span id="nickname" type="streamelements">StreamElements </span>
          <span id="content_example" style="color: #5B99FF;">
            <img src="https://static-cdn.jtvnw.net/emoticons/v2/305954156/default/dark/2.0" /> <img class="emoji" draggable="false" alt="👉" src="https://cdn.jsdelivr.net/gh/jdecked/twemoji@16.0.1/assets/72x72/1f449.png"> Check out this new chat overlay
          </span>
        </div>
        <div id="message_example">
          <img class="badges" src="https://static-cdn.jtvnw.net/badges/v1/b817aba4-fad8-49e2-b88a-7cc744dfa6ec/2" />
          <img class="badges" src="https://static-cdn.jtvnw.net/badges/v1/2de71f4f-b152-4308-a426-127a4cf8003a/2" />
          <span id="nickname" type="elis">elis: </span>
          <span id="content_example">
              do this
            <img class="emote" src="https://cdn.7tv.app/emote/01JTJPT7PDCEDEH59BMP6PGFN5/2x.webp" /> <img class="emote" src="https://cdn.7tv.app/emote/01JTJPT7PDCEDEH59BMP6PGFN5/2x.webp" /> <img class="emote" src="https://cdn.7tv.app/emote/01JTJPT7PDCEDEH59BMP6PGFN5/2x.webp" />
          </span>
        </div>
        <div id="message_example">
          <img class="badges" src="https://cdn.betterttv.net/badges/translator.svg" />
          <img class="badges" src="https://static-cdn.jtvnw.net/badges/v1/ae1c6c62-c057-4fad-a1d4-663bf988701f/2" />
          <span id="nickname" type="glorp">glorp: </span>
          <span id="content_example">
            <span class="zero-width-emote-container" style="justify-content: center;">
              <img class="emote" src="https://cdn.7tv.app/emote/01HNEKZY4G0001XDKW9GFY7KKV/2x.webp" style="z-index: -1;" zerowidth="true">
              <img class="emote" src="https://cdn.7tv.app/emote/01GGRX0GNR0005JFNK2VC9HTVR/2x.webp" zerowidth="false">
            </span> <img id="bits" src="https://d3aqoihi2n8ty8.cloudfront.net/actions/cheer/dark/animated/100/2.gif" /> <span id="bits"> 100 </span>
            it's cool I guess
          </span>
        </div>
        <div id="message_example" style="background-color: rgba(92, 125, 86, 0.4);">
          <img class="badges" src="https://static-cdn.jtvnw.net/badges/v1/e2ba99f4-6079-44d1-8c07-4ca6b58de61f/2" />
          <img class="badges" src="https://fourtf.com/chatterino/badges/supporter2x.png" />
          <img class="badges" src="https://cdn.7tv.app/badge/01JAT9BASQDPE5VV0PMXRYND9E/3x" />
          <span id="nickname" type="goldenkappa">GoldenKappa(골든카파): </span>
          <span id="content_example">
            <img src="https://static-cdn.jtvnw.net/emoticons/v2/80393/default/dark/2.0" />
            hello im new
          </span>
        </div>
        <div id="message_example">
          <img class="badges" src="https://static-cdn.jtvnw.net/badges/v1/d12a2e27-16f6-41d0-ab77-b780518f00a3/2" />
          <img class="badges" src="https://cdn.frankerfacez.com/badge/3/2/rounded" />
          <img class="badges" src="https://cdn.7tv.app/badge/01GJGS2XY00002GRV318PGDRKV/2x.webp" />
          <span id="nickname" type="deme">deme: </span>
          <span id="content_example">
            <img src="https://cdn.7tv.app/emote/01HS0YC6PR00053R068FSDQXNG/2x.webp" />
          </span>
        </div>
      </div>

      <br />
      <br />
      <br />

      <div id="param">
        <span id="info" class="tooltip" v-bind:style="{ fontWeight: 700 }">
          <span class="tooltiptext">For best results, just leave this at 0<br />• 0 is the default size<br />• Positive number (add to default) to make it bigger<br />• Negative number (subtract to default) to make it smaller</span>
          Emote Size:
        </span>
        <input type="number" min="-20" max="20" step="1" placeholder="0" v-model="emote_size" />
        <span id="info">px</span>
      </div>

      <div id="param">
        <label class="tooltip" v-bind:style="{ fontWeight: 700 }">
          <span class="tooltiptext">Display a small drop shadow, looks slightly better against light backgrounds</span>
          Shadow:
        </label>
        <input id="shadow" type="checkbox" v-model="shadow" value="false" checked />
      </div>

      <div id="param">
        <span id="info" v-bind:style="{ fontWeight: 700 }">Background:</span>
        <select id="selector" @change="changeStyle">
          <option value="1">Transparent</option>
          <option value="2">With background</option>
        </select>
      </div>

      <div id="param">
        <span id="backgrounds">Background (HEX):</span>
        <input id="backgrounds" type="text" placeholder="Background" v-model="background" />
      </div>
      <div id="param">
        <span id="backgrounds">Number of Backgrounds:</span>
        <input id="backgrounds" type="number" placeholder="Num" v-model="num_backgrounds" />
      </div>
      <div id="param">
        <label id="backgrounds" for="backgrounds">Border:</label>
        <input id="backgrounds" type="checkbox" v-model="border" value="true" checked />
      </div>

      <div id="param">
        <span id="info" v-bind:style="{ fontWeight: 700 }">Fade Messages (0 = Permanent):</span>
        <input type="number" min="0" step="5" placeholder="0" v-model="fade" />
        <span id="info"> seconds</span>
      </div>

      <div id="param">
        <label class="tooltip" for="hide_animation" v-bind:style="{ fontWeight: 700 }">
          <span class="tooltiptext">Chat messages are animated as they come in</span>
          Animate Chat Messages:
        </label>
        <input id="hide_animation" type="checkbox" v-model="animate" value="true" checked />
      </div>

      <div id="param">
        <span id="info" class="tooltip" v-bind:style="{ fontWeight: 700 }">
          <span class="tooltiptext">Messages get displayed in intervals, making messages more readable in fast chats<br /><br />• 0 seconds = Instant</span>
          Message Display Interval:
        </span>
        <input type="number" min="0" max="1" step="0.1" placeholder="0.2" v-model="display_interval" />
        <span id="info"> seconds</span>
      </div>

      <div id="param">
        <label class="tooltip" for="readable_colors" v-bind:style="{ fontWeight: 700 }">
          <span class="tooltiptext">Brightens username colors that are too dark</span>
          Readable Username Colors:
        </label>
        <input id="readable_colors" type="checkbox" v-model="readable_colors" value="false" checked />
      </div>

      <div id="param">
        <label class="tooltip" for="highlight_first_time_messages" v-bind:style="{ fontWeight: 700 }">
          <span class="tooltiptext">Messages from first time chatters will have a semi-transparent background color</span>
          Highlight First Time Messages:
        </label>
        <input id="highlight_first_time_messages" type="checkbox" v-model="highlight_first_time_messages" value="false" checked />
      </div>

      <div id="param">
        <label class="tooltip" for="highlight_redeemed_messages" v-bind:style="{ fontWeight: 700 }">
          <span class="tooltiptext">Messages sent from using channel points will have a semi-transparent background color</span>
          Highlight Channel Point Messages:
        </label>
        <input id="highlight_redeemed_messages" type="checkbox" v-model="highlight_redeemed_messages" value="false" checked />
      </div>

      <div id="param">
        <label class="tooltip" for="hide_personal_emotes" v-bind:style="{ fontWeight: 700 }">
          <span class="tooltiptext">
            Do not display personal emotes from 7TV<br /><br />• Personal emotes are emotes where users with 7TV subscriptions have set as their own emote set
          </span>
          Hide Personal Emotes:
        </label>
        <input id="hide_personal_emotes" type="checkbox" v-model="hide_personal_emotes" value="true" checked />
      </div>
      <div id="param">
        <label class="tooltip" for="hide_unlisted_emotes" v-bind:style="{ fontWeight: 700 }">
          <span class="tooltiptext">
            Do not display unlisted emotes from 7TV<br /><br />• Unlisted emotes are emotes that have not been approved, either because it is a recently added emote or because it might be slightly NSFW/TOS
          </span>
          Hide Unlisted Emotes:
        </label>
        <input id="hide_unlisted_emotes" type="checkbox" v-model="hide_unlisted_emotes" value="true" checked />
      </div>
      <div id="param">
        <label class="tooltip" for="hide_private_emotes" v-bind:style="{ fontWeight: 700 }">
          <span class="tooltiptext">
            Do not display private emotes from 7TV<br /><br />• Private emotes are emotes that can no longer be added to any channel
          </span>
          Hide Private Emotes:
        </label>
        <input id="hide_private_emotes" type="checkbox" v-model="hide_private_emotes" value="true" checked />
      </div>

      <div id="param">
        <label for="hide_paints" v-bind:style="{ fontWeight: 700 }">Hide 7TV Paints:</label>
        <input id="hide_paints" type="checkbox" v-model="hide_paints" value="true" checked />
      </div>

      <div id="param">
        <label class="tooltip" for="hide_special_badges" v-bind:style="{ fontWeight: 700 }">
          <span class="tooltiptext">
            Hide badges from BTTV, FFZ, 7TV, and Chatterino.<br /><br />• Each one is toggleable
          </span>
          Hide Special Badges:
        </label>
        <input id="hide_special_badges" type="checkbox" @change="changeBadges" v-model="hide_special_badges" value="true" checked />
      </div>

      <div id="param">
        <span id="badgeOptions">• Hide BTTV Badges:</span>
        <input id="badgeOptions" type="checkbox" v-model="hide_bttv_badges" value="true" checked />
      </div>
      <div id="param">
        <span id="badgeOptions">• Hide FFZ Badges:</span>
        <input id="badgeOptions" type="checkbox" v-model="hide_ffz_badges" value="true" checked />
      </div>
      <div id="param">
        <span id="badgeOptions">• Hide 7TV Badges:</span>
        <input id="badgeOptions" type="checkbox" v-model="hide_7tv_badges" value="true" checked />
      </div>
      <div id="param">
        <span id="badgeOptions">• Hide Chatterino Badges:</span>
        <input id="badgeOptions" type="checkbox" v-model="hide_chatterino_badges" value="true" checked />
      </div>

      <div id="param">
        <span class="tooltip" id="info" v-bind:style="{ fontWeight: 700 }">
          <span class="tooltiptext">
            Display a badge for shared chats
            <br /><br />• Off - No badge
            <br /><br />• Simple - Display <img width="20px" height="20px" src="https://raw.githubusercontent.com/Chatterino/chatterino2/refs/heads/master/resources/twitch/sharedChat.png" /> for all messages that come from different chats
            <br /><br />• Profile - Display the channel's profile pic as the badge for the respective chat the message came from
          </span>
          Shared Chat Badge:
          </span>
        <select id="selector" v-model="display_shared_chat_badge" @change="changeOwnProfile" >
          <option value="off">Off</option>
          <option value="simple">Simple</option>
          <option value="profile">Profile Image</option>
        </select>
      </div>
      <div id="param">
        <label id="selfSharedBadgeOption" for="selfSharedBadgeOption">Display own Profile Image:</label>
        <input id="selfSharedBadgeOption" type="checkbox" v-model="self_shared_badge" value="false" checked />
      </div>

      <div id="param">
        <label class="tooltip" for="hide_bots" v-bind:style="{ fontWeight: 700 }">
          <span class="tooltiptext">
            Hides messages from popular/well-known bots, such as StreamElements, Fossabot, Nightbot, Supibot, PotatBotat, and more
          </span>
          Hide Bots:
        </label>
        <input id="hide_bots" type="checkbox" v-model="hide_bots" value="true" checked />
      </div>

      <div id="param">
        <span id="info" v-bind:style="{ fontWeight: 700 }">User Ignore List:</span>
        <input id="ignore" type="text" placeholder="Usernames separated by commas" v-model="ignore" />
      </div>

      <div id="param">
        <label class="tooltip" for="hide_commands" v-bind:style="{ fontWeight: 700 }">
          <span class="tooltiptext">
            Hide messages that start with "!"
            <br /><br />• If there are other prefix commands from other bots that you want to hide, use regex in the filter section
          </span>
          Hide Commands:
        </label>
        <input id="hide_commands" type="checkbox" v-model="hide_commands" value="true" checked />
      </div>

      <div id="param">
        <span id="info" class="tooltip" for="filter" v-bind:style="{ fontWeight: 700 }">
          <span class="tooltiptext">
            Use regular expressions (regex) to filter out messages, useful for getting rid of tos words, links, or custom prefixes for commands
            <br /><br />Example:
            <br />• Hiding messages that start with "#, -, and $": ^[#-$]
            <!-- <br />• Hiding messages that start with "#": ^# -->
            <!-- <br />• Hiding messages that has the word "lol": \blol\b -->
            <!-- <br />• Hiding messages that include the text "fun": fun -->
            <!-- <br />• Hiding messages that include both "what" & "song": ^(?=.*\bwhat\b)(?=.*\bsong\b).*$ -->
          </span>
          Filter Using Regex:
        </span>
        <label>/</label>
        <input id="filter_messages" type="text" placeholder="Regex" v-model="filter_messages" />
        <label>/i</label>
      </div>

      <br />
      <br />
      <br />

      <div id="param">
        <span id="info" v-bind:style="{ fontWeight: 700 }">Your URL: (click to copy)</span> <br />
        <input type="url" placeholder="url" v-model="url"
          onclick="this.select(); navigator.clipboard.writeText(this.value);" readonly />
      </div>
      <div id="index">
        <br />
        <span id="git">Original by: <a id="justririll" href="http://github.com/justririll">justririll</a> • forked by <a id="itsalviiin" href="http://twitch.tv/itsalviiin">itsalviiin</a></span>
        <br />
        <span id="disclaimer" style="margin-inline: auto; max-width: fit-content;">Not affiliated with Twitch</span>
      </div>
    </div>
  </div>
</template>

<script>
import Common from '@/utils/common'
export default {
  name: 'MainView',
  data: () => {
    return {
      /** Default Values when loading page */
      channel: '',

      font: 'Roboto',
      show_custom_font_option: 'false',
      custom_font: '',
      font_size: '36',
      font_weight: '800',
      emote_size: '0',
      shadow: 'true',

      show_bg_options: 'false',
      background: 'transparent',
      num_backgrounds: 0,
      border: 'false',

      fade: '0',
      animate: 'false',
      display_interval: '0.2',
      readable_colors: 'true',
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
          emote_size = '',
          shadow = '',
          bg = '',
          nb = '',
          border = '',
          fade = '',
          animate = '',
          display_interval = '',
          readable_colors = '',
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

      if(this.custom_font != '') {
        font = this.custom_font
      }

      font_size = this.font_size != '36' ? `&font_size=${this.font_size}` : ``
      font_weight = this.font_weight != '800' ? `&font_weight=${this.font_weight}` : ``
      emote_size = this.emote_size != '0' ? `&emote_size=${this.emote_size}` : ``
      shadow = this.shadow != 'true' ? `&shadow=${this.shadow}` : ``
      bg = this.background != 'transparent' ? `&background=${this.background}` : ``
      nb = this.num_backgrounds != 0 ? `&sb=${this.num_backgrounds}` : ``
      border = this.border != 'false' ? `&border=2` : ``
      fade = this.fade != '0' ? `&fade_after=${this.fade}` : ``
      animate = this.animate != 'false' ? `&animate=${this.animate}` : ``
      display_interval = parseFloat(this.display_interval) * 1000 != 200 ? `&display_interval=${parseFloat(this.display_interval) * 1000}` : ``
      readable_colors = this.readable_colors != 'true' ? `&readable_colors=${this.readable_colors}` : ``
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

      return `https://itsalviiin.github.io/JstChat2/#/chat?channel=${this.channel.toLowerCase()}&font=${encodeURIComponent(font)}${font_size}${font_weight}${emote_size}${shadow}${bg}${nb}${border}${fade}${animate}${display_interval}${readable_colors}${highlight_first_time}${highlight_redeemed}${hide_personal}${hide_unlisted}${hide_private}${hide_paints}${hide_bttv_badge}${hide_ffz_badge}${hide_7tv_badge}${hide_chatterino_badge}${shared_chat_badge}${self_shared_badge}${hide_bots}${hide_commands}${ignore}${filter}`
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
    }
  },
  methods: {
    changeCustomFont() {
      if(this.font == 'Custom') {
        this.show_custom_font_option = 'true'
      } else {
        this.show_custom_font_option = 'false'
      }
    },
    changeBadges() {
      if(this.hide_special_badges) {
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
    changeStyle(event) {
      switch (event.target.value.trim()) {
        case '1':
          this.border = false
          this.background = 'transparent'
          this.num_backgrounds = '0'
          this.show_bg_options = 'false'
          break
        case '2':
          this.border = true
          this.background = '#2b2b2b'
          this.num_backgrounds = 4
          this.show_bg_options = 'true'
          break
      }
    },
    changeOwnProfile() {
      if(this.display_shared_chat_badge == 'profile') {
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
html {
  color-scheme: dark !important;
}

#main {
  overflow: auto;
  left: 0;
  top: 0;
  position: fixed;
  width: 100%;
  height: 100%;
  background: #191919;
  background-attachment: fixed;
  color: white;
  font-family: 'Roboto', sans-serif;
  text-shadow: 2px 2px 0.2rem black;
}

#title {
  margin-top: 20px;
  max-width: fit-content;
  margin-inline: auto;
  font-size: 3em;
  font-weight: 700;
}

#index {
  max-width: fit-content;
  margin-inline: auto;
  margin-bottom: 20px;
  text-align: center;
}

#params {
  width: fit-content;
  margin-inline: auto;
}

#param {
  margin-top: 1.5em;
  display: block;
}

#info {
  font-size: 2em;
  font-family: 'Roboto', sans-serif;
  margin-right: 2em;
}

#selector {
  border: none;
  background: #2e2e2e;
  color: white;
  width: 12em;
  font-size: 2em;
  margin-right: 2em;
}

#bits {
  color: #9C3EE8;
}

#example {
  display: inline-block;
  max-width: 850px;
  min-height: v-bind(MessageSize);
  text-shadow: none !important;
  filter: drop-shadow(2px 2px 0.1rem black);
  vertical-align: middle;
}

#message_example {
  padding-top: 4px;
  padding-bottom: 4px;
}

.badges {
  height: v-bind('badgeSize');
  margin-left: 4px;
  padding-right: 1px;
  vertical-align: -4px;
}

#nickname {
  margin-left: 4px;
}

#nickname[type="itsalviiin"] {
  background-size: cover;
  -webkit-text-fill-color: transparent;
  -webkit-background-clip: text;
  background-clip: text !important;
  background-color: currentcolor;
  background-image: url("https://cdn.7tv.app/paint/01J5RNC5N80001EVC269JT9JJG/layer/01JAMR3AY2E5PC81XDZ0DN720K/1x.webp");
  filter: drop-shadow(rgb(216, 85, 85) 1px 1px 4px) drop-shadow(rgb(230, 188, 188) 0px 0px 2px);
  color:#2FFFF2
}

#nickname[type="elis"] {
  background-size: cover;
  -webkit-text-fill-color: transparent;
  -webkit-background-clip: text;
  background-clip: text !important;
  background-color: currentcolor;
  background-image: url("https://cdn.7tv.app/paint/01J5RNC5N80001EVC269JT9JJG/layer/01JAMR3AY2E5PC81XDZ0DN720K/1x.webp");
  filter: drop-shadow(rgb(216, 85, 85) 1px 1px 4px) drop-shadow(rgb(230, 188, 188) 0px 0px 2px);
  color:#FFCECE
}

#nickname[type="goldenkappa"] {
  background-size: cover;
  -webkit-text-fill-color: transparent;
  -webkit-background-clip: text;
  background-clip: text !important;
  background-color: currentcolor;
  background-image: repeating-linear-gradient(135deg, rgb(254, 201, 57) 0%, rgb(254, 201, 57) 15%, rgb(255, 237, 148) 15%, rgb(255, 237, 148) 30%);
  filter: drop-shadow(rgb(255, 149, 0) 0px 0px 0.1px) drop-shadow(rgb(255, 149, 0) 0px 0px 4px);
  color:#2FFFF2
}

#nickname[type="streamelements"] {
  color: #5B99FF;
}

#nickname[type="glorp"] {
  color: #D1EF8D;
}

#nickname[type="deme"] {
  background-size: cover;
  -webkit-text-fill-color: transparent;
  -webkit-background-clip: text;
  background-clip: text !important;
  background-color: currentcolor;
  background-image: url("https://cdn.7tv.app/paint/01J5K5Y85000026B027ATG06TR/layer/01JAMR3873HAYY01X3QEPFMVVS/1x.webp");
  filter: drop-shadow(rgb(255, 149, 0) 0px 0px 0.1px) drop-shadow(rgb(255, 149, 0) 0px 0px 4px);
  color: #FF8C3F;
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

#param>#customFont {
  display: v-bind('showCustomFontOption');
  font-size: 2em;
  color: #aaaaaa;
}

#param>#backgrounds {
  display: v-bind('showBackgroundOptions');
  font-size: 1.5em;
  margin-left: 2em;
}

#param>#badgeOptions {
  display: v-bind('showBadgeOptions');
  font-size: 1.5em;
  margin-left: 2em;
}

#param>#selfSharedBadgeOption {
  display: v-bind('showSelfSharedBadgeOption');
  font-size: 1.5em;
  margin-left: 2em;
}

#ignore {
  font-size: 2em;
  width: 20em;
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
  background: #2e2e2e;
  color: white;
  width: 15em;
  font-size: 2em;
}

label {
  font-size: 2em;
}

input[type='url'] {
  width: 20em;
}

input[type='number'] {
  width: 3em;
  background-color: #2e2e2e;
}

input[type='checkbox'] {
  width: 1em;
  margin-left: 60px;
  transform: scale(2.3);
  vertical-align: baseline;
  accent-color: #2196f3;
}

#content_example .emoji {
  vertical-align: bottom;
  filter: unset;
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
  /* max-width: max-content; */
  margin-left: -180px; /* half of width to center */
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
  margin-left: -60px; /* half of width to center */
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
  top: 100%; /* At the bottom of the tooltip */
  left: 50%;
  margin-left: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: #7a7a7a transparent transparent transparent;
}

.tooltip .tooltiptextexample::after {
  content: " ";
  position: absolute;
  top: 100%; /* At the bottom of the tooltip */
  left: 50%;
  margin-left: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: #7a7a7a transparent transparent transparent;
}

ul li{
  float: left;
  width: 50%;
  margin-left: 10em;
  text-align: left;
}

ul{
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

#list {
  text-align: left;
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 40%;
}

</style>
