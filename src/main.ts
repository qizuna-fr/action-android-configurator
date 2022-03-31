import * as core from '@actions/core'
import * as AndroidManifest from './AndroidManifest'
import * as gradle from './gradle'

async function run(): Promise<void> {
  try {
    /* build.gradle */
    gradle.setVersions()

    /* AndroidManifest.xml */
    AndroidManifest.setOptions()
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
