import path from 'path'
import fs from 'fs-extra'
import { API_KEY } from './core/constant'
import { getImgFiles } from './core/utils'
import { TinifyCompressor } from './core'

const __dirname = path.dirname(new URL(import.meta.url).pathname)
const assetsDir = path.resolve(__dirname, '../test/assets')

const imgFiles = await getImgFiles(assetsDir)

const tinifyIns = new TinifyCompressor(API_KEY)

// 创建文件夹
fs.mkdirSync(path.resolve(__dirname, '../test/output'))

tinifyIns.compressImages(imgFiles, {
  handler: (_, imgName) => path.resolve(__dirname, `../test/output/${imgName}`),
  debug: true,
})

// imgFiles.forEach((imgFile) => {
//   tinifyIns.compressImage(imgFile, {
//     handler: (_, imgName) => path.resolve(__dirname, `../test/output/${imgName}`),
//   })
// })
