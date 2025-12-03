import twemoji from './tweemoji'
import Common from '@/utils/common'

var EmotesBaseUrl = {
  '7TV': 'https://cdn.7tv.app/emote/{0}/2x.webp',
  BTTV: 'https://cdn.betterttv.net/emote/{0}/2x',
  FFZ: 'https://cdn.frankerfacez.com/emote/{0}/2',
  FFZanimated: 'https://cdn.frankerfacez.com/emote/{0}/animated/2',
  Twitch: `https://static-cdn.jtvnw.net/emoticons/v2/{0}/default/light/2.0`,
}

// TODO: Get emote sizes of twitch emotes that are not 56x56
// const twitchEmoteSizes = {
//   "<3": {
//     "height": 48,
//     "width": 36
//   },
// }

function getNewWidth(height, width, scale) {
  return Math.round((width / height) * (height + scale) * 10) / 10
}

function getEmoteData(name, emotes) {
  if (!name) {
    return undefined
  }
  if (emotes.twitch[name.replace('&lt;', '<')]) {
    return emotes.twitch[name.replace('&lt;', '<')]
  }
  if (emotes.personal) {
    for (const em of emotes.personal) {
      if (em.Name == name) {
        return em
      }
    }
  }
  if (emotes.ext && emotes.ext[name]) {
    return emotes.ext[name]
  }
  if (Common.checkEmoji(name)) {
    return {
      width: 54,
      height: 54,
    }
  }
  return undefined
}

function addSpaceBetweenEmoji(html) {
  /** Add spaces between emojis so that it looks
   * cleaner, consistent, and works with zero width emotes */
  const segmenter = new Intl.Segmenter('en', { granularity: 'grapheme' });
  const graphemes = Array.from(segmenter.segment(html), s => s.segment);

  return graphemes
    .map(g => /\p{Extended_Pictographic}/u.test(g) || /[\uD83C][\uDDE6-\uDDFF][\uD83C][\uDDE6-\uDDFF]/.test(g) ? ` ${g} ` : g)
    .join('')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

export default {
  /** Parse 7tv, bttv, and ffz emotes */
  ParseEmotes(html, data) {
    html = addSpaceBetweenEmoji(html)
    let res = ' ' + html + ' '
    let words = html.split(' ')

    const emotes = data.emotes
    const settings = data.settings
    const scale = data.scale
    let allEmotes = [...new Set([
      ...Object.keys(emotes.twitch).map(emote => emote.replace('<', '&lt;')),
      ...Object.keys(emotes.ext),
      ...(emotes.personal !== undefined ? emotes.personal.map(obj => obj.Name) : [])])]

    let i = 0
    while (i < words.length) {
      /** If current word is an emote,
       * otherwise skip to next word
       */
      if (allEmotes.includes(words[i]) || Common.checkEmoji(words[i])) {
        /** Check if next word is a zero width emote,
         * otherwise make it it's own emote container
         */
        if (i < words.length - 1 && getEmoteData(words[i + 1], emotes)?.zeroWidth) {
          let emoteData = getEmoteData(words[i], emotes)
          if ((emoteData?.unlisted && settings.unlisted) || (emoteData?.private && settings.private)) {
            i++
            continue
          }
          let maxWidth = emoteData.width
          /** Used to store the emotes that will be combined */
          let emoteNames = [words[i]]
          let tempI = i

          /** Go through to find the widest emote length
           * and stop when a word is not an emote or not
           * zero width
           */
          while (tempI < words.length) {
            let emoteData = getEmoteData(words[tempI + 1], emotes)
            if ((emoteData?.unlisted && settings.unlisted) || (emoteData?.private && settings.private)) {
              i++
              continue
            }
            if (emoteData?.zeroWidth) {
              emoteNames.push(words[tempI + 1])
              if (maxWidth < emoteData.width) {
                maxWidth = emoteData.width
              }
            } else {
              break
            }
            tempI++
          }

          let emotesHTML = `<span class="zero-width-emote-container" style="justify-content: center;">`
          let maxFound = false
          /** Setup emotes with zero width */
          for (const emote of emoteNames) {
            let emoteData = getEmoteData(emote, emotes)
            if ((emoteData?.unlisted && settings.unlisted) || (emoteData?.private && settings.private)) {
              i++
              continue
            }
            if (emoteData.width == maxWidth) {
              /** If the emote width matches the max */
              if (!maxFound) {
                /** If one has not been found yet, make
                 * it the base (zerowidth = false)
                 */
                emotesHTML += ` <img class="emote" src="${EmotesBaseUrl[emoteData.type + (emoteData.animated ? 'animated' : '')].replace('{0}', emoteData.id)}"${scale != 0 ? ` style="max-width: ${getNewWidth(64, 192, scale)}px; width: ${getNewWidth(emoteData.height, emoteData.width, scale)}px; height: ${emoteData.height + scale}px;"` : ``} zeroWidth="false">`
                maxFound = true
              } else {
                /** If one has been found */
                emotesHTML += ` <img class="emote" src="${EmotesBaseUrl[emoteData.type + (emoteData.animated ? 'animated' : '')].replace('{0}', emoteData.id)}" ${scale != 0 ? ` max-width: ${getNewWidth(64, 192, scale)}px; width: ${getNewWidth(emoteData.height, emoteData.width, scale)}px; height: ${emoteData.height + scale}px;` : ``}" zeroWidth="true">`
              }
            } else if (emoteData.width < maxWidth) {
              /** If the emote width is less than the max width,
               * then apply zerowidth and z-index */
              if (!maxFound) {
                /** If one has not been found yet, make the
                 * emote zero width and apply z-index to -1
                 */
                if (Common.checkEmoji(words[i])) {
                  let emojiHTML = twemoji.parse(words[i], {
                    base: 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@16.0.1/assets/',
                  })
                  emotesHTML += emojiHTML.replace(`class="emoji"`, `class="emoji" style="z-index: -1;" zeroWidth="true"`)
                } else {
                  emotesHTML += ` <img class="emote" src="${EmotesBaseUrl[emoteData.type + (emoteData.animated ? 'animated' : '')].replace('{0}', emoteData.id)}" style="z-index: -1;${scale != 0 ? ` max-width: ${getNewWidth(64, 192, scale)}px; width: ${getNewWidth(emoteData.height, emoteData.width, scale)}px; height: ${emoteData.height + scale}px;` : ``}" zeroWidth="true">`
                }
              } else {
                /** If one has been found, make the emote zero width */
                emotesHTML += ` <img class="emote" src="${EmotesBaseUrl[emoteData.type + (emoteData.animated ? 'animated' : '')].replace('{0}', emoteData.id)}" style="${scale != 0 ? ` max-width: ${getNewWidth(64, 192, scale)}px; width: ${getNewWidth(emoteData.height, emoteData.width, scale)}px; height: ${emoteData.height + scale}px;` : ``}" zeroWidth="true">`
              }
            }
          }
          i = tempI
          emotesHTML += ` </span>`

          res = res.replace(
            ` ${emoteNames.join(" ")} `,
            ` ${emotesHTML.replace(/\$/g, "$$$$")} `,
          )
        } else {
          /** One emote */
          let name = words[i]
          let emoteData = getEmoteData(name, emotes)
          if ((emoteData?.unlisted && settings.unlisted) || (emoteData?.private && settings.private)) {
            i++
            continue
          }
          let emotesHTML
          if (Common.checkEmoji(name)) {
            emotesHTML = twemoji.parse(name, {
              base: 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@16.0.1/assets/',
            })
            res = res.replace(
              ` ${name} `,
              ` ${emotesHTML.replace(/\$/g, "$$$$")} `,
            )
          } else {
            emotesHTML = `<img class="emote" src="${EmotesBaseUrl[emoteData.type + (emoteData.animated ? 'animated' : '')].replace('{0}', emoteData.id)}"${scale != 0 ? ` style="max-width: ${getNewWidth(64, 192, scale)}px; width: ${getNewWidth(emoteData.height, emoteData.width, scale)}px; height: ${emoteData.height + scale}px;"` : ``} zeroWidth="false"> `
            res = res.replace(
              ` ${name} `,
              ` ${emotesHTML.replace(/\$/g, "$$$$")} `,
            )
          }
        }
      }
      i++
    }
    return res.replace(/\s{2,}/g, ' ').trim()
  },
  /** Parse twitch emotes */
  ParseTwitch(html, emotes) {
    let res = ' ' + html + ' '
    if (emotes) {
      for (const [em, url] of Object.entries(emotes)) {
        /* eslint-disable no-unused-vars */
        for (const a in res.split(' ')) {
          res = res.replace(` ${em.replace('<', '&lt;')} `, ` <img src="${url}"> `)
        }
      }
    }
    return res.trim()
  },
  /** Parse 7tv personal emotes */
  ParsePersonal(html, emotes) {
    let res = ' ' + html + ' '
    if (emotes !== undefined) {
      for (const em of emotes) {
        /* eslint-disable no-unused-vars */
        for (const t of html.split(' ')) {
          res = res.replace(
            ` ${em.Name} `,
            ` <img class="emote" src="${EmotesBaseUrl[em.type].replace('{0}', em.id)}" zeroWidth="${em.zeroWidth}"> `,
          )
        }
      }
    }
    return res.trim()
  },
  /** Parse bits/cheermotes */
  ParseBits(html, emotes) {
    let res = ' ' + html + ' '
    if (emotes) {
      for (const [em, data] of Object.entries(emotes)) {
        /* eslint-disable no-unused-vars */
        for (const a in res.split(' ')) {
          res = res.replace(` ${em.replace('<', '&lt;')} `, ` <img id="bits" src="${data.url}"> <span style="color: ${data.color};" id="bits">${data.value} </span> `)
        }
      }
    }
    return res.trim()
  }
}
