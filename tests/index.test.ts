import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { getConfig, resolveConfig } from '../src/config'

describe('unconfigured', () => {
  it('unconfigured', async () => {
    const cwd = path.resolve(__dirname, './fixtures/configs')
    const config = await getConfig(cwd)

    expect(config).toMatchInlineSnapshot(`
      {
        "apiKey": "qweqweqwe",
      }
    `)
  })

  it('resolveConfig', async () => {
    const cwd = path.resolve(__dirname, './fixtures/configs')
    const { config } = await resolveConfig(cwd)

    expect(config).toMatchInlineSnapshot(`
      {
        "apiKey": "qweqweqwe",
      }
    `)
  })
})
