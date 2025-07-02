<script>
import Common from '@/utils/common'

export default {
  name: 'NicknameComponent',
  props: {
    nick: String,
    color: String,
    pageConfig: Object,
    Background: String,
    Paints: Object,
    userid: String,
    action: String,
  },
  computed: {
    Color() {
      return Common.brightenColor(this.color)
    },
    HavePaints() {
      if (this.Paint != undefined && this.pageConfig.hide7TVPaints == 'false') {
        return true
      }
      return false
    },
    Paint() {
      for (const value of this.Paints) {
        if (this.pageConfig.hide7TVPaints == 'false') {
          if (value.users.includes(this.userid)) {
            return value
          }
        }
      }
      return null
    },
    bgImage() {
      if (!this.Paint) {
        return ''
      }
      let cssFunc = ''

      const args = []
      switch (this.Paint.function) {
        case 'LINEAR_GRADIENT':
          cssFunc = 'linear-gradient'
          args.push(`${this.Paint.angle}deg`)
          break
        case 'RADIAL_GRADIENT':
          cssFunc = 'radial-gradient'
          args.push(this.Paint.shape ?? 'circle')
          break
        case 'URL':
          cssFunc = 'url'
          args.push(this.Paint.image_url ?? '')
          break
      }
      let funcPrefix = ''
      if (this.Paint.function !== 'URL') {
        funcPrefix = this.Paint.repeat ? 'repeating-' : ''
      }
      for (const stop of this.Paint.stops) {
        const color = Common.DecimalToStringRGBA(stop.color)
        args.push(`${color} ${stop.at * 100}%`)
      }
      return `${funcPrefix}${cssFunc}(${args.join(', ')})`
    },
    filter() {
      try {
        return this.Paint.shadows
          .map(
            (v) =>
              `drop-shadow(${v.x_offset * 2}px ${v.y_offset * 2}px ${v.radius}px ${Common.DecimalToStringRGBA(v.color)})`,
          )
          .join(' ')
      } catch {
        return ''
      }
    },
  },
}
</script>

<template>
  <span class="nickname" :HavePaints="HavePaints"> {{ nick }}{{ action }} </span>
</template>

<style>
.nickname {
  color: v-bind('Color');
  filter: v-bind('filter');
}

.nickname[HavePaints='true'] {
  -webkit-text-fill-color: transparent;
  -webkit-background-clip: text;
  background-size: cover;
  background-clip: text !important;
  background-color: currentcolor;
  background-image: v-bind('bgImage');
  text-shadow: none !important;
}
</style>
