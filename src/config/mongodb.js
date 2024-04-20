import { MongoClient, ServerApiVersion } from 'mongodb'
import { env } from './environment'

let instagramDatabaseInstance = null

const client = new MongoClient(env.MONGODB_URI,
  {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true
    }
  }
)

export const CONNECT_DB = async () => {
  await client.connect()
  instagramDatabaseInstance = client.db(env.DATABASE_NAME)
}

export const GET_DB = () => {
  if (!instagramDatabaseInstance) throw new Error('Connect to Database first!')
  return instagramDatabaseInstance
}

export const CLOSE_DB = async () => {
  await instagramDatabaseInstance.close()
}