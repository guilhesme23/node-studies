import express from 'express'
import path from 'path'
import movies from './api/movies'
import db from './config/db'

const app = express()

app.use(express.static(path.resolve(__dirname, '..', 'public')))

app.use('/movies', movies)

db.on('error', (err) => {
    console.log('Database not connected')
    console.log('Closing server...')
})

db.on('open', (client) => {
    console.log('Database connected')
    app.listen(3000, () => {
        console.log('Listening on port 3000')
    })
})