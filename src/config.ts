import { loadConfig } from 'unconfig'
import { sourcePackageJsonFields } from 'unconfig/presets'
import type { Config } from './types'

export async function getConfig(cwd = process.cwd()) {
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
    defaults: {
      apiKey: '',
    },
    merge: true,
  })

  return config
}
