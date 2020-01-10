import mongoose from 'mongoose'
import config from './index'

let connString = ""

if (config.db.user && config.db.pass) {
    connString = `mongodb://${config.db.user}:${config.db.pass}@${config.db.host}:${config.db.port}/${config.db.name}`
} else {
    connString = `mongodb://${config.db.host}:${config.db.port}/${config.db.name}`
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