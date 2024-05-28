import * as core from '@actions/core'

const outputNames = {
    version: 'version',
}

export type Output = Partial<{
    version: string
}>

export function setOutput(output: Output): void {
    const { version } = output

    core.info(`${outputNames.version}: ${JSON.stringify(version)}`)

    core.setOutput(outputNames.version, version)
}
