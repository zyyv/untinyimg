import path from 'node:path'
import { describe, expect, test } from 'vitest'
import { getConfig, resolveConfig } from '../src/config'

describe('Unconfigured', () => {
  test('unconfigured', async () => {
    const cwd = path.resolve(__dirname, './fixtures/configs')
    const config = await getConfig(cwd)

    expect(config).toMatchInlineSnapshot(`
      {
        "apiKey": "qweqweqwe",
      }
    `)
  })

  test('resolveConfig', async () => {
    const cwd = path.resolve(__dirname, './fixtures/configs')
    const { config } = await resolveConfig(cwd)

    expect(config).toMatchInlineSnapshot(`
      {
        "apiKey": "qweqweqwe",
      }
    `)
  })
})
