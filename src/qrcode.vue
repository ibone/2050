<template>
  <div :class="$style.qrcode" :style="style">
    <img :src="href" :width="size" :height="size">
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
      default: 'L'
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
  data () {
    return {
      href: ''
    }
  },
  mounted () {
    this.update()
  },
  methods: {
    update () {
      var size = this.size
      var bgColor = this.bgColor
      var fgColor = this.fgColor
      var $qr = document.createElement('canvas')

      var qrcode = qr(this.val, { errorCorrectLevel: 1 })

      var ctx = $qr.getContext('2d')
      var cells = qrcode.modules
      var tileW = size / cells.length
      var tileH = size / cells.length
      var scale = (window.devicePixelRatio || 1) / getBackingStorePixelRatio(ctx)

      $qr.height = $qr.width = size * scale
      ctx.scale(scale, scale)

      cells.forEach(function (row, rdx) {
        row.forEach(function (cell, cdx) {
          ctx.fillStyle = cell ? fgColor : bgColor
          var w = (Math.ceil((cdx + 1) * tileW) - Math.floor(cdx * tileW))
          var h = (Math.ceil((rdx + 1) * tileH) - Math.floor(rdx * tileH))
          ctx.fillRect(Math.round(cdx * tileW), Math.round(rdx * tileH), w, h)
        })
      })

      this.href = $qr.toDataURL('image/jpeg')
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
</style>
