import { describe, expect, test } from 'vitest'
import { formatFileSize } from '../src'

// const __dirname = path.dirname(new URL(import.meta.url).pathname)
// const assetsDir = path.resolve(__dirname, './assets')

describe('Assets Imgs', () => {
  // test('getImgFiles', async () => {
  //   const imgFiles = await getImgFiles(assetsDir)

  //   expect(imgFiles).toMatchInlineSnapshot(`
  //     [
  //       "/Users/chris/projects/fork/tiny-sdk/test/assets/imgs/WechatIMG99.jpeg",
  //       "/Users/chris/projects/fork/tiny-sdk/test/assets/imgs/avatar.png",
  //       "/Users/chris/projects/fork/tiny-sdk/test/assets/imgs/test/couple.webp",
  //     ]
  //   `)

  //   const tinifyIns = new TinifyCompressor(API_KEY)

  //   imgFiles.forEach((imgFile) => {
  //     tinifyIns.compressImage(imgFile, {
  //       handler: (_, imgName) => path.resolve(__dirname, `./output/${imgName}`),
  //     })
  //   })
  // })

  test('formatFileSize', () => {
    expect(formatFileSize(1024)).toBe('1.00 KB')
    expect(formatFileSize(1024 * 1024)).toBe('1.00 MB')
    expect(formatFileSize(1024 * 1024 * 1024)).toBe('1.00 GB')
  })
})
