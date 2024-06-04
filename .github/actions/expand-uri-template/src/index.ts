import * as core from '@actions/core'

import packageJson from 'package.json'
import { getUriTemplate } from './input'
import { setOutput } from './output'
import { expandUriTemplate } from './uri-template'

async function run(): Promise<void> {
    core.info(`action [${packageJson.name}@${packageJson.version}] started!`)

    try {
        core.startGroup('inputs')
        const uriTemplate = getUriTemplate()
        core.endGroup()

        const url = await expandUriTemplate(uriTemplate)

        core.startGroup('outputs')
        setOutput({ url })
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
