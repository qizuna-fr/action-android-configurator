import * as convert from 'xml-js'
import * as fs from 'fs'
import * as path from 'path'
import config from './config'

import * as Permissions from './Classes/permissions'

class Options {
  usesCleartextTraffic: boolean
  permissions: string[]
  features: string[]

  constructor() {
    this.usesCleartextTraffic = false
    this.permissions = []
    this.features = []
  }
}

function mergeObjectPermission(array: string[]): Permissions.ObjectPermission[] {
  const local: Permissions.ObjectPermission[] = []

  array.forEach(element => {
    local.push(new Permissions.ObjectPermission(element))
  })

  return local
}

export async function setOptions(): Promise<void> {
  const c = config()
  const filename = path.join(c.rootDir, c.android.projectDir, 'app', 'src', 'main', 'AndroidManifest.xml')
  const options = new Options()
  Object.assign(options, c.android['AndroidManifest.xml'])

  const xml = fs.readFileSync(filename, 'utf8')
  const json = JSON.parse(convert.xml2json(xml, {compact: true, ignoreComment: false, spaces: 4}))

  json.manifest.application._attributes['android:usesCleartextTraffic'] = options.usesCleartextTraffic
  json.manifest['uses-permission'] = Permissions.merge(json.manifest['uses-permission'], mergeObjectPermission(options.permissions))
  json.manifest['uses-feature'] = Permissions.merge(json.manifest['uses-feature'], mergeObjectPermission(options.features))

  const result = convert.json2xml(JSON.stringify(json), {
    compact: true,
    ignoreComment: true,
    spaces: 4
  })

  fs.writeFileSync(filename, result)
}
