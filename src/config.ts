import * as fs from 'fs'
import * as path from 'path'

export default function () {
  const rootDir = process.cwd()
  const filename = 'build.config.json'
  const data = fs.readFileSync(path.join(rootDir, filename), 'utf8')
  const json = JSON.parse(data)
  return {rootDir: rootDir, ...json}
}
