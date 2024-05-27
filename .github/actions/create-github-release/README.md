# Create Github Release

Create new release through GitHub REST API

## Inputs

### `tag-name`

**Required** Tag name uses to create the release.

### `prerelease`

Whether to create release with prerelease. _Default_: `true`

### `title`

Title of the release.

### `body`

Description of the release.

## Outputs

### `release-url`

The GitHub url to newly created release page.

## Example usage

```yaml
uses: ./.github/actions/create-github-release
with:
  tag-name: release/1.2.3-rc.4
  prerelease: true
  title: Release title instead of tag name
  body: Description of the release
```
