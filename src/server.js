/* eslint-disable no-console */
import express from 'express'
import { CONNECT_DB, GET_DB, CLOSE_DB } from './config/mongodb'
import existHook from 'async-exit-hook'
import { env } from './config/environment'

const START_SEVER = () => {
  const hostname = 'localhost'
  const port = 8017
  const app = express()

  app.get('/', async (req, res) => {
    console.log(await GET_DB().listCollections().toArray())
    res.end('<h1>Hello World!</h1><hr>')
  })

  app.listen(port, hostname, () => {
    console.log(`3.Backend server is running at http://${ hostname }:${ port }/`)
  })

  existHook(() => {
    console.log('4.Disconnecting from MongoDb Clound Atlas...')
    CLOSE_DB()
    console.log('5.Disconnected from MongoDb Clound Atlas')
  })
}

(async () => {
  try {
    console.log('1.Connecting to MongoDB Clound Atlas...')
    await CONNECT_DB()
    console.log('2. Connected to MongoDb Atlas!')

    START_SEVER()
  } catch (error) {
    console.error(error)
    process.exit(0)
  }
})()

// console.log('1.Connecting to MongoDB Clound Atlas...')
// CONNECT_DB()
//   .then(() => console.log('2. Connected to MongoDb Atlas!'))
//   .then(() => START_SEVER())
//   .catch(error => {
//     console.error(error)
//     process.exit(0)
//   })
