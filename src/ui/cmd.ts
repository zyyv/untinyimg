import { resolve } from 'node:path'
import cac from 'cac'
import type { Command } from 'cac'
import pkg from '../../package.json'
import type { CliOption } from '../types'
import { resolveConfig } from '../config'
import { createUntiny } from '..'
import { promptUI } from './prompt'

export async function startCli(cwd = process.cwd()) {
  const cli = cac('untiny')

  const passCommonOptions = (command: Command) => {
    return command
      .option('-c, --config [file]', 'Config file')
      .option('-k, --key <key>', 'Your access key')
      .option('-o, --out <out>', 'Output file', { default: './' })
      .option('-d, --debug', 'Open debug mode')
  }

  passCommonOptions(cli.command('ci <path>', 'compress a image'))
    .example('untiny ci ./test.png')
    .action(async (path, options) => {
      compress({
        cwd,
        path,
        type: 'image',
        ...options,
      })
    })

  passCommonOptions(cli.command('cis <...paths>', 'compress array of images'))
    .example('untiny cis ./test.png ./test2.png')
    .action(async (path, options) => {
      compress({
        cwd,
        path,
        type: 'images',
        ...options,
      })
    })

  passCommonOptions(cli.command('cd <dir>', 'compress a directory'))
    .example('untiny cd ./assets/images')
    .action(async (path, options) => {
      compress({
        cwd,
        path,
        type: 'directory',
        ...options,
      })
    })

  cli
    .command('ui', 'Untiny Prompt UI')
    .action(() => {
      promptUI(cwd)
    })

  cli.help()
  cli.version(pkg.version)
  cli.parse()
}

async function compress(options: CliOption) {
  options.key = options.key || (await resolveConfig(options.cwd, options.config)).config.apiKey
  const untinyIns = await createUntiny(options.key)

  const handler = (_originPath: string, originImgName: string) => resolve(...[
    options.out!.startsWith('/') ? '' : options.cwd,
    options.out!,
    originImgName,
  ].filter(Boolean))

  if (options.type === 'image') {
    await untinyIns.compressImage(options.path as string, {
      handler,
      debug: options.debug,
    })
  }
  else if (options.type === 'images') {
    await untinyIns.compressImages(options.path as string[], {
      handler,
      debug: options.debug,
    })
  }
  else if (options.type === 'directory') {
    await untinyIns.compressDir(options.path as string, {
      handler,
      debug: options.debug,
    })
  }
}
