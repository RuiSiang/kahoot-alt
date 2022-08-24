import events from 'events'
import express from 'express'
import { createServer } from 'http'
import type { Server, Socket } from 'socket.io'
import fs from 'fs'
import basicAuth from 'express-basic-auth'

const app = express()
const http = createServer(app)
const io: Server = require('socket.io')(http)
const timeUpEvent = new events.EventEmitter()

const questions = JSON.parse(fs.readFileSync('problems.json', 'utf-8'))

/**
 * SOCKETID: ["<PLAYERNAME>", POINTS]
 * Example --
 * dfwaogruhdslfsdljf: ["Khushraj", 0]
 */
let userPointsMap: Record<string, [string, number]> = {}

io.on('connection', (socket: Socket) => {
  let attempt = ''
  let timestamp = 0

  console.log('A user connected')
  socket.emit('connected')
  socket.once('name', (name) => {
    userPointsMap[socket.id] = [name, 0]
    io.emit('name', name)
  })

  socket.once('start', async () => {
    for (const question of questions) {
      await new Promise<void>(async (resolve) => {
        const toSend: {
          text: string
          time: number
          answers: string[]
          correctAnswer?: string
        } = { ...question }
        setTimeout(() => {
          timeUpEvent.emit('timeUp', question.correctAnswer)
          const sortedValues = Object.values(userPointsMap).sort(
            ([, a], [, b]) => b - a
          )
          const top5 = sortedValues.slice(0, 5)

          io.emit('timeUp', top5)

          socket.once('next', () => {
            resolve()
          })
        }, question.time * 1000)

        delete toSend.correctAnswer
        io.emit('question', toSend)
      })
    }
    const sortedValues = Object.values(userPointsMap).sort(
      ([, a], [, b]) => b - a
    )
    io.emit('gameover', sortedValues)
    process.exit(0)
  })

  socket.on('answer', (answer) => {
    attempt = answer
    timestamp = Date.now()
  })

  timeUpEvent.on('timeUp', (correctAnswer) => {
    if (attempt) {
      if (attempt === correctAnswer) {
        if (userPointsMap[socket.id]) {
          userPointsMap[socket.id][1] += Math.floor(
            ((Date.now() - timestamp) / 100) ** 2
          )
        }
        socket.emit('correct')
      } else {
        socket.emit('incorrect')
      }
      attempt = ''
    } else {
      socket.emit('noAnswer')
    }
  })
})

const auth = basicAuth({
  users: { admin: 'password' },
  challenge: true,
})

app.use('/host', auth)
app.use(express.static('public'))
http.listen(9712 || process.env.PORT, () => {
  console.log('listening on *:9712')
})
