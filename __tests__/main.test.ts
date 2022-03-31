import {beforeAll, describe, expect, test} from '@jest/globals'
import * as process from 'process'
import * as cp from 'child_process'
import * as path from 'path'
import * as fs from 'fs'

import config from '../src/config'

function resetFile(filename: string): string {
  if (fs.existsSync(filename)) {
    fs.rmSync(filename)
  }
  fs.cpSync(`${filename}.sample`, filename)
  return filename
}

function grep(filename: string, search: string): string {
  const rawContent = fs.readFileSync(filename, 'utf8')
  const lines = rawContent.split(/\r?\n/)
  const regex = new RegExp(search)
  for (let i = 0, l = lines.length; i < l; i++) {
    const line = lines[i]

    if (regex.test(line)) return line
  }
  return ''
}

describe('Run the main script', () => {
  // Setup config
  const workdir = process.cwd()
  const appVersion = '9.9.9'
  const buildVersion = '9'
  const configFile = path.join(workdir, 'build.config.json')
  cp.execSync(`jq '
.android["build.gradle"].versionName = "${appVersion}" |
.android["build.gradle"].versionCode = ${buildVersion} |
.android["AndroidManifest.xml"].usesCleartextTraffic = true
' ${configFile}.template > ${configFile}`)
  const c = config()

  const np = process.execPath
  const ip = path.join(c.rootDir, 'lib', 'main.js')
  const options: cp.ExecFileSyncOptions = {
    env: process.env
  }

  // Prepare: Create the file for tests
  const projectdir = path.join(c.rootDir, c.android.projectDir)
  const files = {
    'build.gradle': resetFile(`${projectdir}/app/build.gradle`),
    'AndroidManifest.xml': resetFile(`${projectdir}/app/src/main/AndroidManifest.xml`)
  }

  beforeAll(() => {
    console.log(cp.execFileSync(np, [ip], options).toString())
  })

  describe('build.gradle', () => {
    test(`versionCode should be equal to ${buildVersion}`, () => {
      const line = grep(files['build.gradle'], 'versionCode')
      const value = line.replace(/.*versionCode (.*).*/, '$1')
      expect(value).toEqual(buildVersion)
    })
    test(`versionName should be equal to ${appVersion}`, () => {
      const line = grep(files['build.gradle'], 'versionName')
      const value = line.replace(/.*versionName "(.*)".*/, '$1')
      expect(value).toEqual(appVersion)
    })
  })

  describe('AndroidManifest.xml', () => {
    test(`usesCleartextTraffic should be present and equal to ${c.android['AndroidManifest.xml'].usesCleartextTraffic}`, () => {
      const line = grep(files['AndroidManifest.xml'], 'android:usesCleartextTraffic')
      const value = line.replace(/.*android:usesCleartextTraffic="([^"]*)".*/, '$1')
      expect(value).toBe(c.android['AndroidManifest.xml'].usesCleartextTraffic.toString())
    })

    test('permissions should be present', () => {
      const stdout = fs.readFileSync(files['AndroidManifest.xml'], 'utf8')
      c.android['AndroidManifest.xml'].permissions.forEach((element: string) => {
        const str = `<uses-permission android:name="${element}"/>`
        expect(stdout).toMatch(new RegExp(str))
      })
    })

    test('features should be present', () => {
      const stdout = fs.readFileSync(files['AndroidManifest.xml'], 'utf8')
      c.android['AndroidManifest.xml'].features.forEach((element: string) => {
        const str = `<uses-feature android:name="${element}"/>`
        expect(stdout).toMatch(new RegExp(str))
      })
    })
  })
})
