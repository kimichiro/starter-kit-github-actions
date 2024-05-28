# Create Github Release

Create new release through GitHub REST API by following instruction below.
- Push new tag `tag-name` onto origin (skip if exists).
- Create new release with generated release notes.
- On any failure, delete tag if push previously.

> [!NOTE] Limitation
> - This action cannot push a protected tag due to security concerns in [this discussion](https://github.com/orgs/community/discussions/68419).

## Usage

```yml
- uses: actions/checkout@v4
- uses: ./.github/actions/create-github-release
  with:
    tag-name: release/1.2.3-rc.4
    prerelease: true
    title: Release title instead of tag name
    body: Description of the release
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

## Inputs

- `tag-name` - **required** Tag name uses to create the release.
- `prerelease` - Whether to create release with prerelease. _Default_: `true`
- `title` - Title of the release.
- `body` - Description of the release.

## Outputs

- `release-url` - The GitHub url to newly created release page.

## Env

- `GITHUB_TOKEN` - The authentication token to access GitHub REST API (Releases)
