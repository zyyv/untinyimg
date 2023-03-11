import { setTimeout } from 'node:timers/promises'
import path from 'node:path'
import * as p from '@clack/prompts'
import color from 'picocolors'
import { formatFileSize, isDir, isFile, isPathValid } from '../utils'
import { createUntiny } from '..'

async function commandProcess() {
  return await p.group(
    {
      input: () =>
        p.text({
          message: 'Compressed resource paths?',
          placeholder: './src/assets or ./src/assets/test/img.png',
          validate: (value) => {
            if (!value)
              return 'Please enter a path.'
            if (!isPathValid(value))
              return 'Please enter a relative path.'
          },
        }),
      output: () =>
        p.text({
          message: 'Where would you like to output?',
          placeholder: 'default current',
          validate: (value) => {
            if (value && !isPathValid(value))
              return 'Please enter a relative path.'
          },
        }),
      debug: () =>
        p.confirm({
          message: 'Would you like to open debug mode?',
          initialValue: false,
        })
      ,
    },
    {
      onCancel: () => {
        p.cancel('Operation cancelled.')
        process.exit(1)
      },
    },
  )
}

export async function promptUI(cwd = process.cwd()) {
  // eslint-disable-next-line no-console
  console.clear()
  await setTimeout(1000)

  p.intro(color.bold('Welcome to use untiny-cli!'))

  const project = await commandProcess()
  if (project.input.startsWith('.'))
    project.input = path.resolve(cwd, project.input)
  if (!project.output)
    project.output = project.input
  else if (project.output.startsWith('.'))
    project.output = path.resolve(cwd, project.output)

  const tinifyIns = await createUntiny()

  const s = p.spinner()
  if (await isDir(project.input)) {
    s.start('Compressing')
    await tinifyIns.compressDir(project.input, {
      handler: _ => _.replace(project.input, project.output),
      debug: project.debug,
    })
    s.stop('Compressed!')
  }
  else if (await isFile(project.input)) {
    s.start('Compressing')
    await tinifyIns.compressImage(project.input, {
      handler: _ => _.replace(project.input, project.output),
      debug: project.debug,
    })
    s.stop('Compressed!')
  }
  else {
    p.cancel('Please enter a valid path.')
    process.exit(1)
  }

  const tips = `
End of compression: ${color.cyan(tinifyIns.Total)} images.
Before: ${color.red(formatFileSize(tinifyIns.TotalBeforeSize))}
After : ${color.green(formatFileSize(tinifyIns.TotalAfterSize))}
Diff  : ${color.yellow(formatFileSize(tinifyIns.TotalBeforeSize - tinifyIns.TotalAfterSize))}
`.trim()

  p.note(tips, 'Compression statistics:')

  p.outro(`Problems? ${color.underline(color.cyan('https://github.com/zyyv/untinyimg/issues'))}`)
}
