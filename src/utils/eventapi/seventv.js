import apis from '@/utils/api/twitch/7tv'

class EventAPI {
  constructor(set_id, user_id) {
    this.ws = null
    this.set_id = set_id // current channel emote set id
    this.user_id = user_id // channel id

    this.onDelete = undefined
    this.onAdd = undefined
    this.onRename = undefined

    this.onBadgeCreate = undefined
    this.onBadgeDelete = undefined
    this.onPaintCreate = undefined
    this.onPaintDelete = undefined

    this.pending = {}

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
    console.log('7TV Event API: Connected')
  }

  async onClose() {
    if (this.IsReconnecting) return

    this.IsReconnecting = true

    console.log('7TV Event API: Disconnected')
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
        if (this.set_id) {
          this.subscribeToEvent('emote_set.*', { object_id: this.set_id })
        }
        const cond = {
          id: this.user_id,
          ctx: 'channel',
          platform: 'TWITCH',
        }
        this.subscribeToEvent('emote_set.*', cond)
        this.subscribeToEvent('cosmetic.*', cond)
        this.subscribeToEvent('entitlement.*', cond)
        break
      }
      case 0:
        switch (json.d.type) {
          case 'emote_set.update': {
            if (json.d.body.id != this.set_id) return

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
            let set_id = json.d.body.object.id

            this.onPersonalEmotes(...(await apis.get7tvEmoteSet(set_id)))

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
        }
    }
  }
}

export default EventAPI
