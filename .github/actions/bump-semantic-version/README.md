# Bump NPM Version

Bump npm package version in semantic version convention

## Inputs

### `who-to-greet`

**Required** The name of the person to greet. Default `"World"`.

## Outputs

### `time`

The time we greeted you.

## Example usage

```yaml
uses: ./.github/actions/bump-npm-version
with:
  who-to-greet: 4
```
