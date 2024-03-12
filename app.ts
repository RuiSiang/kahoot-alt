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

function getRandomUniqueItems(arr: any[], n: number) {
  let tempArray = arr.slice()
  let result = []
  function getRandomInt(min: number, max: number) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min) + min)
  }
  for (let i = tempArray.length - 1; i > 0; i--) {
    const j = getRandomInt(0, i + 1)
    ;[tempArray[i], tempArray[j]] = [tempArray[j], tempArray[i]]
  }

  result = tempArray.slice(0, n)
  return result
}

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
    const selectQuestions = getRandomUniqueItems(
      questions,
      parseInt(process.env.QUESTION_COUNT || '10')
    )
    for (const question of selectQuestions) {
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
    setTimeout(process.exit(0), 20000)
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
  users: { admin: 'password' || process.env.PASSWORD },
  challenge: true,
})

app.use('/host', auth)
app.use(express.static('public'))
http.listen(process.env.PORT || 9712, () => {
  console.log('listening on *:9712')
})
