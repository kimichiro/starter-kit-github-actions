import * as core from '@actions/core'
import * as process from 'process'

const ENV_PREFIX = 'TEMPLATE_VAR_'

export async function expandUriTemplate(uriTemplate: string): Promise<string> {
    const { parseTemplate } = await import('url-template')
    const template = parseTemplate(uriTemplate)

    const context = Object.keys(process.env).reduce((ctx, envName) => {
        if (!envName.startsWith(ENV_PREFIX)) {
            return ctx
        }

        const ctxName = envName.substring(ENV_PREFIX.length)
        const ctxValue = process.env[envName]
        core.debug(`${ctxName}: ${JSON.stringify(ctxValue)}`)

        return !ctxValue ? ctx : { ...ctx, [ctxName]: ctxValue }
    }, {})

    const url = template.expand(context)

    return url
}
