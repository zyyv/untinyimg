import path from 'path'
import { describe, expect, test } from 'vitest'
import { loadConfig } from 'unconfig'
import { sourcePackageJsonFields } from 'unconfig/presets'
import { formatFileName, formatFileSize } from '../src/utils'
import type { Config } from '../src/types'

describe('Assets Imgs', () => {
  test('formatFileSize', () => {
    expect(formatFileSize(1024)).toBe('1.00 KB')
    expect(formatFileSize(1024 * 1024)).toBe('1.00 MB')
    expect(formatFileSize(1024 * 1024 * 1024)).toBe('1.00 GB')
  })

  test('formatFileName', () => {
    expect(path.dirname('/Users/chris/projects/fork/tiny-sdk/test/assets/imgs/WechatIMG99.jpeg')).toMatchInlineSnapshot('"/Users/chris/projects/fork/tiny-sdk/test/assets/imgs"')

    const name = 'abcdasdasdasdasdasdsadasefghijkdasd.png'
    expect(name.length).toMatchInlineSnapshot('39')
    expect(formatFileName(name, 9, '***')).toMatchInlineSnapshot('"a***d.png"')
    expect(formatFileName(name).length).toMatchInlineSnapshot('12')
    expect(formatFileName(name, 5)).toMatchInlineSnapshot('"abcda"')
    expect(formatFileName(name, 11)).toMatchInlineSnapshot('"ab...sd.png"')
    expect(formatFileName(name, 30)).toMatchInlineSnapshot('"abcdasdasda...sefghijkdasd.png"')
    expect(formatFileName(name, 30).length).toMatchInlineSnapshot('30')
  })

  test('padEndFormat', () => {
    const result = [
      {
        prevSize: 1022244,
        nextSize: 12321,
        name: 'WechatIMG99.jpeg',
      },
      {
        prevSize: 13123024,
        nextSize: 4122331,
        name: 'avatar.png',
      },
      {
        prevSize: 5024,
        nextSize: 1024,
        name: 'couple.webp',
      },
    ]

    const logs = result.map(({ prevSize, nextSize, name }) => {
      return `
      Compress suceess of ${formatFileName(name, 16)},
      Size: ${formatFileSize(prevSize).padEnd(9)} -> ${formatFileSize(nextSize).padEnd(9)},
      Diff: ${formatFileSize(prevSize - nextSize).padEnd(9)}
      `.trim().replace(/\n\s+/g, ' ')
    })

    expect(logs).toMatchInlineSnapshot(`
      [
        "Compress suceess of WechatIMG99.jpeg, Size: 998.29 KB -> 12.03 KB , Diff: 986.25 KB",
        "Compress suceess of avatar.png      , Size: 12.52 MB  -> 3.93 MB  , Diff: 8.58 MB",
        "Compress suceess of couple.webp     , Size: 4.91 KB   -> 1.00 KB  , Diff: 3.91 KB",
      ]
    `)
  })
})

describe('Unconfigured', () => {
  test('unconfigured', async () => {
    const cwd = path.resolve(__dirname, './fixtures/configs')
    const { config } = await loadConfig<Config>({
      sources: [
        {
          files: 'untiny.config',
          extensions: ['ts', 'mts', 'cts', 'js', 'mjs', 'cjs', 'json', ''],
        },
        sourcePackageJsonFields({
          fields: 'untiny',
        }),
      ],
      cwd,
    })

    expect(config).toMatchInlineSnapshot(`
      {
        "untiny": {
          "apiKey": "222",
        },
      }
    `)
  })
})
