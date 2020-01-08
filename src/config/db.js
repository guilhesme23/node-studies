import mongoose from 'mongoose'

let dbUser = process.env.DB_USER || "root"
let dbPass = process.env.DB_PASS || "123456"

let dbHost = process.env.DB_HOST || "localhost"
let dbPort = process.env.DB_PORT || "27017"

let connString = `mongodb://${dbUser}:${dbPass}@${dbHost}:${dbPort}`

mongoose.connect(connString, { 
    useNewUrlParser: true,
    useUnifiedTopology: true
})

let db = mongoose.connection

export default db