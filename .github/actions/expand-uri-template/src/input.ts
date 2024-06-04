import * as core from '@actions/core'
import joi from 'joi'

const inputNames = {
    uriTemplate: 'uri-template',
}

const uriTemplateSchema = joi
    .string()
    .messages({
        'string.base': `'${inputNames.uriTemplate}' should be a type of string`,
        'string.empty': `'${inputNames.uriTemplate}' must not be empty string`,
    })

export type UriTemplate = string

export function getUriTemplate(): UriTemplate {
    const type = core.getInput(inputNames.uriTemplate)
    core.info(`${inputNames.uriTemplate}: ${JSON.stringify(type)}`)
    joi.assert(type, uriTemplateSchema)
    return type as UriTemplate
}
