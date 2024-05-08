import { initializeApp } from 'firebase/app'
import { getStorage } from 'firebase/storage'
import 'dotenv/config'

const firebaseConfig = {
  apiKey: process.env.APIKEY,
  authDomain: process.env.AUTHDOMAIN,
  databaseURL: process.env.DATABASEURL,
  projectId: process.env.PROJECTID,
  storageBucket: process.env.STORAGEBUCKET,
  messagingSenderId: process.env.MESSAGINGSENDERID,
  appId: process.env.APPID
}

export const app = initializeApp(firebaseConfig)
export const storage = getStorage(app)