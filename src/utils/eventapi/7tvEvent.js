import apis from '@/utils/api/twitch/7tv'

class EventAPI {
  constructor(userID, stvUserID, emoteSetID) {
    this.ws = null
    this.userID = userID
    this.stvUserID = stvUserID
    this.emoteSetID = emoteSetID

    this.onDelete = undefined
    this.onAdd = undefined
    this.onRename = undefined

    this.onBadgeCreate = undefined
    this.onBadgeDelete = undefined
    this.onPaintCreate = undefined
    this.onPaintDelete = undefined

    this.pending = {}

    this.onEmoteSetChange = undefined
    this.onPersonalEmotes = undefined

    this.IsDisconnected = true

    this.IsReconnecting = false

    this.Timeout = 10000
    this.attemps = 0
  }

  Connect() {
    if (!this.IsDisconnected) return

    this.ws = new WebSocket('wss://events.7tv.io/v3')
    this.ws.onmessage = (e) => this.onMessage(e)
    this.ws.onclose = () => this.onClose()
    this.ws.onopen = () => this.onOpen()
    this.ws.onerror = () => {
      this.ws.close()
    }
    this.IsReconnecting = false
  }

  async onOpen() {
    this.IsDisconnected = false
    console.log('[7TV Event API] Connected')
  }

  async onClose() {
    if (this.IsReconnecting) return

    this.IsReconnecting = true

    console.log('[7TV Event API] Disconnected')
    this.IsDisconnected = true

    this.attemps++
    setTimeout(() => {
      this.Connect()
    }, this.Timeout * this.attemps)
  }

  subscribeToEvent(event, cond) {
    let message = {
      op: 35,
      d: {
        type: event,
        condition: cond,
      },
    }
    this.ws.send(JSON.stringify(message))
    console.log('[7TV Event API] Subscribed to ' + event)
  }

  getTwitchConnection(connections) {
    for (const con of connections) {
      if (con.platform == 'TWITCH') {
        return con
      }
    }
    return undefined
  }

  async onMessage(e) {
    let json = JSON.parse(e.data)
    switch (json.op) {
      case (4000, 4001, 4002, 4003, 4004, 4005, 4006, 4007, 4008, 4009, 4010, 4011): {
        this.ws.close()
        this.Connect()
        break
      }
      case 1: {
        if (this.emoteSetID) {
          this.subscribeToEvent('emote_set.*', { object_id: this.emoteSetID })
        }
        if (this.stvUserID) {
          this.subscribeToEvent('user.*', { object_id: this.stvUserID })
        }
        const cond = {
          id: this.userID,
          ctx: 'channel',
          platform: 'TWITCH',
        }
        this.subscribeToEvent('cosmetic.*', cond)
        this.subscribeToEvent('entitlement.*', cond)
        break
      }
      case 0:
        switch (json.d.type) {
          case 'emote_set.update': {
            if (json.d.body.id != this.emoteSetID) return

            if (json.d.body.pulled) {
              for (const item of json.d.body.pulled) {
                this.onDelete(item)
                break
              }
            }
            if (json.d.body.pushed) {
              for (const item of json.d.body.pushed) {
                this.onAdd(item)
                break
              }
            }
            if (json.d.body.updated) {
              for (const item of json.d.body.updated) {
                this.onRename(item)
                break
              }
            }
            break
          }

          /** Personal Emotes */
          case 'emote_set.create': {
            if (json.d.body.object.name != 'Personal Emotes') break
            this.onPersonalEmotes(...(await apis.get7TVPersonalSet(json.d.body.object.id)))
            break
          }

          /** Paints & Badges */
          case 'cosmetic.create': {
            switch (json.d.body.object.kind) {
              case 'PAINT': {
                this.pending[json.d.body.object.id] = json.d.body.object
                break
              }
              case 'BADGE': {
                this.pending[json.d.body.object.id] = json.d.body.object
                break
              }
            }
            break
          }

          /** User ID, Cosmetics, and Connections */
          case 'entitlement.create': {
            let p = this.pending[json.d.body.object.ref_id]

            if (p == undefined) break

            switch (p.kind) {
              case 'PAINT': {
                p.user = this.getTwitchConnection(json.d.body.object.user.connections)
                this.onPaintCreate(p)
                break
              }
              case 'BADGE': {
                p.user = this.getTwitchConnection(json.d.body.object.user.connections)
                this.onBadgeCreate(p)
                break
              }
            }
            break
          }

          case 'entitlement.delete': {
            let p = this.pending[json.d.body.object.ref_id]

            if (p == undefined) break

            switch (p.kind) {
              case 'PAINT': {
                p.user = this.getTwitchConnection(json.d.body.object.user.connections)
                this.onPaintDelete(p)
                break
              }
              case 'BADGE': {
                p.user = this.getTwitchConnection(json.d.body.object.user.connections)
                this.onBadgeDelete(p)
                break
              }
            }
            break
          }

          case 'user.update': {
            this.ws.onclose = null
            this.ws.close()
            this.IsDisconnected = true
            this.emoteSetID = json.d.body.updated[0].value[0].value.id
            this.Connect()
            console.log(`[7TV Event API] Emote set changed to ${this.emoteSetID}`)
            this.onEmoteSetChange()
            break
          }
        }
    }
  }
}

export default EventAPI
