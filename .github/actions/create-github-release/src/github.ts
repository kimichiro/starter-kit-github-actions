import * as core from '@actions/core'
import { EOL } from 'os'

import { Prerelease, TagName, Title, Body } from './input'
import { addRemoteTag, deleteRemoteTag, getCommitMessage, getHeadSha } from './git'

async function getDefaultBody(tagName: string): Promise<string> {
    const commitSha = await getHeadSha()
    const commitMessage = await getCommitMessage(commitSha)

    const lines = [
        commitMessage,
        ' ',
        `sha: ${commitSha}`,
        `tag: ${tagName}`,
    ]
    return lines.join(EOL)
}

export async function createRelease(
    tagName: TagName,
    prerelease: Prerelease,
    title: Title,
    body: Body,
): Promise<string | undefined> {
    let needRollback = false
    try {
        needRollback = await addRemoteTag(tagName)

        const owner = process.env['GITHUB_REPOSITORY_OWNER'] ?? ''
        const repository = process.env['GITHUB_REPOSITORY'] ?? ''
        const token = process.env['GITHUB_TOKEN'] ?? ''

        const repo = repository.split('/')[1]

        const { Octokit } = await import('octokit')
        const octokit = new Octokit({ auth: token, log: console })

        title = !!title ? title : tagName
        body = !!body ? body : await getDefaultBody(tagName)

        const release = await octokit.rest.repos.createRelease({
            owner,
            repo,
            tag_name: tagName,
            ...(!!title ? { name: title } : {}),
            ...(!!body ? { body: body } : {}),
            prerelease: prerelease,
            generate_release_notes: true,
        })
        needRollback = needRollback && release.data == null

        const { html_url } = release.data
        return html_url
    } finally {
        if (needRollback) {
            try {
                await deleteRemoteTag(tagName)
            } catch (error) {
                core.warning(`failed to delete remote tag: ${error?.toString()}`)
            }
        }
    }
}
