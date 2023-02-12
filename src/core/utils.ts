import path from 'path'
import os from 'os'
import fs from 'fs-extra'
import { IMG_EXT } from './constant'

/**
 * Get image files from directory
 * @param dir directory path
 * @param extnames file extensions
 * @returns image files
 */
export async function getImgFiles(dir: string, extnames: string[] = IMG_EXT): Promise<string[]> {
  if (!(await isPathValid(dir)))
    throw new Error(`Path ${dir} is not valid.`)

  const files = await fs.readdir(dir, { withFileTypes: true })
  const imgFiles: string[] = []

  for (const file of files) {
    const filePath = path.join(dir, file.name)
    if (file.isDirectory())
      imgFiles.push(...await getImgFiles(filePath, extnames))

    else if (file.isFile() && extnames.includes(path.extname(filePath)))
      imgFiles.push(filePath)
  }

  return imgFiles
}

export async function isPathValid(filePath: string): Promise<boolean> {
  return await fs.pathExists(filePath)
}

export function getCpus(): number {
  return os.cpus().length
}

export function formatFileSize(size: number) {
  if (size < 1024)
    return `${size} B`
  if (size < 1024 * 1024)
    return `${(size / 1024).toFixed(2)} KB`
  if (size < 1024 * 1024 * 1024)
    return `${(size / 1024 / 1024).toFixed(2)} MB`
  return `${(size / 1024 / 1024 / 1024).toFixed(2)} GB`
}
