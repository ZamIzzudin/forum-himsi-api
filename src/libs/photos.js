import fs from 'fs';
import path from 'path'
import { fileURLToPath } from 'url'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

function removeImage(pathPhoto) {
    const fullPathImage = path.join(__dirname, '../../', pathPhoto)
    fs.unlink(fullPathImage, (err) => {
        if (err) console.log(err)
    })
}

export default removeImage

