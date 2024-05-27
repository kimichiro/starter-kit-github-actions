import * as core from '@actions/core'
import { simpleGit } from 'simple-git'

import { TagName } from './input'

export async function addRemoteTag(tagName: TagName): Promise<boolean> {
    const git = simpleGit()

    const remoteResult = await git.remote([])
    const remote = remoteResult?.trim() as string

    const tagResult = await git.tag(['-l', tagName])
    const tags = tagResult.split(/\s/)

    if (tags.includes(tagName)) {
        return false
    }

    await git.tag([tagName])
    await git.push(['--tags'])

    core.info(`Push tag '${tagName}' to remote '${remote}'`)

    return true
}

export async function deleteRemoteTag(tagName: TagName): Promise<void> {
    const git = simpleGit()

    const remoteResult = await git.remote([])
    const remote = remoteResult?.trim() as string

    await git.push([remote, '--delete', tagName])

    core.info(`Delete tag '${tagName}' on remote '${remote}'`)
}

export interface RemoteInfo {
    owner: string
    repo: string
}
export async function getRemoteInfo(): Promise<RemoteInfo | undefined> {
    const git = simpleGit()

    try {
        let remoteResult = await git.remote([])
        const remote = remoteResult?.trim()

        remoteResult = await git.remote(['get-url', remote as string])
        const gitUrl = remoteResult?.trim()

        core.info(`Remote git url '${gitUrl}'`)

        const pattern = /(?<owner>[^/]+)\/(?<repo>[^/]+)\.git$/
        const matches = pattern.exec(gitUrl as string)

        return matches?.groups as RemoteInfo | undefined
    } catch (error) {
        core.warning(`Failed to delete remote tag: ${error?.toString()}`)
    }
}
