import * as core from '@actions/core'
import joi from 'joi'

const inputNames = {
    tagName: 'tag-name',
    prerelease: 'prerelease',
    title: 'title',
    body: 'body',
}

const tagNameSchema = joi.string().messages({
    'string.base': `'${inputNames.tagName}' should be a type of string`,
    'string.empty': `'${inputNames.tagName}' must not be empty string`,
})
const prereleaseSchema = joi
    .boolean()
    .default(true)
    .messages({
        'boolean.base': `'${inputNames.prerelease}' should be one of true or false`,
    })
const titleSchema = joi
    .string()
    .allow('', null)
    .messages({
        'string.base': `'${inputNames.title}' should be a type of string`,
    })
const bodySchema = joi
    .string()
    .allow('', null)
    .messages({
        'string.base': `'${inputNames.body}' should be a type of string`,
    })

export type TagName = string
export type Prerelease = boolean
export type Title = string
export type Body = string

export function getTagName(): TagName {
    const tagName = core.getInput(inputNames.tagName)
    core.info(`inputs.${inputNames.tagName}=${JSON.stringify(tagName)}`)
    joi.assert(tagName, tagNameSchema)
    return tagName as TagName
}

export function getPrerelease(): Prerelease {
    const prerelease = core.getInput(inputNames.prerelease)
    core.info(`inputs.${inputNames.prerelease}=${JSON.stringify(prerelease)}`)
    joi.assert(prerelease, prereleaseSchema)
    return Boolean(prerelease)
}

export function getTitle(): Title {
    const title = core.getInput(inputNames.title)
    core.info(`inputs.${inputNames.title}=${JSON.stringify(title)}`)
    joi.assert(title, titleSchema)
    return title
}

export function getBody(): Body {
    const body = core.getInput(inputNames.body)
    core.info(`inputs.${inputNames.body}=${JSON.stringify(body)}`)
    joi.assert(body, bodySchema)
    return body
}
