# Publish Npm Package

Publish npm package.
- Setup registry with authentication token.
- Publish package to registry.

## Usage

```yml
- uses: actions/checkout@v4
- uses: actions/setup-node@v4
- uses: ./.github/actions/publish-npm
  with:
    registry-url: https://npm.pkg.github.com/
    scope: hello-world
```

## Inputs

- `registry-url` - _**required** _Npm package registry to publish a package to.
- `scope` - Package scope associated with registry-url.

## Environments

- `NODE_AUTH_TOKEN` - authentication token to npm registry (e.g. secrets.GITHUB_TOKEN or GitHub personal access token with permission packages: write)
