export default {
  async getChatterinoBadges() {
    try {
      const response = await fetch(`https://api.chatterino.com/badges`)
      if (response.ok) {
        const json = await response.json()

        let badges = []

        for (const b of json.badges) {
          badges.push({ name: b.tooltip, url: b.image2, users: b.users })
        }
        return badges
      }
    } catch {
      console.log(`[Chatterino API] Failed to fetch Chatterino Badges`)
    }
    return []
  }
}
