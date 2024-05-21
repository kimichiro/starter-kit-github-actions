# Hello world javascript action

This action prints "Hello World" or "Hello" + the name of a person to greet to the log.

## Inputs

### `required`

**Required** Just a required input. Default `"required"`.

### `optional`

Just an optional input. Default `"optional"`.

## Outputs

### `result`

The resulting output

## Example usage

```yaml
uses: ./.github/actions/sample-javascript-action
with:
    required: some-important-value
    optional: some-random-value
```
