const path = require('path')
const request = require('request')
const express = require('express')
const md5 = require('md5')
const app = express()
const port = 3000

let key = process.argv[2] || ''
console.log(key)

const url1 = 'https://t.brdian.cn/Analysis/getData/2050?posterId=$1&time=$2&auth=$3'
const url2 = 'https://pass.2050.org.cn/Analysis/getData/2050?posterId=$1&time=$2&auth=$3'

function replaceUrl (posterId) {
  const time = (new Date()).getTime()

  const url = url1.replace('$1', posterId).replace('$2', time).replace('$3', md5(`${posterId}${time}${key}`))
  console.log(url)
  return url
}

app.use(express.static(path.join(__dirname, '/dist')))

app.get('/request', (req, res) => {
  const posterId = req.query.posterid
  console.log(posterId)
  request(replaceUrl(posterId), function (error, response, body) {
    console.log(error, response, body)
    if (!error && response.statusCode === 200) {
      console.log(body)
      res.send(body)
    }
  })
})

app.get('*', (req, res) => {
  res.sendfile(path.join(__dirname, '/dist/index.html'))
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
