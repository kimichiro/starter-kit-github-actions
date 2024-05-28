import * as core from '@actions/core'
import joi from 'joi'

const inputNames = {
    type: 'type',
    prerelease: 'prerelease',
    prereleaseId: 'prerelease-id',
    tagPrefix: 'tag-prefix',
    fallbackVersion: 'fallback-version',
}

const typeSchema = joi
    .string()
    .valid('major', 'minor', 'patch')
    .default('patch')
    .messages({
        'string.base': `'${inputNames.type}' should be a type of string`,
        'string.empty': `'${inputNames.type}' must be one of 'major', 'minor' or 'patch'`,
        'any.only': `'${inputNames.type}' must be one of 'major', 'minor' or 'patch'`,
    })
const prereleaseSchema = joi
    .boolean()
    .default(true)
    .messages({
        'boolean.base': `'${inputNames.prerelease}' should be one of true or false`,
    })
const prereleaseIdSchema = joi
    .string()
    .default('rc')
    .messages({
        'string.base': `'${inputNames.prereleaseId}' should be a type of string`,
        'string.empty': `'${inputNames.prereleaseId}' must not be empty string`,
    })
const tagPrefixSchema = joi
    .string()
    .allow('', null)
    .messages({
        'string.base': `'${inputNames.tagPrefix}' should be a type of string`,
    })
const fallbackVersionSchema = joi
    .string()
    .pattern(/^[0-9]+(\.[0-9]+(\.[0-9]+)?)?$/, 'numbers')
    .default('0.0.0')
    .messages({
        'string.base': `'${inputNames.fallbackVersion}' should be a type of string`,
        'string.empty': `'${inputNames.fallbackVersion}' must be a valid semantic version`,
        'string.pattern.base': `'${inputNames.fallbackVersion}' must be a valid semantic version`,
    })

export type Type = 'major' | 'minor' | 'patch'
export type Prerelease = boolean
export type PrereleaseId = string
export type TagPrefix = string
export type FallbackVersion = string

export function getType(): Type {
    const type = core.getInput(inputNames.type)
    core.info(`${inputNames.type}: ${JSON.stringify(type)}`)
    joi.assert(type, typeSchema)
    return type as Type
}

export function getPreRelease(): Prerelease {
    const prerelease = core.getBooleanInput(inputNames.prerelease)
    core.info(`${inputNames.prerelease}: ${JSON.stringify(prerelease)}`)
    joi.assert(prerelease, prereleaseSchema)
    return prerelease
}

export function getPreReleaseId(): PrereleaseId {
    const prereleaseId = core.getInput(inputNames.prereleaseId)
    core.info(`${inputNames.prereleaseId}: ${JSON.stringify(prereleaseId)}`)
    joi.assert(prereleaseId, prereleaseIdSchema)
    return prereleaseId
}

export function getTagPrefix(): TagPrefix {
    const tagPrefix = core.getInput(inputNames.tagPrefix)
    core.info(`${inputNames.tagPrefix}: ${JSON.stringify(tagPrefix)}`)
    joi.assert(tagPrefix, tagPrefixSchema)
    return tagPrefix
}

export function getFallbackVersion(): FallbackVersion {
    const fallbackVersion = core.getInput(inputNames.fallbackVersion)
    core.info(
        `${inputNames.fallbackVersion}: ${JSON.stringify(fallbackVersion)}`,
    )
    joi.assert(fallbackVersion, fallbackVersionSchema)
    return fallbackVersion
}
