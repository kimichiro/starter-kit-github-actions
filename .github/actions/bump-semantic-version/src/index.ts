import * as core from '@actions/core'

import packageJson from 'package.json'
import { getType, getPreRelease, getPreReleaseId, getTagPrefix, getFallbackVersion } from './input'
import { setOutput } from './output'
import { bumpVersion, findVersions } from './version'

async function run(): Promise<void> {
    core.info(`action [${packageJson.name}@${packageJson.version}] started!`)

    try {
        core.startGroup('inputs')
        const type = getType()
        const preRelease = getPreRelease()
        const preReleaseId = getPreReleaseId()
        const tagPrefix = getTagPrefix()
        const fallbackVersion = getFallbackVersion()
        core.endGroup()

        const versions = await findVersions(tagPrefix)
        const version = await bumpVersion(type, preRelease, preReleaseId, fallbackVersion, versions)

        core.startGroup('outputs')
        setOutput({ version })
        core.endGroup()
    } catch (error) {
        if (error instanceof Error) {
            core.setFailed(error)
        } else {
            core.setFailed(JSON.stringify(error))
        }
    }
}

run()
