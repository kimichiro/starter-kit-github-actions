import * as core from '@actions/core'

import { Prerelease, TagName, Title, Body } from './input'
import { addRemoteTag, deleteRemoteTag, getRemoteInfo } from './git'

export async function createRelease(
    tagName: TagName,
    prerelease: Prerelease,
    title: Title,
    body: Body,
): Promise<string | undefined> {
    let needRollback = false
    try {
        needRollback = await addRemoteTag(tagName)

        const remoteInfo = await getRemoteInfo()
        if (remoteInfo == null) {
            return
        }

        const githubToken = process.env['GITHUB_TOKEN']

        const { Octokit } = await import('octokit')
        const octokit = new Octokit({ auth: githubToken })

        const release = await octokit.rest.repos.createRelease({
            owner: remoteInfo.owner,
            repo: remoteInfo.repo,
            tag_name: tagName,
            ...(title != null ? { name: title } : {}),
            ...(body != null ? { body: body } : {}),
            prerelease: prerelease,
            generate_release_notes: true,
        })

        const { html_url } = release.data
        return html_url
    } finally {
        if (needRollback) {
            try {
                await deleteRemoteTag(tagName)
            } catch (error) {
                core.warning(
                    `failed to delete remote tag: ${error?.toString()}`,
                )
            }
        }
    }
}
