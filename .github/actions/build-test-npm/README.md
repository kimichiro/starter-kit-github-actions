# Build and Test (Npm)

Run build and test on npm package.
- Update package version with given `version` input.
- Clean install dependency packages without modifying `package-lock.json`.
- Build and test package, prerequisites must be provided by package owner.
- Pack package content into a zip file only if `pack` input is set to `true`.

## Usage

```yml
- uses: actions/checkout@v4
- uses: actions/setup-node@v4
- uses: ./.github/actions/build-test-npm
  with:
    version: 1.0.0
    pack: true
```

## Inputs

- `version` - Semantic version to be set as npm package version, skip if unset.
- `pack` - Whether to pack a package in zip file. _Default_: `false`

## Outputs

- `package-name` - Package file name.
