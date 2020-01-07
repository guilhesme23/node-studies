import express from 'express'
import path from 'path'
import fs from "fs"

const app = express()

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'))
})

app.get('/movies/:movieName', (req, res) => {
    const { movieName } = req.params; // Nome do arquivo
    const movieFile = `${__dirname}/assets/${movieName}`; // Caminho para o arquivo

    // fs.stat pega dados do arquivo de forma assíncrona
    fs.stat(movieFile, (err, stats) => {
        if (err) {
            console.log(err);
            return res.status(404).end('<h1>Movie Not found</h1>');
        }
        // Variáveis necessárias para montar o chunk header corretamente
        const { range } = req.headers; // Byte atual que o video se encontra no momento da requisição
        console.log(range)
        const { size } = stats; // Tamanho do vídeo em bytes
        // Recuperando o numero do byte a partir da string => "bytes={numero}-"
        const start = Number((range || '').replace(/bytes=/, '').split('-')[0]);
        const end = size - 1; // Último byte do vídeo
        const chunkSize = size - 1; // Tamanho do arquivo para ser informado na requisição
        // Definindo headers de chunk
        res.set({
            'Content-Range': `bytes ${start}-${end}/${size}`, // Imagino que seja o tamanho total que ainda falta do vídeo
            'Accept-Ranges': 'bytes',
            'Content-Length': chunkSize,
            'Content-Type': 'video/mp4'
        });
        // É importante usar status 206 - Partial Content para o streaming funcionar
        res.status(206);
        // Utilizando ReadStream do Node.js
        // Ele vai ler um arquivo e enviá-lo em partes via stream.pipe()
        const stream = fs.createReadStream(movieFile, { start, end }); // Lê a parte necessária do arquivo (Bytes start -> end)
        stream.on('open', () => stream.pipe(res)); // Escreve os dados na response quando o arquivo for aberto
        stream.on('error', (streamErr) => res.end(streamErr)); // Retorna qualquer erro que tenha ocorrido
    });
});

app.listen(3000, () => {
    console.log('Listening on port 3000')
})