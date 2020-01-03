import express from 'express'
import http from 'http'
import createGame from './public/game.js'
import { Server } from 'tls'
import socketio from 'socket.io'

const app = express()
const server = http.createServer(app)
const sockets = socketio(server)

app.use(express.static('public'))

const game = createGame()
game.addPlayer({ playerId: 'player1', playerX: 1, playerY: 1  })
game.addCoin({ coinId: 'coin1', coinX: 5, coinY: 5  })

sockets.on('connection', (socket) => {
    const playerId = socket.id
    console.log(`Player connected on server with id: ${playerId}`)

    socket.emit('setup', game.state)
})

Server.listen(3000, () => {
    console.log('server listening on port: 3000')
})