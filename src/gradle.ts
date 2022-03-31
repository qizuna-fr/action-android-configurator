import * as fs from 'fs'
import * as path from 'path'
import config from './config'

function readLines(f: string): string[] {
  return fs.readFileSync(f, 'utf8').split(/\r?\n/)
}

function replaceInFile(filename: string, key: string, value: string, valueType: string): void {
  switch (valueType) {
    case 'number':
      if (isNaN(+value)) throw new Error(`${key} must be a number`)
      break
    case 'string':
      value = `"${value}"`
      break
  }

  const lines = readLines(filename)

  for (let i = 0, l = lines.length; i < l; i++) {
    const line = lines[i]
    if (line.includes(key)) {
      lines[i] = line.replace(new RegExp(`(${key}).*`), `$1 ${value}`)
      break
    }
  }

  fs.writeFileSync(filename, lines.join('\n'))
}

export async function setVersions(): Promise<void> {
  const c = config()
  const filename = path.join(c.rootDir, c.android.projectDir, 'app', 'build.gradle')

  replaceInFile(filename, 'versionCode', c.android['build.gradle'].versionCode, 'number')
  replaceInFile(filename, 'versionName', c.android['build.gradle'].versionName, 'string')
}
