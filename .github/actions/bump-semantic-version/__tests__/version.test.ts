import { describe, expect, jest, test } from '@jest/globals'

import * as version from '../src/version'
import { bumpVersion, findMostRecentVersion } from '../src/version'
import { Prerelease, PrereleaseId, TagPrefix, Type } from '../src/input'

jest.mock('@actions/core')
jest.mock('simple-git', () => ({
    default: jest.fn(),
    simpleGit: jest.fn(() => mockSimpleGit),
}))

const mockSimpleGit = {
    raw: jest.fn(),
    tag: jest.fn(() => Promise.resolve('')),
}

const testCases = {
    findMostRecentVersion: [
        ['', [''], undefined],
        ['', ['1.0.0'], '1.0.0'],
        ['', ['1.0.0', '1.1.0-rc.0'], '1.1.0-rc.0'],
        ['', ['1.0.0', '1.1.0-rc.0', '1.1.0'], '1.1.0'],
        ['release/', ['release/1.0.0', 'release/1.1.0-rc.0'], '1.1.0-rc.0'],
        ['release/', ['release/1.0.0', 'release/2.0.0'], '2.0.0'],
        ['release/', ['1.0.0', 'release/2.0.0'], '2.0.0'],
        ['release/', ['2.1.0-rc.0', 'release/2.0.0'], '2.0.0'],
        ['release/', ['3.0.0', 'release/2.0.0'], '2.0.0'],
    ],
    bumpVersion: [
        ['patch', true, 'rc', 'release/', '', undefined, undefined],

        ['patch', true, 'rc', 'release/', '0.0.0', undefined, '0.0.1-rc.0'],
        ['minor', true, 'rc', 'release/', '0.0.0', undefined, '0.1.0-rc.0'],
        ['major', true, 'rc', 'release/', '0.0.0', undefined, '1.0.0-rc.0'],

        ['patch', true, 'rc', 'release/', '0.0.0', '1.0.0', '1.0.1-rc.0'],
        ['minor', true, 'rc', 'release/', '0.0.0', '1.0.0', '1.1.0-rc.0'],
        ['major', true, 'rc', 'release/', '0.0.0', '1.0.0', '2.0.0-rc.0'],
        ['patch', true, 'rc', 'release/', '0.0.0', '1.2.3', '1.2.4-rc.0'],
        ['minor', true, 'rc', 'release/', '0.0.0', '1.2.3', '1.3.0-rc.0'],
        ['major', true, 'rc', 'release/', '0.0.0', '1.2.3', '2.0.0-rc.0'],
        ['patch', true, 'rc', 'release/', '0.0.0', '1.0.0-rc.0', '1.0.0-rc.1'],
        ['minor', true, 'rc', 'release/', '0.0.0', '1.0.0-rc.0', '1.0.0-rc.1'],
        ['major', true, 'rc', 'release/', '0.0.0', '1.0.0-rc.0', '1.0.0-rc.1'],
        ['patch', true, 'rc', 'release/', '0.0.0', '1.2.3-rc.4', '1.2.3-rc.5'],
        ['minor', true, 'rc', 'release/', '0.0.0', '1.2.3-rc.4', '1.2.3-rc.5'],
        ['major', true, 'rc', 'release/', '0.0.0', '1.2.3-rc.4', '1.2.3-rc.5'],

        ['patch', true, 'rc', 'release/', '0.0.0', '1.0.0-alpha.0', '1.0.0-rc.0'],
        ['minor', true, 'rc', 'release/', '0.0.0', '1.0.0-alpha.0', '1.0.0-rc.0'],
        ['major', true, 'rc', 'release/', '0.0.0', '1.0.0-alpha.0', '1.0.0-rc.0'],
        ['patch', true, 'rc', 'release/', '0.0.0', '1.2.3-alpha.4', '1.2.3-rc.0'],
        ['minor', true, 'rc', 'release/', '0.0.0', '1.2.3-alpha.4', '1.2.3-rc.0'],
        ['major', true, 'rc', 'release/', '0.0.0', '1.2.3-alpha.4', '1.2.3-rc.0'],
        ['patch', true, 'rc', 'release/', '0.0.0', '1.0.0-alpha', '1.0.0-rc.0'],
        ['minor', true, 'rc', 'release/', '0.0.0', '1.0.0-alpha', '1.0.0-rc.0'],
        ['major', true, 'rc', 'release/', '0.0.0', '1.0.0-alpha', '1.0.0-rc.0'],
        ['patch', true, 'rc', 'release/', '0.0.0', '1.2.3-alpha', '1.2.3-rc.0'],
        ['minor', true, 'rc', 'release/', '0.0.0', '1.2.3-alpha', '1.2.3-rc.0'],
        ['major', true, 'rc', 'release/', '0.0.0', '1.2.3-alpha', '1.2.3-rc.0'],

        ['patch', false, 'rc', 'release/', '0.0.0', undefined, '0.0.1'],
        ['minor', false, 'rc', 'release/', '0.0.0', undefined, '0.1.0'],
        ['major', false, 'rc', 'release/', '0.0.0', undefined, '1.0.0'],

        ['patch', false, 'rc', 'release/', '0.0.0', '1.0.0', '1.0.1'],
        ['minor', false, 'rc', 'release/', '0.0.0', '1.0.0', '1.1.0'],
        ['major', false, 'rc', 'release/', '0.0.0', '1.0.0', '2.0.0'],
        ['patch', false, 'rc', 'release/', '0.0.0', '1.2.3', '1.2.4'],
        ['minor', false, 'rc', 'release/', '0.0.0', '1.2.3', '1.3.0'],
        ['major', false, 'rc', 'release/', '0.0.0', '1.2.3', '2.0.0'],
        ['patch', false, 'rc', 'release/', '0.0.0', '1.0.0-rc.0', '1.0.0'],
        ['minor', false, 'rc', 'release/', '0.0.0', '1.0.0-rc.0', '1.0.0'],
        ['major', false, 'rc', 'release/', '0.0.0', '1.0.0-rc.0', '1.0.0'],
        ['patch', false, 'rc', 'release/', '0.0.0', '1.2.3-rc.4', '1.2.3'],
        ['minor', false, 'rc', 'release/', '0.0.0', '1.2.3-rc.4', '1.3.0'],
        ['major', false, 'rc', 'release/', '0.0.0', '1.2.3-rc.4', '2.0.0'],

        ['patch', false, 'rc', 'release/', '0.0.0', '1.0.0-alpha.0', '1.0.0'],
        ['minor', false, 'rc', 'release/', '0.0.0', '1.0.0-alpha.0', '1.0.0'],
        ['major', false, 'rc', 'release/', '0.0.0', '1.0.0-alpha.0', '1.0.0'],
        ['patch', false, 'rc', 'release/', '0.0.0', '1.2.3-alpha.4', '1.2.3'],
        ['minor', false, 'rc', 'release/', '0.0.0', '1.2.3-alpha.4', '1.3.0'],
        ['major', false, 'rc', 'release/', '0.0.0', '1.2.3-alpha.4', '2.0.0'],
        ['patch', false, 'rc', 'release/', '0.0.0', '1.0.0-alpha', '1.0.0'],
        ['minor', false, 'rc', 'release/', '0.0.0', '1.0.0-alpha', '1.0.0'],
        ['major', false, 'rc', 'release/', '0.0.0', '1.0.0-alpha', '1.0.0'],
        ['patch', false, 'rc', 'release/', '0.0.0', '1.2.3-alpha', '1.2.3'],
        ['minor', false, 'rc', 'release/', '0.0.0', '1.2.3-alpha', '1.3.0'],
        ['major', false, 'rc', 'release/', '0.0.0', '1.2.3-alpha', '2.0.0'],
    ],
}

describe('findMostRecentVersion()', () => {
    test.each(testCases.findMostRecentVersion)(
        'when (arg0=%p) and the most recent tags found are %p then returns %p',
        async (tagPrefix, foundTags, expected) => {
            const oneTagPerLine = (foundTags as string[]).join('\n')
            mockSimpleGit.tag.mockResolvedValueOnce(oneTagPerLine)

            const result = await findMostRecentVersion(tagPrefix as string)

            expect(result).toEqual(expected)
        },
    )
})

describe('bumpVersion()', () => {
    test.each(testCases.bumpVersion)(
        'when (arg0=%p, arg1=%p, arg2=%p, arg3=%p, arg4=%p) and the most recent version is %p then returns %p',
        async (
            type,
            prerelease,
            prereleaseId,
            tagPrefix,
            fallbackVersion,
            recentVersion,
            expected,
        ) => {
            jest.spyOn(version, 'findMostRecentVersion').mockResolvedValueOnce(
                recentVersion as string | undefined,
            )

            const result = await bumpVersion(
                type as Type,
                prerelease as Prerelease,
                prereleaseId as PrereleaseId,
                tagPrefix as TagPrefix,
                fallbackVersion as string,
            )

            expect(result).toEqual(expected)
        },
    )
})
