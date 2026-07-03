const cheerTiers = {
  1: {
    id: "1",
    color: "#979797"
  },
  100: {
    id: "100",
    color: "#9C3EE8"
  },
  1000: {
    id: "1000",
    color: "#1DB2A5"
  },
  5000: {
    id: "5000",
    color: "#0099FE"
  },
  10000: {
    id: "10000",
    color: "#F43021"
  },
  100000: {
    id: "100000",
    color: "#F3A71A"
  },
}

var common = {
  decimalToStringRGBA(num) {
    const r = (num >>> 24) & 0xff
    const g = (num >>> 16) & 0xff
    const b = (num >>> 8) & 0xff
    const a = num & 0xff

    return `rgba(${r}, ${g}, ${b}, ${(a / 255).toFixed(3)})`
  },

  HEX2RGB(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)] : null
  },

  brightenColor(hexColor, threshold = 0.20, brightenStep = 5) {
    let color = hexColor;
    while (this.getLuminance(color) < threshold) {
      color = this.brighten(color, brightenStep);
    }
    return color;
  },

  getLuminance(hex) {
    return Math.floor(this.luminance(...this.HEX2RGB(hex)) * 100) / 100
  },

  luminance(r, g, b) {
    var RsRGB = r / 255;
    var GsRGB = g / 255;
    var BsRGB = b / 255;

    var R = (RsRGB <= 0.03928) ? RsRGB / 12.92 : Math.pow((RsRGB + 0.055) / 1.055, 2.4);
    var G = (GsRGB <= 0.03928) ? GsRGB / 12.92 : Math.pow((GsRGB + 0.055) / 1.055, 2.4);
    var B = (BsRGB <= 0.03928) ? BsRGB / 12.92 : Math.pow((BsRGB + 0.055) / 1.055, 2.4);

    // For the sRGB colorspace, the relative luminance of a color is defined as:
    var L = 0.2126 * R + 0.7152 * G + 0.0722 * B;

    return L;
  },

  brighten(color, amount) {
    // Ensure amount is within the valid range (-100 to 100)
    amount = Math.max(-100, Math.min(100, amount));

    // Function to convert hex to HSL
    function HEX2HSL(hex) {
      // Remove '#' if present and parse hex value
      hex = hex.replace(/^#/, '');
      let r = parseInt(hex.substring(0, 2), 16) / 255;
      let g = parseInt(hex.substring(2, 4), 16) / 255;
      let b = parseInt(hex.substring(4, 6), 16) / 255;

      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      let h, s, l = (max + min) / 2;

      if (max === min) {
        h = s = 0; // achromatic
      } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
          case r: h = (g - b) / d + (g < b ? 6 : 0); break;
          case g: h = (b - r) / d + 2; break;
          case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
      }
      return { h: h * 360, s: s * 100, l: l * 100 };
    }

    // Function to convert HSL to hex
    function HSL2HEX(h, s, l) {
      h /= 360;
      s /= 100;
      l /= 100;
      let r, g, b;
      if (s === 0) {
        r = g = b = l; // achromatic
      } else {
        const HUE2RGB = (p, q, t) => {
          if (t < 0) t += 1;
          if (t > 1) t -= 1;
          if (t < 1 / 6) return p + (q - p) * 6 * t;
          if (t < 1 / 2) return q;
          if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
          return p;
        };
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = HUE2RGB(p, q, h + 1 / 3);
        g = HUE2RGB(p, q, h);
        b = HUE2RGB(p, q, h - 1 / 3);
      }
      const toHex = x => {
        const hex = Math.round(x * 255).toString(16);
        return hex.length === 1 ? "0" + hex : hex;
      };
      return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    }

    const hsl = HEX2HSL(color);
    hsl.l = Math.max(0, Math.min(100, hsl.l + amount)); // Adjust lightness
    return HSL2HEX(hsl.h, hsl.s, hsl.l);
  },

  checkEmoji(word) {
    return /\p{Extended_Pictographic}/u.test(word) || /[\uD83C][\uDDE6-\uDDFF][\uD83C][\uDDE6-\uDDFF]/.test(word)
  },

  parseEmotes(message, emotes) {
    let result = {}
    /** Match emojis */
    message = message.replace(
      /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g,
      'a',
    )
    for (const [i, k] of Object.entries(emotes)) {
      let emote
      if (parseInt(k[0]['endPosition']) - k[0]['startPosition'] == 1) {
        emote = message.substring(k[0]['startPosition'], parseInt(k[0]['endPosition']) + 2).trim()
      } else {
        emote = message
          .substring(parseInt(k[0]['startPosition']), parseInt(k[0]['endPosition']) + 2)
          .trim()
      }
      emote = emote.split(' ')[0]
      if (!(emote in result)) {
        result[emote] = {
          id: i,
          type: 'Twitch',
          width: 56,
          height: 56
        }
      }
    }
    return result
  },

  parseBits(message, bits, prefix) {
    let result = {}

    let words = message.split(" ")
    for (const word of words) {
      if (word.match(/^\b(cheer|cheerwhal|corgo|uni|showlove|party|seemsgood|pride|kappa|frankerz|heyguys|dansgame|trihard|kreygasm|4head|swiftrage|notlikethis|failfish|vohiyo|pjsalt|mrdestructoid|bday|ripcheer|shamrock)\d+\b$/gi)) {
        const match = word.match(/([a-zA-Z]+)(\d+)/);
        let cheer = match ? [match[1], parseInt(match[2])] : [];

        /** If its more than 100000, it's not a real cheer */
        if (cheer[1] > 100000) {
          continue
        }

        let closest = 1

        for (const cheerType of Object.keys(cheerTiers)) {
          if (cheer[1] >= cheerType) {
            closest = cheerType
          }
        }

        if (!(word in result)) {
          result[word] = {
            url: `https://d3aqoihi2n8ty8.cloudfront.net/actions/${cheer[0].toLowerCase()}/dark/animated/${closest}/2.gif`,
            color: cheerTiers[closest].color,
            value: cheer[1],
          }
        }
      } else if (prefix) {
        let regex = new RegExp(String.raw`\b${prefix}cheer\d+\b`, "gi");
        if (word.match(regex)) {
          const match = word.match(/([a-zA-Z]+)(\d+)/);
          let cheer = match ? [match[1].replace(prefix, ""), parseInt(match[2])] : [];

          /** If its more than 100000, it's not a real cheer */
          if (cheer[1] > 100000) {
            continue
          }

          let closest = 1

          for (const cheerType of Object.keys(cheerTiers)) {
            if (cheer[1] >= cheerType) {
              closest = cheerType
            }
          }

          if (!(word in result)) {
            result[word] = {
              url: `https://d3aqoihi2n8ty8.cloudfront.net/actions/${cheer[0].toLowerCase()}/dark/animated/${closest}/2.gif`,
              color: cheerTiers[closest].color,
              value: cheer[1],
            }
          }
        }
      }
    }

    return result
  },
}

export default common
