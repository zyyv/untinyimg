import tinify from 'tinify'
import fs from 'fs-extra'
import consola from 'consola'
import { separator } from './constant'
import type { CompressOption } from './types'
import { formatFileSize } from './utils'

export * from './utils'
export * from './constant'

export class TinifyCompressor {
  private tinifyInstance: typeof tinify

  constructor(key: string) {
    this.tinifyInstance = this.init(key)
  }

  private init(key: string) {
    tinify.key = key
    return tinify
  }

  /**
   * Compress image
   * @param filePath need to compress image file path
   * @param handler convert file path to return a new file path
   */
  async compressImage(filePath: string, { handler, convertType, transform, debug = true }: CompressOption = {}) {
    let source = this.tinifyInstance.fromFile(filePath)
    const imgName = filePath.split(separator).pop()!
    const newPath = handler ? handler(filePath, imgName) : filePath

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

    const { size: nextSize } = await fs.stat(filePath)

    debug && this.debugLogSize(prevSize, nextSize, imgName)
  }

  async debugLogSize(prev: number, next: number, fileName?: string) {
    const pS = formatFileSize(prev)
    const nS = formatFileSize(next)
    const diff = formatFileSize(prev - next)

    consola.info(`Compress ${fileName} success, size: ${pS} -> ${nS}, diff: ${diff}`)
    // const { size } = await fs.stat(path)
  }
}
