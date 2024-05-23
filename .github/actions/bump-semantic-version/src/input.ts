import * as core from '@actions/core'
import joi from 'joi'

const typeSchema = joi
    .string()
    .valid('major', 'minor', 'patch')
    .default('patch')
const preReleaseSchema = joi.boolean().default(true)
const preReleaseIdSchema = joi.string().default('rc')
const tagPrefixSchema = joi.string().allow('', null)

export type Type = 'major' | 'minor' | 'patch'
export type Prerelease = boolean
export type PrereleaseId = string
export type TagPrefix = string

export function getType(): Type {
    const type = core.getInput('type') as Type
    core.info(`inputs.type=${JSON.stringify(type)}`)
    joi.assert(type, typeSchema)
    return type
}

export function getPreRelease(): Prerelease {
    const preRelease = Boolean(core.getInput('prerelease')) as Prerelease
    core.info(`inputs.prerelease=${JSON.stringify(preRelease)}`)
    joi.assert(preRelease, preReleaseSchema)
    return preRelease
}

export function getPreReleaseId(): PrereleaseId {
    const preReleaseId = core.getInput('prerelease-id') as PrereleaseId
    core.info(`inputs.prerelease-id=${JSON.stringify(preReleaseId)}`)
    joi.assert(preReleaseId, preReleaseIdSchema)
    return preReleaseId
}

export function getTagPrefix(): TagPrefix {
    const tagPrefix = core.getInput('tag-prefix') as TagPrefix
    core.info(`inputs.tag-prefix=${JSON.stringify(tagPrefix)}`)
    joi.assert(tagPrefix, tagPrefixSchema)
    return tagPrefix
}
