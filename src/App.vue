<template>
  <div :class="$style.main">
    <div :class="$style.title">
      <div :class="$style.logo"></div>
      <div>用独一无二的二维码了解你召集来多少伙伴</div>
    </div>
    <div :class="$style.formItem">
      <div :class="$style.label">目标链接</div>
      <div :class="$style.input"><input type="text" placeholder="https://2050.org.cn" v-model="targetUrl"/></div>
      <span>* 您可以指定2050网站任意页面为目标链接，并将生成的二维码用于海报、公众号文章宣传。通过二维码底部的代号可查询扫码、购买PASS的数量。</span>
    </div>
    <!-- <div :class="$style.formItem">
      <div :class="$style.label">你的名字</div>
      <div :class="$style.input"><input type="text" v-model="posterId"/></div>
      <span>* 仅允许英文字母和数字</span>
    </div> -->
    <div :class="$style.qrcodeBtn" @click="genarateQrcode">生成一个独一无二的二维码</div>
    <div :class="$style.qrcode">
      <Qrcode v-if="url" :size="320" :val="url" :posterid="posterId" v-model="downloadSrc"></Qrcode>
      <div :class="$style.download" v-if="url" @click="download">下载二维码</div>
    </div>
    <div :class="$style.data">
      <div :class="$style.hd">
        <div :class="$style.tit">我的数据</div>
      </div>
      <div :class="$style.posterIdInput">
        <div :class="$style.label">请输入二维码底部的代号（六位字母或数字）：</div>
        <div :class="$style.input"><input type="text" v-model="posterId"/></div>
        <div :class="$style.btn" @click="getData">查询</div>
      </div>
      <div :class="$style.bd" v-if="userData">
        <div :class="$style.item">
          <div :class="$style.label">二维码代号</div>
          <div :class="$style.val">{{userData.posterId}}</div>
        </div>
        <div :class="$style.item">
          <div :class="$style.label">被扫描次数</div>
          <div :class="$style.val">{{userData.scan_PV}}</div>
        </div>
        <div :class="$style.item">
          <div :class="$style.label">被扫描人数</div>
          <div :class="$style.val">{{userData.scan_UV}}</div>
        </div>
        <div :class="$style.item">
          <div :class="$style.label">Pass 数量</div>
          <div :class="$style.val">已付费: {{userData.order.paid}}, 未付费: {{userData.order.unpaid}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Qrcode from './qrcode.vue'
import Axios from 'axios'
import MD5 from 'md5'
const url = 'http://pass.2050.org.cn/s/2050?posterId=$1&url=$2'

// function getQueryString (link, key) {
//   const reg = new RegExp('(^|&)' + key + '=([^&]*)(&|$)', 'i')
//   const queryString = link.split('?').length > 1 ? link.split('?')[1] : ''
//   const r = queryString.match(reg)
//   if (r !== null) return decodeURIComponent(r[2])
//   return ''
// }

export default {
  name: 'app',
  components: { Qrcode },
  data () {
    return {
      downloadSrc: '',
      url: null,
      posterId: '',
      targetUrl: '',
      userData: null
    }
  },
  methods: {
    genarateQrcode () {
      // const posterId = String(this.posterId).trim()
      let targetUrl = String(this.targetUrl).trim()
      // if (!/^[\da-z]+$/i.test(posterId)) {
      //   window.alert('名字仅允许由英文字母和数字组成')
      //   return
      // }
      if (targetUrl === '') {
        targetUrl = 'https://2050.org.cn'
      }
      if (!/^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/i.test(targetUrl)) {
        window.alert('链接不符合规则')
        return
      }
      this.posterId = MD5(targetUrl + (new Date().getTime())).substring(0, 6)
      this.url = url.replace('$1', this.posterId).replace('$2', encodeURIComponent(targetUrl))
    },
    download () {
      var link = document.createElement('a')
      link.href = this.downloadSrc
      link.download = `${this.posterId}.jpg`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    },
    getData () {
      this.userData = null
      if (!(typeof this.posterId === 'string' && this.posterId.length > 0)) {
        window.alert('请出入二维码上的id')
        return
      }
      Axios.get(`/request?posterid=${this.posterId}`).then(response => {
        const res = response.data
        if (res.return_code === 'SUCCESS') {
          this.userData = res.data
          this.userData.posterId = this.posterId
        }
      }, response => {
        window.alert('请求出错')
      })
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
  min-width 800px
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

.formItem
  display flex
  margin 0 auto
  align-items center
  width 600px
  margin-top 28px
  background #fff
  border 1px solid #eee
  border-radius 30px
  position relative
  span
    font-size 14px 
    color #999
    position absolute
    bottom -50px
    left 0
    width 100%
    box-sizing border-box
    padding-left 20px
    padding-right 20px
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
.qrcodeBtn
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
  margin-top 120px
  cursor pointer
  transition all .3s ease
  &:hover
    transform scale(.98)
    background #1492ff

.qrcode
  border 1px solid #eee
  height 380px
  width 360px
  padding-bottom 40px
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
  bottom 20px
  left 20px
  width 320px
  height 24px
  display flex
  justify-content center
  align-items center
  font-size 14px
  background #0189ff
  color #fff
  cursor pointer

.data
  padding 30px
  background #fff
  margin-top 50px
  border-top 1px solid #eee
  padding-bottom 100px
  .hd
    display flex
    align-items center
    height 50px
    .tit
      font-size 30px
      font-weight 700
      color #54595f
    .btn
      width 100px
      height 24px
      display flex
      justify-content center
      align-items center
      font-size 16px
      background #aaa
      color #fff
      cursor pointer
      border-radius 5px
      margin-left 10px
  .bd
    display flex
    padding-top 20px
    .item
      flex 1 1 auto
      .label
        font-size 14px
        color #666
        border-bottom 1px solid #eee
      .val
        color #555
        font-weight 700
        font-size 24px
        align-items center
        height 50px
        display flex

.posterIdInput
  display flex
  align-items center
  width 800px
  margin-top 8px
  .label
    font-size 14px
    font-weight 300
  .input
    flex 0 0 auto
    padding-left 6px
    margin-left 10px
    display flex
    align-items center
    height 24px
    border 1px solid #eee
    border-radius 3px
    input
      flex 1 1 auto
      border 0
      height 20px
      line-height 20px
      font-size 16px
      color #444
      outline none
  .btn
    width 60px
    height 26px
    display flex
    justify-content center
    align-items center
    font-size 14px
    background #0189ff
    color #fff
    cursor pointer
    border-radius 3px
    margin-left 10px
</style>
