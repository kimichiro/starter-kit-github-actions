# Bump Semantic Version

Expand uri template as implementation for RFC 6570
- Read environment variables with prefix `TEMPLATE_VAR_`
- Pass variables as context to template
- Expand uri template and return as url

## Usage

```yml
- uses: ./.github/actions/expand-uri-template
  with:
    uri-template: http://example.org/{file}
  env:
    TEMPLATE_VAR_file: hello.txt
```

## Inputs

- `uri-template` - Uri template to be expanded

## Environments

- `TEMPLATE_VAR_<variable-name>` - variables use in expanding uri template

## Outputs

- `url` - Url expanded from uri template
