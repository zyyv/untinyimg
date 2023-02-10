import path from 'path'
import { describe, expect, test } from 'vitest'
import { API_KEY, TinifyCompressor, getImgFiles } from '../src'

const __dirname = path.dirname(new URL(import.meta.url).pathname)
const assetsDir = path.resolve(__dirname, './assets')

describe('Assets Imgs', () => {
  test('getImgFiles', async () => {
    const imgFiles = await getImgFiles(assetsDir)

    expect(imgFiles).toMatchInlineSnapshot(`
      [
        "/Users/chris/projects/fork/tiny-sdk/test/assets/imgs/WechatIMG99.jpeg",
        "/Users/chris/projects/fork/tiny-sdk/test/assets/imgs/avatar.png",
        "/Users/chris/projects/fork/tiny-sdk/test/assets/imgs/test/couple.webp",
      ]
    `)

    const tinifyIns = new TinifyCompressor(API_KEY)
    tinifyIns.compressImage(
      imgFiles[0],
      (_, imgName) => {
        expect(path.resolve(__dirname, `./output/${imgName}`))
          .toMatchInlineSnapshot('"/Users/chris/projects/fork/tiny-sdk/test/output/WechatIMG99.jpeg"')
        return path.resolve(__dirname, `./output/${imgName}`)
      },
    )
  })
})
