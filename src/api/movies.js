import { Router } from 'express'
import fs from 'fs'
import path from 'path'
import multer from 'multer'
import alphanumeric from 'alphanumeric-id'
import Movie from '../models/movie'
import MovieService from '../services/movieService'
import mime from 'mime-types'

const movies = Router() // /movies

// Get specified video file => video/mp4
movies.get('/:movieId', async (req, res) => {
    const { movieId } = req.params; // Nome do arquivo
    let movie = await Movie.findOne({ movieId }).exec()

    if (!movie) {
        return res.status(404).end('<h1>Movie Not found</h1>');
    }
    let movieFile = `${movie.fileDir}/${movieId}${movie.ext}` 
    // Variáveis necessárias para montar o chunk header corretamente
    const { range } = req.headers; // Byte atual que o video se encontra no momento da requisição
    console.log(range)
    const size = movie.sizeBytes; // Tamanho do vídeo em bytes
    // Recuperando o numero do byte a partir da string => "bytes={numero}-"
    const start = Number((range || '').replace(/bytes=/, '').split('-')[0]);
    const end = size - 1; // Último byte do vídeo
    const chunkSize = size - 1; // Tamanho do arquivo para ser informado na requisição
    // Definindo headers de chunk
    res.set({
        'Content-Range': `bytes ${start}-${end}/${size}`, // Imagino que seja o tamanho total que ainda falta do vídeo
        'Accept-Ranges': 'bytes',
        'Content-Length': chunkSize,
        'Content-Type': mime.contentType(movie.ext)
    });
    // É importante usar status 206 - Partial Content para o streaming funcionar
    res.status(206);
    // Utilizando ReadStream do Node.js
    // Ele vai ler um arquivo e enviá-lo em partes via stream.pipe()
    console.log(movieFile)
    console.log(start)
    console.log(end)
    const stream = fs.createReadStream(movieFile, { start, end }); // Lê a parte necessária do arquivo (Bytes start -> end)
    stream.on('open', () => stream.pipe(res)); // Escreve os dados na response quando o arquivo for aberto
    stream.on('error', (streamErr) => res.end(streamErr)); // Retorna qualquer erro que tenha ocorrido
})

// Post new video using formdata
let uploadPath = path.resolve(__dirname, '..', '..', 'uploads')
let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadPath)
    },
    filename: function (req, file, cb) {
        const fileExtension = file.mimetype.split('/').pop()
        const filename = path.format({
            name: alphanumeric(8),
            ext: `.${fileExtension}`
        })
        cb(null, filename)
    }
})

const upload = multer({ dest: uploadPath, storage }).single('file')

movies.post('/upload', async (req, res) => {
    upload(req, res, async (err) => {
        // Check for upload errors
        if (err) {
            res.status(400)
            res.json({
                message: err
            })
            return
        }
        if (!req.file) {
            res.status(400)
            res.json({
                message: 'No file detected'
            })
            return
        }

        let createdMovie = await MovieService.saveMovieMeta({
            file: req.file,
            fields: req.body
        })
        // Check for database validation errors
        if (createdMovie.errors) {
            res.status(400)
        } else {
            res.status(201)
        }
        res.json(createdMovie)
    })
})

movies.get('/', async (req, res) => {
    let allMovies = await Movie.find().select({
        movieId: 1,
        ext: 1,
        title: 1,
        author: 1
    }).exec() 
    res.json(allMovies)
})

export default movies