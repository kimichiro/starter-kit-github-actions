import { describe, expect, jest, test } from '@jest/globals'
import { EOL } from 'os'

import { Type, Prerelease, PrereleaseId } from '../src/input'
import { bumpVersion, findVersions } from '../src/version'

jest.mock('@actions/core')
jest.mock('simple-git', () => ({
    default: jest.fn(),
    simpleGit: jest.fn(() => mockSimpleGit),
}))

const mockSimpleGit = {
    raw: jest.fn(() => Promise.resolve('')),
}

describe('findVersions()', () => {
    test.each([
        [[''], [''], []],
        [[''], ['1.0.0'], ['1.0.0']],
        [[''], ['1.0.0', '1.1.0-rc.0'], ['1.0.0', '1.1.0-rc.0']],
        [[''], ['1.0.0', '1.1.0-rc.0', 'release/1.1.0', 'release/1.2.0-rc.0'], ['1.0.0', '1.1.0-rc.0']],
        [[''], ['release/1.1.0', 'release/1.2.0-rc.0'], []],
        [['release/'], [''], []],
        [['release/'], ['2.0.0'], []],
        [['release/'], ['release/2.0.0'], ['2.0.0']],
        [['release/'], ['2.0.0', '2.1.0-rc.0'], []],
        [['release/'], ['2.0.0', '2.1.0-rc.0', 'release/2.1.0', 'release/2.2.0-rc.0'], ['2.1.0', '2.2.0-rc.0']],
        [['release/'], ['release/2.1.0', 'release/2.2.0-rc.0'], ['2.1.0', '2.2.0-rc.0']],
    ])('when args=%j and following versions found %p then returns %p', async ([tagPrefix], foundTags, expected) => {
        const tagResult = (foundTags as string[]).join(EOL)
        mockSimpleGit.raw.mockResolvedValueOnce('')
        mockSimpleGit.raw.mockResolvedValueOnce('')
        mockSimpleGit.raw.mockResolvedValueOnce(tagResult)

        const result = await findVersions(tagPrefix)

        expect(result).toEqual(expected)
    })
})

describe('bumpVersion()', () => {
    test.each([
        [['patch', true, 'rc', '', []], undefined],

        // No versions
        [['patch', true, 'rc', '0.0.0', []], '0.0.1-rc.0'],
        [['minor', true, 'rc', '0.0.0', []], '0.1.0-rc.0'],
        [['major', true, 'rc', '0.0.0', []], '1.0.0-rc.0'],

        // No Release
        [['patch', true, 'rc', '0.0.0', ['1.2.0-rc.0']], '0.0.1-rc.0'],
        [['minor', true, 'rc', '0.0.0', ['1.2.0-rc.0']], '0.1.0-rc.0'],
        [['major', true, 'rc', '0.0.0', ['1.2.0-rc.0']], '1.0.0-rc.0'],
        [['patch', true, 'rc', '0.0.0', ['1.2.0-rc.0', '1.2.1-rc.0']], '0.0.1-rc.0'],
        [['minor', true, 'rc', '0.0.0', ['1.2.0-rc.0', '1.2.1-rc.0']], '0.1.0-rc.0'],
        [['major', true, 'rc', '0.0.0', ['1.2.0-rc.0', '1.2.1-rc.0']], '1.0.0-rc.0'],

        // No Prerelease
        [['patch', true, 'rc', '0.0.0', ['1.2.0']], '1.2.1-rc.0'],
        [['minor', true, 'rc', '0.0.0', ['1.2.0']], '1.3.0-rc.0'],
        [['major', true, 'rc', '0.0.0', ['1.2.0']], '2.0.0-rc.0'],
        [['patch', true, 'rc', '0.0.0', ['1.2.0', '1.2.1']], '1.2.2-rc.0'],
        [['minor', true, 'rc', '0.0.0', ['1.2.0', '1.2.1']], '1.3.0-rc.0'],
        [['major', true, 'rc', '0.0.0', ['1.2.0', '1.2.1']], '2.0.0-rc.0'],

        // Release > Prerelease
        [['patch', true, 'rc', '0.0.0', ['1.2.0-rc.0', '1.2.0']], '1.2.1-rc.0'],
        [['minor', true, 'rc', '0.0.0', ['1.2.0-rc.0', '1.2.0']], '1.3.0-rc.0'],
        [['major', true, 'rc', '0.0.0', ['1.2.0-rc.0', '1.2.0']], '2.0.0-rc.0'],
        [['patch', true, 'rc', '0.0.0', ['1.2.0-rc.0', '1.2.0-rc.1', '1.2.0']], '1.2.1-rc.0'],
        [['minor', true, 'rc', '0.0.0', ['1.2.0-rc.0', '1.2.0-rc.1', '1.2.0']], '1.3.0-rc.0'],
        [['major', true, 'rc', '0.0.0', ['1.2.0-rc.0', '1.2.0-rc.1', '1.2.0']], '2.0.0-rc.0'],

        // Prerelease > Release
        [['patch', true, 'rc', '0.0.0', ['1.2.0', '1.3.0-rc.0']], '1.2.1-rc.0'],
        [['minor', true, 'rc', '0.0.0', ['1.2.0', '1.3.0-rc.0']], '1.3.0-rc.1'],
        [['major', true, 'rc', '0.0.0', ['1.2.0', '1.3.0-rc.0']], '2.0.0-rc.0'],
        [['patch', true, 'rc', '0.0.0', ['1.2.0', '1.3.0-rc.0', '1.2.1-rc.0']], '1.2.1-rc.1'],
        [['minor', true, 'rc', '0.0.0', ['1.2.0', '1.3.0-rc.0', '1.2.1-rc.0']], '1.3.0-rc.1'],
        [['major', true, 'rc', '0.0.0', ['1.2.0', '1.3.0-rc.0', '1.2.1-rc.0']], '2.0.0-rc.0'],

        // No versions
        [['patch', false, 'rc', '0.0.0', []], '0.0.1'],
        [['minor', false, 'rc', '0.0.0', []], '0.1.0'],
        [['major', false, 'rc', '0.0.0', []], '1.0.0'],

        // No Release
        [['patch', false, 'rc', '0.0.0', ['1.2.0-rc.0']], '0.0.1'],
        [['minor', false, 'rc', '0.0.0', ['1.2.0-rc.0']], '0.1.0'],
        [['major', false, 'rc', '0.0.0', ['1.2.0-rc.0']], '1.0.0'],
        [['patch', false, 'rc', '0.0.0', ['1.2.0-rc.0', '1.2.1-rc.0']], '0.0.1'],
        [['minor', false, 'rc', '0.0.0', ['1.2.0-rc.0', '1.2.1-rc.0']], '0.1.0'],
        [['major', false, 'rc', '0.0.0', ['1.2.0-rc.0', '1.2.1-rc.0']], '1.0.0'],

        // No Prerelease
        [['patch', false, 'rc', '0.0.0', ['1.2.0']], '1.2.1'],
        [['minor', false, 'rc', '0.0.0', ['1.2.0']], '1.3.0'],
        [['major', false, 'rc', '0.0.0', ['1.2.0']], '2.0.0'],
        [['patch', false, 'rc', '0.0.0', ['1.2.0', '1.2.1']], '1.2.2'],
        [['minor', false, 'rc', '0.0.0', ['1.2.0', '1.2.1']], '1.3.0'],
        [['major', false, 'rc', '0.0.0', ['1.2.0', '1.2.1']], '2.0.0'],

        // Release > Prerelease
        [['patch', false, 'rc', '0.0.0', ['1.2.0-rc.0', '1.2.0']], '1.2.1'],
        [['minor', false, 'rc', '0.0.0', ['1.2.0-rc.0', '1.2.0']], '1.3.0'],
        [['major', false, 'rc', '0.0.0', ['1.2.0-rc.0', '1.2.0']], '2.0.0'],
        [['patch', false, 'rc', '0.0.0', ['1.2.0-rc.0', '1.2.0-rc.1', '1.2.0']], '1.2.1'],
        [['minor', false, 'rc', '0.0.0', ['1.2.0-rc.0', '1.2.0-rc.1', '1.2.0']], '1.3.0'],
        [['major', false, 'rc', '0.0.0', ['1.2.0-rc.0', '1.2.0-rc.1', '1.2.0']], '2.0.0'],

        // Prerelease > Release
        [['patch', false, 'rc', '0.0.0', ['1.2.0', '1.3.0-rc.0']], '1.2.1'],
        [['minor', false, 'rc', '0.0.0', ['1.2.0', '1.3.0-rc.0']], '1.3.0'],
        [['major', false, 'rc', '0.0.0', ['1.2.0', '1.3.0-rc.0']], '2.0.0'],
        [['patch', false, 'rc', '0.0.0', ['1.2.0', '1.3.0-rc.0', '1.2.1-rc.0']], '1.2.1'],
        [['minor', false, 'rc', '0.0.0', ['1.2.0', '1.3.0-rc.0', '1.2.1-rc.0']], '1.3.0'],
        [['major', false, 'rc', '0.0.0', ['1.2.0', '1.3.0-rc.0', '1.2.1-rc.0']], '2.0.0'],

        // Mismatch prereleaseid
        [['patch', true, 'rc', '0.0.0', ['0.1.0-alpha.0']], '0.0.1-rc.0'],
        [['minor', true, 'rc', '0.0.0', ['0.1.0-alpha.0']], '0.1.0-rc.0'],
        [['major', true, 'rc', '0.0.0', ['0.1.0-alpha.0']], '1.0.0-rc.0'],
        [['patch', true, 'rc', '0.0.0', ['0.1.0-alpha.0', '0.0.1-alpha.0']], '0.0.1-rc.0'],
        [['minor', true, 'rc', '0.0.0', ['0.1.0-alpha.0', '0.0.1-alpha.0']], '0.1.0-rc.0'],
        [['major', true, 'rc', '0.0.0', ['0.1.0-alpha.0', '0.0.1-alpha.0']], '1.0.0-rc.0'],
    ])(
        'when args=%j then returns %p',
        async ([type, prerelease, prereleaseId, fallbackVersion, versions], expected) => {
            const result = await bumpVersion(
                type as Type,
                prerelease as Prerelease,
                prereleaseId as PrereleaseId,
                fallbackVersion as string,
                versions as string[],
            )

            expect(result).toEqual(expected)
        },
    )
})
