# Github Actions Starter Kit

Provide reusable workflows and actions for [GitHub Actions][github-actions-link].

Workflows:

[![Publish Prerelease][publish-prerelease-badge]][publish-prerelease-link]
[![Publish Release][publish-release-badge]][publish-release-link]

Actions:

[![Bump Semantic Version][bump-semantic-version-badge]][bump-semantic-version-link]
[![Create GitHub Release][create-github-release-badge]][create-github-release-link]

## Workflows

### [Publish Prerelease][publish-prerelease-link]

Triggers:
- On pull request closed with branch merged
- On manual event dispatch

Jobs:
- Bump version, tagging and create new release

### [Publish Release][publish-release-link]

Triggers:
- On manual event dispatch with prerelease version specified

Jobs:
- Bump version, tagging and create new release

## Actions

### [Bump Semantic Version][bump-semantic-version-link]

- Find the highest semantic version with filters from git history of the checkout branch.
- Increment semantic version to major/minor/patch or prerelease number.

### [Create GitHub Release][create-github-release-link]

- Push new tag onto origin.
- Create new release with generated release notes.

<!-- Markdown Images and Links -->

[github-actions-link]: https://github.com/features/actions

[publish-prerelease-badge]: https://img.shields.io/badge/publish--prerelease-181717?logo=githubactions
[publish-prerelease-link]: https://github.com/kimichiro/starter-kit-github-actions/tree/main/.github/workflows/publish-prerelease.yml
[publish-release-badge]: https://img.shields.io/badge/publish--release-181717?logo=githubactions
[publish-release-link]: https://github.com/kimichiro/starter-kit-github-actions/tree/main/.github/workflows/publish-release.yml

[bump-semantic-version-badge]: https://img.shields.io/badge/bump--semantic--version-181717?logo=githubactions
[bump-semantic-version-link]: https://github.com/kimichiro/starter-kit-github-actions/tree/main/.github/actions/bump-semantic-version
[create-github-release-badge]: https://img.shields.io/badge/create--github--release-181717?logo=githubactions
[create-github-release-link]: https://github.com/kimichiro/starter-kit-github-actions/tree/main/.github/actions/create-github-release
