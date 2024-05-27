import * as core from '@actions/core'

import packageJson from 'package.json'
import { getTagName, getPrerelease, getTitle, getBody } from './input'
import { createRelease } from './github'

async function run(): Promise<void> {
    core.info(`action [${packageJson.name}@${packageJson.version}] started!`)

    try {
        const tagName = getTagName()
        const prerelease = getPrerelease()
        const title = getTitle()
        const body = getBody()

        const releaseUrl = await createRelease(tagName, prerelease, title, body)

        core.setOutput('release-url', releaseUrl)
    } catch (error) {
        if (error instanceof Error) {
            core.setFailed(error.message)
        } else {
            core.setFailed(JSON.stringify(error))
        }
    }
}

run()
