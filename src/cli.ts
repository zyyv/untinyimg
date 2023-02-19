import consola from 'consola'
import { startCli } from './cli-start'

startCli().catch(consola.error)
