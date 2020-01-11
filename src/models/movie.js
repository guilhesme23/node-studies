import mongoose from 'mongoose'

let movieSchema = new mongoose.Schema({
    movieId: { type: String, required: true, unique: true }, // String com o id/nome do arquivo
    sizeBytes: { type: String, required: true }, // Tamanho em bytes do arquivo de video
    author: String, // Autor do video / quem fez upload
    title: String, // Titulo do video
    description: String, // Descrição do vídeo
    viewCount: { type: Number, default: 0 },
    ext: { type: String, required: true }, // File extension ('.mp4', '.flv', '.mpeg' ... etc)
    fileDir: { type: String, required: true } // Directory where video is saved 
}, { collection: "movies_metha" })

export default mongoose.model('Movie', movieSchema) // Compila a model e exporta ela