import { diskStorage }  from 'multer'
import { v4 as uuid } from 'uuid'
import { join } from 'path'

export default {
    storage: diskStorage({
        destination: join(__dirname, '../', 'files'),
        filename: (_, file, cb) => {
            cb(null, `file-${uuid()}-${file.originalname}`)
        }
    }),
}