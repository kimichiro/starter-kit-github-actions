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

    core.info(`push tag '${tagName}' to remote '${remote}'`)

    return true
}

export async function deleteRemoteTag(tagName: TagName): Promise<void> {
    const git = simpleGit()

    const remoteResult = await git.remote([])
    const remote = remoteResult?.trim() as string

    await git.push([remote, '--delete', tagName])

    core.info(`delete tag '${tagName}' on remote '${remote}'`)
}

export async function getHeadSha(): Promise<string> {
    const git = simpleGit()

    const revparseResult = await git.revparse(['--verify', 'HEAD'])

    core.info(`HEAD: ${JSON.stringify(revparseResult)}`)

    return revparseResult
}

export async function getCommitMessage(commit: string): Promise<string> {
    const git = simpleGit()

    const logResult = await git.raw(['log', '-1', '--pretty=%B', commit])

    core.info(`Commit Message: ${JSON.stringify(logResult)}`)

    return logResult
}
