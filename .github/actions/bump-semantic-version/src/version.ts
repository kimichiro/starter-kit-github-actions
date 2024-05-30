import * as core from '@actions/core'
import semver from 'semver'
import { simpleGit } from 'simple-git'
import { PrereleaseId, Prerelease, TagPrefix, Type, FallbackVersion } from './input'

function getSemanticVersions(tagNames: string[], tagPrefix?: string): string[] {
    return tagNames
        .flatMap((tagName) =>
            tagPrefix != null && tagPrefix.length > 0
                ? tagName.startsWith(tagPrefix)
                    ? tagName.substring(tagPrefix.length)
                    : []
                : tagName,
        )
        .filter((tag) => semver.valid(tag))
}

export async function findVersions(tagPrefix?: TagPrefix): Promise<string[]> {
    const git = simpleGit()

    const describeResult = await git.raw([
        'describe',
        '--tags',
        '--abbrev=0',
        '--first-parent',
        '--always',
        ...(tagPrefix != null && tagPrefix?.length > 0 ? [`--match="${tagPrefix}**"`] : []),
        'HEAD',
    ])

    const commit = describeResult?.trim()
    const revListResult = await git.raw(['rev-list', '--first-parent', '--simplify-by-decoration', commit])

    const commits = revListResult.split(/\s/g).filter((c) => !!c)
    const tagResult = await git.raw(['tag', ...commits.flatMap((commit) => ['--points-at', commit])])

    const tags = tagResult.split(/\s/g)
    core.debug(`tags: ${JSON.stringify(tags)}`)

    const versions = getSemanticVersions(tags, tagPrefix)
    core.debug(`versions: ${JSON.stringify(versions)}`)

    return versions
}

export async function bumpVersion(
    type: Type,
    prerelease: Prerelease,
    prereleaseId: PrereleaseId,
    fallbackVersion: FallbackVersion,
    versions: string[],
): Promise<string | undefined> {
    // 1. Find max release version
    core.debug(`step: 1`)
    const releaseVersion = semver.maxSatisfying([fallbackVersion, ...versions], '*') ?? fallbackVersion
    core.info(`release-version: ${JSON.stringify(releaseVersion)}`)

    // 2. Find max pre-release version of given choice based on (1)
    core.debug(`step: 2`)
    const prereleaseVersion =
        semver.maxSatisfying([fallbackVersion, ...versions], '*', {
            includePrerelease: true,
        }) ?? fallbackVersion
    core.info(`prerelease-version: ${JSON.stringify(prereleaseVersion)}`)

    // 3. Bump version of given `type`, `prerelease` based on (1)
    core.debug(`step: 3`)
    const nextVersion = semver.inc(releaseVersion, prerelease ? `pre${type}` : type, false, prereleaseId)
    if (nextVersion == null) {
        return
    }

    // 4. If (1) and (2) is equals, return (3)
    core.debug(`step: 4`)
    if (releaseVersion === prereleaseVersion) {
        return nextVersion ?? undefined
    }

    // 5. If given `prerelease=false`, return (3)
    core.debug(`step: 5`)
    if (!prerelease) {
        return nextVersion ?? undefined
    }

    // 6. Find max pre-release version from major/minor/patch of (3)
    //     - for `major` type, `major.0.0`
    //     - for `minor` type, `major.minor.0`
    //     - for `patch` type, `major.minor.patch`
    core.debug(`step: 6`)
    let maxPrerelease: string | undefined
    const major = semver.major(nextVersion)
    const minor = semver.minor(nextVersion)
    const patch = semver.patch(nextVersion)
    if (type === 'major') {
        maxPrerelease =
            semver.maxSatisfying(versions, `~${major}.0.0-${prereleaseId}.0`, { includePrerelease: true }) ?? undefined
    } else if (type === 'minor') {
        maxPrerelease =
            semver.maxSatisfying(versions, `~${major}.${minor}.0-${prereleaseId}.0`, { includePrerelease: true }) ??
            undefined
    } else if (type === 'patch') {
        maxPrerelease =
            semver.maxSatisfying(versions, `~${major}.${minor}.${patch}-${prereleaseId}.0`, {
                includePrerelease: true,
            }) ?? undefined
    }

    // 7. If (6) not exists, return (3)
    core.debug(`step: 7`)
    if (maxPrerelease == null) {
        return nextVersion
    }

    // 8. Bump version of given `type` with `prerelease=true` based on (6), return (8)
    core.debug(`step: 8`)
    return semver.inc(maxPrerelease, prerelease ? 'prerelease' : type, false, prereleaseId) ?? undefined
}
