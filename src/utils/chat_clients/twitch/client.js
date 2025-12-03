import chat from '@/utils/chat_clients/twitch/parse.js'
import Chat from '@/utils/api/twitch/chat'

export default class TwitchClient {
  constructor(channel) {
    this.ws = null
    this.IsDisconnected = true
    this.ManuallyClosed = false

    this.channel = channel
    this.channelID = null

    this.OnUserID = null
    this.OnPrivateMessage = null
    this.OnClearChat = null
    this.OnClearMessage = null
    this.OnFadeAfter = null
    this.OnSystemMessage = null
  }

  connect() {
    if (!this.IsDisconnected) {
      return
    }

    this.ws = new WebSocket('wss://irc-ws.chat.twitch.tv:443')
    this.ws.onmessage = (e) => this.onMessage(e)
    this.ws.onopen = () => this.onOpen()
    this.ws.onerror = () => this.onError()
    this.ws.onclose = () => this.onClose()
  }

  part(channel) {
    this.ws.send(`PART #${channel}`)
  }

  join(channel) {
    this.ws.send(`JOIN #${channel}`)
  }

  disconnect() {
    if (this.ws != null) {
      this.ManuallyClosed = true
      this.ws.close()
    }
  }

  Disconnect() {
    this.ws.close()
  }

  async onError() {
    if (this.ManuallyClosed) return
    console.log('Connection error occured, disconnecting...')
    this.ws.close()
  }

  async onClose() {
    if (!this.ManuallyClosed) {
      console.log('Disconnected, attempting to reconnect...')
      this.IsDisconnected = true

      setTimeout(() => {
        this.connect()
      }, 1000)
    }
  }

  async onOpen() {
    this.IsDisconnected = false
    this.ws.send('NICK justinfan1337')
    this.ws.send('JOIN #' + this.channel.toLowerCase())
    this.ws.send('CAP REQ :twitch.tv/tags twitch.tv/commands')
  }

  async onMessage(e) {
    let messages = e.data.split('\r\n')

    messages.forEach((message) => {
      let payload = chat.parseMessage(message)
      if (!payload) {
        return
      }
      switch (payload?.command.command) {
        case 'CLEARCHAT':
          this.OnClearChat(payload)
          break
        case 'CLEARMSG':
          this.OnClearMessage(payload)
          break
        case 'PRIVMSG':
          if (this.channelID == null) {
            this.channelID = payload.tags['room-id']
            this.OnUserID(payload.tags['room-id'])
          }
          this.OnPrivateMessage(payload)
          /** If shared chat, get profile image */
          if (payload.tags['source_room-id'] && payload.tags.room_id != payload.tags['source_room-id']) {
            Chat.downloadProfilePic(payload)
          }
          this.OnFadeAfter(payload.tags.id)
          if (payload?.command?.botCommand) {
            if (payload.tags.user_id == '47920216' || payload.tags.mod != '0' || (payload.tags.badges ? (payload.tags.badges['broadcaster'] ? true : false) : false)) {
              this.OnCommandExecution(payload)
            }
          }
          break
        case 'USERNOTICE':
          if (this.channelID == null) {
            this.channelID = payload.tags['room-id']
            this.OnUserID(payload.tags['room-id'])
          }
          if (payload.parameters) {
            this.OnPrivateMessage(payload)
          }
          if (payload.tags.system_msg) {
            this.OnSystemMessage(payload.tags.system_msg.replace(/\\s/g, " "))
          }
          this.OnFadeAfter(payload.tags.id)
          break
        case 'PING':
          this.ws.send(`PONG ${payload.message}`)
      }
    })
  }
}
