# Github Actions Starter Kit

Provide reusable workflows and actions for [GitHub Actions][github-actions-link].

_**Workflows**_

- [![Publish Prerelease][publish-prerelease-badge]][publish-prerelease-link]
- [![Publish Release][publish-release-badge]][publish-release-link]
- [![Deploy NPM package][deploy-npm-badge]][deploy-npm-link]

_**Actions**_

- [![Bump Semantic Version][bump-semantic-version-badge]][bump-semantic-version-link]
- [![Create GitHub Release][create-github-release-badge]][create-github-release-link]
- [![Build and Test (Npm)][build-test-npm-badge]][build-test-npm-link]
- [![Publish Npm Package][publish-npm-badge]][publish-npm-link]
- [![Expand URI Template (RFC 6570)][expand-uri-template-badge]][expand-uri-template-link]
- [![Upload Asset to GitHub Release][upload-github-release-asset-badge]][upload-github-release-asset-link]

## Workflows

### [Publish Prerelease][publish-prerelease-link]

Bump version, tagging and create new release as pre-release

#### Triggers

- On pull request closed with branch merged
- On manual event dispatch

#### Inputs

- `release-type` - **required** Release type used in version resolution (one of `major`, `minor` or `patch`)
- `tag-prefix` - Tag prefix used in parsing git tag for semantic version

#### Secrets

- `STARTER_KIT_ACTIONS_TOKEN` - **required** GitHub personal access token with following permission
  - contents: write

### [Publish Release][publish-release-link]

Bump version, tagging and create new release

#### Triggers

- On manual event dispatch with prerelease version specified

#### Inputs

- `release-type` - **required** Release type used in version resolution (one of `major`, `minor` or `patch`)
- `tag-prefix` - Tag prefix used in parsing git tag for semantic version

#### Secrets

- `STARTER_KIT_ACTIONS_TOKEN` - **required** GitHub personal access token with following permission
  - contents: write

### [Deploy NPM package][deploy-npm-link]

Build, test, publish npm package to registry and also upload packed contents to related GitHub Release

#### Triggers

- On release event with `published` type

#### Inputs

- `tag-name` - **required** Release tag name
- `tag-prefix` - Tag prefix for version resolution
- `npm-registry-url` - **required** Npm registry url
- `npm-package-scope` - Npm package scope without '@'
- `release-upload-url` - **required** Release asset upload uri template

#### Secrets

- `STARTER_KIT_ACTIONS_TOKEN` - **required** GitHub personal access token with following permission
  - contents: write

## Actions

### [Bump Semantic Version][bump-semantic-version-link]

Bump semantic version based on the most recent version extracted from Git tags.
- Traverse back in Git history to find the first commit with tags.
- Filter tags with `tag-prefix` and convert them to semantic versions.
- Find the highest version and use it as base version, use `fallback-version` if no version found.
- Bump version on top of the base version in respect to `type`, `prerelease` and `prerelease-id`.

### [Create GitHub Release][create-github-release-link]

Create new release through GitHub REST API by following instruction below.
- Push new tag `tag-name` onto origin (skip if exists).
- Create new release with generated release notes.
- On any failure, delete tag if push previously.

### [Build and Test (Npm)][build-test-npm-link]

Run build and test on npm package.
- Update package version with given `version` input.
- Clean install dependency packages without modifying `package-lock.json`.
- Build and test package, prerequisites must be provided by package owner.
- Pack package content into a zip file only if `pack` input is set to `true`.

### [Publish Npm Package][publish-npm-link]

Publish npm package.
- Setup registry with authentication token.
- Publish package to registry.

### [Expand URI Template (RFC 6570)][expand-uri-template-link]

Expand uri template as implementation for RFC 6570
- Read environment variables with prefix `TEMPLATE_VAR_`
- Pass variables as context to template
- Expand uri template and return as url

### [Upload Asset to GitHub Release][upload-github-release-asset-link]

Upload an asset files to GitHub Release
- Expand uri template with variables to a url
- Make a REST API request to upload asset to GitHub Release

<!-- Markdown Images and Links -->

[github-actions-link]: https://github.com/features/actions

[publish-prerelease-badge]: https://img.shields.io/badge/publish--prerelease-181717?logo=githubactions&color=white
[publish-prerelease-link]: https://github.com/kimichiro/starter-kit-github-actions/tree/main/.github/workflows/publish-prerelease.yml
[publish-release-badge]: https://img.shields.io/badge/publish--release-181717?logo=githubactions&color=white
[publish-release-link]: https://github.com/kimichiro/starter-kit-github-actions/tree/main/.github/workflows/publish-release.yml
[deploy-npm-badge]: https://img.shields.io/badge/deploy--npm-181717?logo=githubactions&color=white
[deploy-npm-link]: https://github.com/kimichiro/starter-kit-github-actions/tree/main/.github/workflows/deploy-npm.yml

[bump-semantic-version-badge]: https://img.shields.io/badge/bump--semantic--version-181717?logo=githubactions&color=white
[bump-semantic-version-link]: https://github.com/kimichiro/starter-kit-github-actions/tree/main/.github/actions/bump-semantic-version
[create-github-release-badge]: https://img.shields.io/badge/create--github--release-181717?logo=githubactions&color=white
[create-github-release-link]: https://github.com/kimichiro/starter-kit-github-actions/tree/main/.github/actions/create-github-release
[build-test-npm-badge]: https://img.shields.io/badge/build--test--npm-181717?logo=githubactions&color=white
[build-test-npm-link]: https://github.com/kimichiro/starter-kit-github-actions/tree/main/.github/actions/build-test-npm
[publish-npm-badge]: https://img.shields.io/badge/publish--npm-181717?logo=githubactions&color=white
[publish-npm-link]: https://github.com/kimichiro/starter-kit-github-actions/tree/main/.github/actions/publish-npm
[expand-uri-template-badge]: https://img.shields.io/badge/expand--uri--template-181717?logo=githubactions&color=white
[expand-uri-template-link]: https://github.com/kimichiro/starter-kit-github-actions/tree/main/.github/actions/expand-uri-template
[upload-github-release-asset-badge]: https://img.shields.io/badge/upload--github--release--asset-181717?logo=githubactions&color=white
[upload-github-release-asset-link]: https://github.com/kimichiro/starter-kit-github-actions/tree/main/.github/actions/upload-github-release-asset
