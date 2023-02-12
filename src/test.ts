import path from 'path'
import { API_KEY, TinifyCompressor, getImgFiles } from './core'

const __dirname = path.dirname(new URL(import.meta.url).pathname)
const assetsDir = path.resolve(__dirname, '../test/assets')

const imgFiles = await getImgFiles(assetsDir)

const tinifyIns = new TinifyCompressor(API_KEY)

imgFiles.forEach((imgFile) => {
  tinifyIns.compressImage(imgFile, {
    handler: (_, imgName) => path.resolve(__dirname, `../test/output/${imgName}`),
  })
})
