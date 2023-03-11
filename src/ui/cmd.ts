import cac from 'cac'
import pkg from '../../package.json'
import { promptUI } from './prompt'

export async function startCli(cwd = process.cwd()) {
  const cli = cac('untiny')

  cli.option('-c, --config [file]', 'Config file')
  cli.option('-k, --key', 'Your access key')
  cli.option('-d, --debug', 'Open debug mode')

  cli
    .command('ci [path]', 'compress a image')
    .option('-o, --out-file <file>', 'Output file', {
      default: cwd,
    })
    .example('deploy ./dist')

  cli
    .command('cd [path]', 'compress a directory')
    .option('-o, --out-file <file>', 'Output file', {
      default: cwd,
    })
    .example('deploy ./dist')

  cli
    .command('ui', 'Untiny Prompt UI')
    .action(() => {
      promptUI(cwd)
    })

  cli.help()
  cli.version(pkg.version)
  cli.parse()
}
