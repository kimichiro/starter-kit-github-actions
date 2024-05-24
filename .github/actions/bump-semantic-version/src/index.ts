import * as core from '@actions/core'

import packageJson from 'package.json'
import {
    getType,
    getPreRelease,
    getPreReleaseId,
    getTagPrefix,
    getFallbackVersion,
} from './input'
import { bumpVersion } from './version'

async function run(): Promise<void> {
    core.info(`Action [${packageJson.name}@${packageJson.version}] started!`)

    try {
        const type = getType()
        const preRelease = getPreRelease()
        const preReleaseId = getPreReleaseId()
        const tagPrefix = getTagPrefix()
        const fallbackVersion = getFallbackVersion()

        const version = await bumpVersion(
            type,
            preRelease,
            preReleaseId,
            tagPrefix,
            fallbackVersion,
        )

        core.setOutput('version', version)
    } catch (error) {
        if (error instanceof Error) {
            core.setFailed(error.message)
        } else {
            core.setFailed(JSON.stringify(error))
        }
    }
}

run()
