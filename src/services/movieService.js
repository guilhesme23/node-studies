import mime from 'mime-types'
import Movie from '../models/movie'

export default class MovieService {

    /**
     * @staticmethod
     * Build movie metadata based on file data and 
     * additional fields passed
     * 
     * @argument data
     */
    static async saveMovieMeta(data) {
        if (!data) {
            throw new Error('Undefined data file field')
        }

        let ext = `.${mime.extension(data.file.mimetype)}`
        let movieId = data.file.filename.replace(ext, '')

        let movie = {
            movieId,
            ext,
            fileDir: data.file.path,
            sizeBytes: data.file.size,
        }

        if(data.fields) {
            movie = {
                ...movie,
                ...data.fields
            } 
        }

        let document = new Movie(movie)
        movie = await document.save()

        return movie
    }
}