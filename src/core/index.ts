import tinify from 'tinify'

export * from './utils'
export * from './constant'

export class TinifyCompressor {
  private tinifyInstance: typeof tinify

  constructor(key: string) {
    this.tinifyInstance = this.init(key)
  }

  /**
   * Compress image
   * @param filePath need to compress image file path
   * @param handler convert file path to return a new file path
   */
  compressImage(filePath: string, handler?: (path: string, originImgName: string) => string) {
    const source = this.tinifyInstance.fromFile(filePath)
    const imgName = filePath.split('/').pop()!
    source.toFile(handler ? handler(filePath, imgName) : filePath)
  }

  private init(key: string) {
    tinify.key = key
    return tinify
  }
}
