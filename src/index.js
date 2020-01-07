import express from 'express'
import path from 'path'
import movies from './api/movies'

const app = express()

app.use(express.static(path.resolve(__dirname, '..', 'public')))

app.use('/movies', movies)

app.listen(3000, () => {
    console.log('Listening on port 3000')
})