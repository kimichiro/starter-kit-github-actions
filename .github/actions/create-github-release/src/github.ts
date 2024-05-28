import * as core from '@actions/core'

import { Prerelease, TagName, Title, Body } from './input'
import { addRemoteTag, deleteRemoteTag } from './git'

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

        const release = await octokit.rest.repos.createRelease({
            owner,
            repo,
            tag_name: tagName,
            ...(title != null ? { name: title } : {}),
            ...(body != null ? { body: body } : {}),
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
