import { describe, expect, jest, test } from '@jest/globals'

import { TagName } from '../src/input'
import { getRemoteInfo } from '../src/git'

jest.mock('@actions/core')
jest.mock('simple-git', () => ({
    default: jest.fn(),
    simpleGit: jest.fn(() => mockSimpleGit),
}))

const mockSimpleGit = {
    remote: jest.fn(() => Promise.resolve('')),
}

describe('getRemoteInfo()', () => {
    test.each([
        ['', undefined],
        ['https://github.com/sample-owner/sample-repo', undefined],
        [
            'https://github.com/sample-owner/sample-repo.git',
            { owner: 'sample-owner', repo: 'sample-repo' },
        ],
        [
            '   https://github.com/sample-owner/sample-repo.git   ',
            { owner: 'sample-owner', repo: 'sample-repo' },
        ],
    ])('when (arg0=%p) then returns %p', async (gitUrl, expected) => {
        mockSimpleGit.remote.mockResolvedValueOnce('origin')
        mockSimpleGit.remote.mockResolvedValueOnce(gitUrl as string)

        const result = await getRemoteInfo()

        expect(result).toEqual(expected)
    })
})
