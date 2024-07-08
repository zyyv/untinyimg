import path from 'node:path'
import tinify from 'tinify'
import fs from 'fs-extra'
import consola from 'consola'
import { IMG_EXT } from './constant'
import type { CPmodel, CompressOption } from './types'
import { debugLog, isPathValid } from './utils'
import { getConfig } from './config'

class TinifyCompressor {
  private tinifyInstance: typeof tinify
  Total = 0
  TotalBeforeSize = 0
  TotalAfterSize = 0

  constructor(key: string) {
    if (!key)
      throw new Error('Cannot find your api key.')

    this.tinifyInstance = this.init(key)
  }

  private init(key: string) {
    tinify.key = key
    return tinify
  }

  /**
   * Compress images
   * @param {string[]} imgFiles Array of need to compress image file paths
   * @param {CompressOption} option compress option
   */
  async compressImages(imgFiles: string[], option: CompressOption = { debug: true }) {
    const result = (await Promise.all(imgFiles.map(imgFile => this.compressImage(imgFile, { ...option, debug: false }))))

    if (option.debug)
      result.map(debugLog).forEach(consola.info)
  }

  /**
   * Compress image
   * @param {string} filePath need to compress image file path
   * @param {CompressOption} option compress option
   */
  async compressImage(filePath: string, { handler, convertType, transform, debug = true }: CompressOption = {}): Promise<CPmodel> {
    let source = this.tinifyInstance.fromFile(filePath)
    const fileName = path.basename(filePath)
    const newPath = handler ? handler(filePath, fileName) : filePath
    const dirPath = path.dirname(newPath)

    try {
      await fs.ensureDir(dirPath)
    }
    catch (e) {
      consola.warn(`error: ${e}`)
      await fs.mkdir(dirPath)
    }

    if (convertType) {
      source = source.convert({
        type: convertType,
      })
    }
    if (transform) {
      source = source.transform({
        background: transform,
      })
    }

    const { size: prevSize } = await fs.stat(filePath)
    await source.toFile(newPath)
    const { size: nextSize } = await fs.stat(newPath)

    this.Total++
    this.TotalBeforeSize += prevSize
    this.TotalAfterSize += nextSize

    if (debug) {
      consola.info(debugLog({ prevSize, nextSize, fileName }))
    }

    return { prevSize, nextSize, fileName }
  }

  /**
   * Get image files from directory
   *
   * @param {string} dir directory path
   * @param {string[]} [extnames] extnames file extensions
   * @returns {Promise<string[]>} image files of path[]
   * @example
   * const imgFiles = await tinifyIns.getImgFiles(assetsDir)
   * console.log(imgFiles)
   * // => [ 'test/assets/1.jpg', 'test/assets/2.png', 'test/assets/3.webp' ]
   * @example
   * const imgFiles = await tinifyIns.getImgFiles(assetsDir, ['.png'])
   * console.log(imgFiles)
   * // => [ 'test/assets/2.png' ]
   */
  async getImgFiles(dir: string, extnames: string[] = IMG_EXT): Promise<string[]> {
    if (!(await isPathValid(dir)))
      throw new Error(`Path ${dir} is not valid.`)

    const files = await fs.readdir(dir, { withFileTypes: true })
    const imgFiles: string[] = []

    for (const file of files) {
      const filePath = path.join(dir, file.name)
      if (file.isDirectory())
        imgFiles.push(...await this.getImgFiles(filePath, extnames))

      else if (file.isFile() && extnames.includes(path.extname(filePath)))
        imgFiles.push(filePath)
    }

    return imgFiles
  }

  /**
   * Compress images in directory
   * @param {string} dir directory path
   * @param {CompressOption} option compress option
   */
  async compressDir(dir: string, option: CompressOption = { debug: true }) {
    const imgFiles = await this.getImgFiles(dir)
    await this.compressImages(imgFiles, option)
  }
}

export async function createUntiny(key?: string) {
  key = key ?? (await getConfig()).apiKey
  return new TinifyCompressor(key)
}
