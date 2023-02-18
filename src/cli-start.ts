import { loadConfig } from 'unconfig'
import { sourcePackageJsonFields } from 'unconfig/presets'
import type { Config } from './types'

export async function getConfig() {
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
    defaults: {
      untiny: {
        apiKey: '',
      },
    },
    merge: true,
  })

  return config
}

export async function startCli() {
  const { untiny: { apiKey } } = await getConfig()

  // eslint-disable-next-line no-console
  console.log(apiKey)

  // const tinifyIns = new TinifyCompressor(apiKey)
}
