import tinify from 'tinify'
import fs from 'fs-extra'
import consola from 'consola'
import { separator } from './constant'
import type { CompressOption } from './types'
import { formatFileName, formatFileSize } from './utils'

export class TinifyCompressor {
  private tinifyInstance: typeof tinify

  constructor(key: string) {
    this.tinifyInstance = this.init(key)
  }

  private init(key: string) {
    tinify.key = key
    return tinify
  }

  async compressImages(imgFiles: string[], option: CompressOption = { debug: true }) {
    const logs = (await Promise.all(imgFiles.map(imgFile => this.compressImage(imgFile, { ...option, debug: false }))))
      .map(this.debugLog)

    if (option.debug)
      logs.forEach(log => consola.info(log))
  }

  /**
   * Compress image
   * @param filePath need to compress image file path
   * @param handler convert file path to return a new file path
   */
  async compressImage(filePath: string, { handler, convertType, transform, debug = true }: CompressOption = {}) {
    let source = this.tinifyInstance.fromFile(filePath)
    const fileName = filePath.split(separator).pop()!
    const newPath = handler ? handler(filePath, fileName) : filePath

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

    debug && consola.info(this.debugLog({ prevSize, nextSize, fileName }))

    return { prevSize, nextSize, fileName }
  }

  private debugLog({ prevSize, nextSize, fileName }: { prevSize: number; nextSize: number; fileName: string }) {
    return `
    Compress suceess of ${formatFileName(fileName, 16)},
    Size: ${formatFileSize(prevSize).padEnd(9)} -> ${formatFileSize(nextSize).padEnd(9)},
    Diff: ${formatFileSize(prevSize - nextSize).padEnd(9)}
    `.trim().replace(/\n\s+/g, ' ')
  }
}
