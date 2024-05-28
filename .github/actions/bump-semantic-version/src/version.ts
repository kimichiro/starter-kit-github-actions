import * as core from '@actions/core'
import semver from 'semver'
import { simpleGit } from 'simple-git'
import { PrereleaseId, Prerelease, TagPrefix, Type, FallbackVersion } from './input'

export async function findMostRecentVersion(tagPrefix: string): Promise<string | undefined> {
    const git = simpleGit()

    const describeResult = await git.raw([
        'describe',
        '--tags',
        '--abbrev=0',
        '--first-parent',
        '--always',
        ...(tagPrefix?.length > 0 ? [`--match="${tagPrefix}**"`] : []),
        'HEAD',
    ])

    const commit = describeResult?.trim()
    const tagResult = await git.tag(['--points-at', commit])
    core.debug(`tag-result: ${JSON.stringify(tagResult)}`)

    const tags = tagResult
        .split(/\s/)
        .flatMap((tagName) =>
            tagPrefix?.length > 0
                ? tagName.startsWith(tagPrefix)
                    ? tagName.substring(tagPrefix.length)
                    : []
                : tagName,
        )
    core.debug(`tags: ${JSON.stringify(tags)}`)

    const recentVersion = semver.maxSatisfying(tags, '*', {
        includePrerelease: true,
    })
    if (recentVersion == null) {
        core.info(`no recent tag found at ${commit}`)
        return
    }

    core.info(`recent tag '${recentVersion}' found at ${commit}`)
    return recentVersion
}

export async function bumpVersion(
    type: Type,
    prerelease: Prerelease,
    prereleaseId: PrereleaseId,
    tagPrefix: TagPrefix,
    fallbackVersion: FallbackVersion,
): Promise<string | undefined> {
    const recentVersion = await findMostRecentVersion(tagPrefix)

    const baseVersion = recentVersion == null ? fallbackVersion : recentVersion
    const isPrerelease = semver.prerelease(baseVersion) != null

    const bumpVersion = prerelease
        ? semver.inc(baseVersion, isPrerelease ? 'prerelease' : `pre${type}`, false, prereleaseId)
        : semver.inc(baseVersion, type)

    return bumpVersion ?? undefined
}
