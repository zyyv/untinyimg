import path from 'path'
import { API_KEY } from './constant'
import { TinifyCompressor } from '.'

const __dirname = path.dirname(new URL(import.meta.url).pathname)
const assetsDir = path.resolve(__dirname, '../test/assets')

const tinifyIns = new TinifyCompressor(API_KEY)

tinifyIns.compressDir(assetsDir)
