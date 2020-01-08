import mongoose from 'mongoose'

let dbUser = process.env.DB_USER || "root"
let dbPass = process.env.DB_PASS || "123456"

let dbHost = process.env.DB_HOST || "localhost"
let dbPort = process.env.DB_PORT || "27017"
let dbName = process.env.DB_NAME || "movies"

let connString = ""

if (dbUser) {
    connString = `mongodb://${dbUser}:${dbPass}@${dbHost}:${dbPort}/${dbName}`
} else {
    connString = `mongodb://${dbHost}:${dbPort}/${dbName}`
}

mongoose.connect(connString, { 
    useNewUrlParser: true,
    useUnifiedTopology: true,
    connectTimeoutMS: 10000
}, (error) => {
    if (error) {
        console.log("Error during connection")
    }
})

let db = mongoose.connection

export default db