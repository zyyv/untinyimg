# untinyimg [![npm](https://img.shields.io/npm/v/untinyimg.svg)](https://npmjs.com/package/untinyimg)

A cli tools of tinypng.

## Usage
### Cli
```shell
npm i -D untinyimg
```

```shell
untiny # start cli
```

### Api

#### `createUntiny`
Create your untiny instance.

```ts
import { createUntiny } from 'untinyimg'

const untiny = createUntiny('your api key')
```

#### `compressDir`
Compress all images in the directory.

```ts
untiny.compressDir('your dir path of images')
```

#### `compressImages`
Compress all images with an array.

```ts
untiny.compressImages('your file path array of images')
```

#### `compressImage`
Compress a image.

```ts
untiny.compressImage('your file path of image')
```

### types
`compressDir`、`compressImages`、`compressImage` support options in second param.

```ts
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

export type IMG_EXT = '.png' | '.jpg' | '.jpeg' | '.webp'

export type IMG_TYPE = 'image/png' | 'image/jpeg' | 'image/webp' | 'image/jpg' | '*/*'
```

## License

[MIT](./LICENSE) License © 2023 [zyyv](https://github.com/zyyv)
