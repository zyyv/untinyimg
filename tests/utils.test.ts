import path from 'node:path'
import { describe, expect, test } from 'vitest'
import { debugLog, formatFileName, formatFileSize } from '../src/utils'

describe('Utils', () => {
  test('formatFileSize', () => {
    expect(formatFileSize(1024)).toBe('1.00 KB')
    expect(formatFileSize(1024 * 1024)).toBe('1.00 MB')
    expect(formatFileSize(1024 * 1024 * 1024)).toBe('1.00 GB')
  })

  test('formatFileName', () => {
    expect(path.dirname('/Users/chris/projects/fork/tiny-sdk/test/assets/imgs/WechatIMG99.jpeg'))
      .toBe('/Users/chris/projects/fork/tiny-sdk/test/assets/imgs')

    const name = 'abcdasdasdasdasdasdsadasefghijkdasd.png'
    expect(name.length).toMatchInlineSnapshot('39')
    expect(formatFileName(name, 9, '***')).toMatchInlineSnapshot('"a***d.png"')
    expect(formatFileName(name).length).toMatchInlineSnapshot('12')
    expect(formatFileName(name, 5)).toMatchInlineSnapshot('"abcda"')
    expect(formatFileName(name, 11)).toMatchInlineSnapshot('"ab...sd.png"')
    expect(formatFileName(name, 30)).toMatchInlineSnapshot('"abcdasdasda...sefghijkdasd.png"')
    expect(formatFileName(name, 30).length).toMatchInlineSnapshot('30')
  })

  test('debugLog', () => {
    const result = [
      {
        prevSize: 1022244,
        nextSize: 12321,
        fileName: 'WechatIMG99.jpeg',
      },
      {
        prevSize: 13123024,
        nextSize: 4122331,
        fileName: 'avatar.png',
      },
      {
        prevSize: 5024,
        nextSize: 1024,
        fileName: 'couple.webp',
      },
    ]

    expect(result.map(debugLog)).toMatchInlineSnapshot(`
      [
        "Compress suceess of WechatIMG99.jpeg, Size: 998.29 KB -> 12.03 KB , Diff: 986.25 KB",
        "Compress suceess of avatar.png      , Size: 12.52 MB  -> 3.93 MB  , Diff: 8.58 MB",
        "Compress suceess of couple.webp     , Size: 4.91 KB   -> 1.00 KB  , Diff: 3.91 KB",
      ]
    `)
  })
})
