export type IMG_EXT = '.png' | '.jpg' | '.jpeg' | '.webp'
export type IMG_TYPE = 'image/png' | 'image/jpeg' | 'image/webp' | 'image/jpg' | '*/*'

export interface CompressOption {
  /**
   * convert file path to return a new file path
   * @param originPath origin file path
   * @param originImgName origin file name
   * @returns new file path
   */
  handler?: (originPath: string, originImgName: string) => string

  /**
   * Your desired image types. The following options are available as a type:
   */
  convertType?: IMG_TYPE | IMG_TYPE[]

  /**
   * The transform object specifies the stylistic transformations that will be applied to your image
   */
  transform?: string

  /**
   * Whether to print debug information
   * @default true
   */
  debug?: boolean
}

export interface Config {
  /**
   * Your API key
   * @default ''
   */
  apiKey: string

  /**
   * Custom your config file path
   */
  configFile?: string | false
}

export interface CliOption {
  path?: string | string[]
  type: 'image' | 'images' | 'directory'
  config?: Config
  key?: string
  out?: string
  debug?: boolean
  cwd: string
}

export interface CPmodel {
  prevSize: number
  nextSize: number
  fileName: string
}
