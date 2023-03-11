import cac from 'cac'
import type { Command } from 'cac'
import pkg from '../../package.json'
import { resolveConfig } from '../config'
import { promptUI } from './prompt'

export async function startCli(cwd = process.cwd()) {
  const cli = cac('untiny')

  const passCommonOptions = (command: Command) => {
    return command
      .option('-c, --config [file]', 'Config file')
      .option('-k, --key <key>', 'Your access key')
      .option('-o, --out <out>', 'Output file', { default: cwd })
      .option('-d, --debug', 'Open debug mode')
  }

  passCommonOptions(cli.command('ci <path>', 'compress a image'))
    .example('untiny ci ./test.png')
    .action(async (path, options) => {
      console.log(path, options)
    })

  passCommonOptions(cli.command('cis <...paths>', 'compress array of images'))
    .example('untiny cis ./test.png ./test2.png')
    .action(async (paths, options) => {
      console.log(paths, options)

      const { config } = await resolveConfig(cwd, options.config)

      // console.log(JSON.stringify(config, null, 2))
    })

  passCommonOptions(cli.command('cd <dir>', 'compress a directory'))
    .example('untiny cd ./assets/images')
    .action(async (dir, options) => {
      console.log(dir, options)
    })

  cli
    .command('ui', 'Untiny Prompt UI')
    .action(() => {
      promptUI(cwd)
    })

  cli.help()
  cli.version(pkg.version)
  cli.parse()

  // console.log(JSON.stringify(parsed, null, 2))
}
