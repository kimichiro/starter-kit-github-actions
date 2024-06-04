import { afterAll, beforeEach, describe, expect, jest, test } from '@jest/globals'

import { expandUriTemplate } from '../src/uri-template'

jest.mock('@actions/core')

describe('expandUriTemplate()', () => {
    const processEnv = process.env

    beforeEach(() => {
        jest.resetModules()
        process.env = { ...processEnv }
    })

    afterAll(() => {
        process.env = processEnv
    })

    // Due to issue 'TypeError: A dynamic import callback was invoked without --experimental-vm-modules'
    // There's known [issue](https://github.com/prettier/prettier/issues/15769).
    // As it was quoted to solve this issue in v30, this test is temporarily disabled.
    test(`This test is disabled due to 'https://github.com/prettier/prettier/issues/15769'`, () => {})
    // test.each([
    //     [['http://example.org/{file}'], { TEMPLATE_VAR_file: 'hello.txt' }, 'http://example.org/hello.txt'],
    // ])('when args=%j with env=%p then returns %p', async ([uriTemplate], env, expected) => {
    //     process.env = env

    //     const result = await expandUriTemplate(uriTemplate)

    //     expect(result).toEqual(expected)
    // })
})
