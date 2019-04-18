<template>
  <div :class="$style.qrcode" :style="style">
    <img v-if="href" :src="href" :width="size" :height="size + 20">
    <img width="100" height="100" :class="$style.logo" src="./2050.png" ref="logo"/>
  </div>
</template>


<script>
import qr from 'qr.js'

export default {
  name: 'QrCode',
  props: {
    val: {
      type: String,
      required: true
    },
    posterid: {
      type: String,
      required: true
    },
    size: {
      type: Number,
      default: 100
    },
    padding: {
      type: Number,
      default: 0
    },
    // 'L', 'M', 'Q', 'H'
    level: {
      type: String,
      default: 'Q'
    },
    bgColor: {
      type: String,
      default: '#FFFFFF'
    },
    fgColor: {
      type: String,
      default: '#000000'
    }
  },
  computed: {
    style () {
      return {
        background: this.bgColor,
        padding: `${this.padding}px`
      }
    }
  },
  data () {
    return {
      href: null
    }
  },
  watch: {
    size: function () {
      this.update()
    },
    val: function () {
      this.update()
    },
    level: function () {
      this.update()
    },
    bgColor: function () {
      this.update()
    },
    fgColor: function () {
      this.update()
    }
  },
  mounted () {
    setTimeout(() => {
      this.update()
    }, 100)
  },
  methods: {
    update () {
      var size = this.size
      var bgColor = this.bgColor
      var fgColor = this.fgColor
      var canvas = document.createElement('canvas')

      var qrcode = qr(this.val, { errorCorrectLevel: 1 })

      var padding = 12

      var ctx = canvas.getContext('2d')
      var cells = qrcode.modules
      var scale = 1000 / size
      var tileW = (size - padding * 2) / cells.length * scale
      var tileH = (size - padding * 2) / cells.length * scale

      canvas.width = size * scale
      canvas.height = (size + 20) * scale

      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      // ctx.scale(scale, scale)

      cells.forEach(function (row, rdx) {
        row.forEach(function (cell, cdx) {
          ctx.fillStyle = cell ? fgColor : bgColor
          var w = (Math.ceil((cdx + 1) * tileW) - Math.floor(cdx * tileW))
          var h = (Math.ceil((rdx + 1) * tileH) - Math.floor(rdx * tileH))
          ctx.fillRect(Math.round(cdx * tileW) + padding * scale, Math.round(rdx * tileH) + padding * scale, w, h)
        })
      })

      ctx.fillStyle = '#666666'
      ctx.font = `${14 * scale}px Helvetica Neue, PingFang SC, Verdana, Microsoft Yahei, Hiragino Sans GB, Microsoft Sans Serif, WenQuanYi Micro Hei, sans-serif`
      ctx.fillText(this.posterid, 138 * scale, (size + 18) * scale)

      var img = this.$refs.logo
      var imgSize = 60
      ctx.drawImage(img, (size - imgSize) / 2 * scale, (size - imgSize) / 2 * scale, imgSize * scale, imgSize * scale)

      var canvas2 = document.createElement('canvas')
      var ctx2 = canvas2.getContext('2d')
      canvas2.width = size
      canvas2.height = size + 30
      ctx2.fillStyle = '#ffffff'
      ctx2.fillRect(0, 0, size, size + 30)
      ctx2.fillStyle = '#666666'
      ctx2.font = '14px Helvetica Neue, PingFang SC, Verdana, Microsoft Yahei, Hiragino Sans GB, Microsoft Sans Serif, WenQuanYi Micro Hei, sans-serif'
      ctx2.fillText(this.posterid, 10, 50)
      this.href = canvas.toDataURL('image/png')
      this.$emit('input', this.href)
    }
  }
}

function getBackingStorePixelRatio (ctx) {
  return (
    ctx.webkitBackingStorePixelRatio ||
    ctx.mozBackingStorePixelRatio ||
    ctx.msBackingStorePixelRatio ||
    ctx.oBackingStorePixelRatio ||
    ctx.backingStorePixelRatio ||
    1
  )
}

</script>

<style lang="stylus" module>
.qrcode
  position relative
  z-index 2
  canvas
    display block

.logo
  position absolute
  visibility hidden
</style>
