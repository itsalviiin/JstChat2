const defaultColors = [
  '#FF0000',
  '#008000',
  '#B22222',
  '#FF7F50',
  '#9ACD32',
  '#FF4500',
  '#2E8B57',
  '#DAA520',
  '#D2691E',
  '#5F9EA0',
  '#1E90FF',
  '#FF69B4',
  '#00FF7F',
  '#4242F7',
  '#A065D7',
]

class Chat {
  constructor() {
    this.sharedChatBadge = {}
    this.colorlessUsers = {}
  }

  async downloadProfilePic(payload) {
    if (!(payload.tags["source_room-id"] in this.sharedChatBadge)) {
      await fetch(`https://api.ivr.fi/v2/twitch/user?id=${payload.tags["source_room-id"]}`)
        .then(response => response.json())
        .then(data => {
          this.sharedChatBadge[(payload.tags["source_room-id"])] = data[0].logo;
        });
    }
  }

  getProfilePic(room_id) {
    if (room_id in this.sharedChatBadge) {
      return this.sharedChatBadge[room_id]
    }
  }

  getColorlessUsers(user_id) {
    if (this.colorlessUsers[user_id]) {
      return this.colorlessUsers[user_id]
    }
    let randomColor = defaultColors[Math.floor(Math.random() * defaultColors.length)]
    this.colorlessUsers[user_id] = randomColor
    return randomColor
  }
}

export default new Chat()
