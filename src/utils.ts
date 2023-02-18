import path from 'path'
import os from 'os'
import fs from 'fs-extra'

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

/**
 * Format file name
 * @param name file name
 * @param length length of formatted file name
 * @param ellipsis ellipsis string
 * @returns
 */
export function formatFileName(name: string, length = 12, ellipsis = '...') {
  if (name.length <= length)
    return name.padEnd(length, ' ')

  const ext = path.extname(name)
  const extLen = ext.length

  if (length <= extLen + ellipsis.length)
    return name.slice(0, length)

  length -= extLen

  const nameWithoutExt = name.slice(0, name.length - ext.length)
  const nameLength = nameWithoutExt.length
  const l = Math.floor((length - ellipsis.length) / 2)
  const r = length - ellipsis.length - l
  return `${nameWithoutExt.slice(0, l)}${ellipsis}${nameWithoutExt.slice(nameLength - r)}${ext}`
}
