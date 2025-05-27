export default {
  async getChatterinoBadges() {
    let badges = []
    const response = await fetch(`https://api.chatterino.com/badges`)
    if (response.ok) {
      const json = await response.json()
      for (const b of json.badges) {
        badges.push({ name: b.tooltip, url: b.image2, users: b.users })
      }
      return badges
    }
    if (response.status != 404) {
      throw 'not loaded'
    }
  }
}
