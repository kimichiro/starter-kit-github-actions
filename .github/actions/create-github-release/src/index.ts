import * as core from '@actions/core'

import packageJson from 'package.json'
import { getTagName, getPrerelease, getTitle, getBody } from './input'
import { createRelease } from './github'
import { setOutput } from './output'

async function run(): Promise<void> {
    core.info(`action [${packageJson.name}@${packageJson.version}] started!`)

    try {
        core.startGroup('inputs')
        const tagName = getTagName()
        const prerelease = getPrerelease()
        const title = getTitle()
        const body = getBody()
        core.endGroup()

        const releaseUrl = await createRelease(tagName, prerelease, title, body)

        core.startGroup('outputs')
        setOutput({ releaseUrl })
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
