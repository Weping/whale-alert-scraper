const app = require('express')()
const server = require('http').createServer(app)
const io = require('socket.io')(server)

const path = require('path')
const scraper = require('./scraper')

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/view.html'))
})

server.listen(8080)
console.log("Here is the view: http://localhost:8080")

io.sockets.on('connection', async function (socket) {
  await scraper.open()
  await scraper.runEvents(socket)
})
