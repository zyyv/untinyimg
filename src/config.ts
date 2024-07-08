import { dirname, resolve } from 'node:path'
import process from 'node:process'
import fs from 'node:fs'
import { createConfigLoader, loadConfig } from 'unconfig'
import { sourcePackageJsonFields } from 'unconfig/presets'
import type { Config } from './types'

const _sources = [
  {
    files: 'untiny.config',
    extensions: ['ts', 'mts', 'cts', 'js', 'mjs', 'cjs', 'json', ''],
  },
  sourcePackageJsonFields({
    fields: 'untiny',
  }),
]

const _defaults = {
  apiKey: '',
}

export async function getConfig(cwd = process.cwd()) {
  const { config } = await loadConfig<Config>({
    sources: _sources,
    cwd,
    defaults: _defaults,
    merge: true,
  })

  return config
}

export async function resolveConfig<U extends Config>(
  cwd = process.cwd(),
  configOrPath: string | U = cwd,
  defaults: Config = _defaults,
) {
  let inlineConfig = {} as U
  if (typeof configOrPath !== 'string') {
    inlineConfig = configOrPath
    if (inlineConfig.configFile != null && inlineConfig.configFile === false) {
      return {
        config: inlineConfig as U,
        sources: [],
      }
    }
    else {
      configOrPath = inlineConfig.configFile || process.cwd()
    }
  }

  const resolved = resolve(configOrPath)

  let isFile = false
  if (fs.existsSync(resolved) && fs.statSync(resolved).isFile()) {
    isFile = true
    cwd = dirname(resolved)
  }

  const loader = createConfigLoader<Config>({
    sources: isFile
      ? [
          {
            files: resolved,
            extensions: [],
          },
        ]
      : _sources,
    cwd,
    defaults: _defaults,
    merge: true,
  })

  const result = await loader.load()
  result.config = Object.assign(defaults, result.config || inlineConfig)

  return result
}
