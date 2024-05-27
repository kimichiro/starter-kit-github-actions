import * as core from '@actions/core'

const outputNames = {
    releaseUrl: 'release-url',
}

export type Output = Partial<{
    releaseUrl: string
}>

export function setOutput(output: Output): void {
    const { releaseUrl } = output

    core.info(`outputs.${outputNames.releaseUrl}=${JSON.stringify(releaseUrl)}`)

    core.setOutput(outputNames.releaseUrl, releaseUrl)
}
