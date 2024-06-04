import * as core from '@actions/core'

const outputNames = {
    url: 'url',
}

export type Output = Partial<{
    url: string
}>

export function setOutput(output: Output): void {
    const { url } = output

    core.info(`${outputNames.url}: ${JSON.stringify(url)}`)

    core.setOutput(outputNames.url, url)
}
