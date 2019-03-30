<template>
  <div :class="$style.main">
    <div :class="$style.title">
      <div :class="$style.logo"></div>
      <div>每一张海报有独一无二的二维码</div>
    </div>
    <div :class="$style.item">
      <div :class="$style.label">目标链接</div>
      <div :class="$style.input"><input type="text" placeholder="http://example.com/path?foo=bar" v-model="targetUrl"/></div>
    </div>
    <div :class="$style.item">
      <div :class="$style.label">你的名字</div>
      <div :class="$style.input"><input type="text" v-model="posterId"/></div>
      <span>* 仅允许英文字母和数字</span>
    </div>
    <div :class="$style.btn" @click="genarateQrcode">生成一个独一无二的二维码</div>
    <div :class="$style.qrcode">
      <Qrcode v-if="url" :size="320" :val="url" v-model="downloadSrc"></Qrcode>
      <div :class="$style.download" v-if="url" @click="download">下载二维码</div>
    </div>
  </div>
</template>

<script>
import Qrcode from './qrcode.vue'
const url = 'http://pass.2050.org.cn/s/2050?posterId=$2&url=$1'

export default {
  name: 'app',
  components: { Qrcode },
  data () {
    return {
      downloadSrc: '',
      url: null,
      posterId: '12312',
      targetUrl: 'https://baidu.com'
    }
  },
  methods: {
    genarateQrcode () {
      const posterId = String(this.posterId).trim()
      const targetUrl = String(this.targetUrl).trim()
      if (!/^[\da-z]+$/i.test(posterId)) {
        window.alert('名字仅允许由英文字母和数字组成')
        return
      }
      if (!/^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/i.test(targetUrl)) {
        window.alert('链接不符合规则')
        return
      }
      this.url = url.replace('$1', posterId).replace('$2', targetUrl)
    },
    download () {
      var link = document.createElement('a')
      link.href = this.downloadSrc
      link.download = '2050qrcode.jpg'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }
}
</script>

<style lang="stylus" module>
body
  padding 0
  margin 0

.main
  font-family 'Avenir', Helvetica, Arial, sans-serif
  -webkit-font-smoothing antialiased
  line-height 1.5
  padding-bottom 100px
  background url("https://static.yunqi2050.com/2019/02/ganxiexin1-1.jpg") no-repeat center top

.title
  font-size 40px
  font-weight 700
  padding-top 60px
  padding-bottom 60px
  display flex
  justify-content center
  align-items center
  color #54595f

.logo
  background url("https://static.2050.org.cn/2019/02/2050Hangzhouyunqi.png") no-repeat left top
  background-size 218px
  width 136px
  height 44px

.item
  display flex
  margin 0 auto
  align-items center
  width 500px
  margin-top 28px
  background #fff
  border 1px solid #eee
  border-radius 30px
  position relative
  span
    font-size 14px 
    color #999
    position absolute
    bottom -30px
    left 0
    width 100%
    text-align center
  .label
    font-size 18px
    padding-left 30px
    color #666
  .input
    flex 1 1 auto
    padding-right 20px
    margin-left 20px
    display flex
    align-items center
    height 50px
    input
      flex 1 1 auto
      border 0
      height 30px
      line-height 30px
      font-size 18px
      color #444
      outline none
    ::-webkit-input-placeholder
      color #aaa
    ::-moz-placeholder
      color #aaa
    :-ms-input-placeholder
      color #aaa
.btn
  background-color #0189ff
  font-size 20px
  color #fff
  display flex
  margin 0 auto
  justify-content center
  align-items center
  width 340px
  height 70px
  border-radius 40px
  font-weight 700
  margin-top 100px
  cursor pointer
  transition all .3s ease
  &:hover
    transform scale(.98)
    background #1492ff

.qrcode
  border 1px solid #eee
  height 360px
  width 360px
  border-radius 5px
  display flex
  align-items center
  justify-content center
  margin 40px auto 0
  background #fff
  position relative
  &:after
    content '此处生成二维码'
    color #ccc
    position absolute
    width 100%
    z-index 1
    text-align center
    top 50%

.download
  position absolute
  z-index 3
  bottom 10px
  right 10px
  width 100px
  height 24px
  display flex
  justify-content center
  align-items center
  font-size 14px
  background #0189ff
  color #fff
  cursor pointer
</style>
