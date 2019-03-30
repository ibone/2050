const path = require('path')
const request = require('request')
const express = require('express')
const app = express()
const port = 3000

let posterId = 5
let time = 1553055813766
let auth = 'f458214bccc88278733199c188e518e6'

const url1 = 'https://t.brdian.cn/Analysis/getData/2050?posterId=$1&time=$2&auth=$3'
const url2 = 'https://pass.2050.org.cn/Analysis/getData/2050?posterId=$1&time=$2&auth=$3'

function replaceUrl (p, t, a) {
  return url1.replace('$1', p).replace('$2', t).replace('$3', a)
}
app.use(express.static(path.join(__dirname, '/dist')))

app.get('/request', (req, res) => {
  request(replaceUrl(posterId, time, auth), function (error, response, body) {
    if (!error && response.statusCode === 200) {
      res.send(body)
    }
  })
})

app.get('*', (req, res) => {
  res.sendfile(path.join(__dirname, '/dist/index.html'))
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
