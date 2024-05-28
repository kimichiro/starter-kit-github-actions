# Bump Semantic Version

Bump semantic version based on the most recent version extracted from Git tags.
- Traverse back in Git history to find the first commit with tags.
- Filter tags with `tag-prefix` and convert them to semantic versions.
- Find the highest version and use it as base version, use `fallback-version` if no version found.
- Bump version on top of the base version in respect to `type`, `prerelease` and `prerelease-id`.

## Usage

```yml
- uses: actions/checkout@v4
- uses: ./.github/actions/bump-npm-version
  with:
    type: minor
    prerelease: true
    prerelease-id: alpha
    tag-prefix: v
    fallback-version: 1.0.0
```

## Inputs

- `type` - Type of version number in semantic version to bump, one of [`major`, `minor`, `patch`]. _Default_: `patch`
- `prerelease` - Whether to bump version as a pre-release. _Default_: `true`
- `prerelease-id` - Prerelease version suffix i.e. `x.y.z-rc.n`. _Default_: `rc`
- `tag-prefix` - Git tag prefix to match for the most recent version.
- `fallback-version` - Fallback version to use if no tags found. _Default_: `0.0.0`

## Outputs

- `version` - The bump semantic version.
