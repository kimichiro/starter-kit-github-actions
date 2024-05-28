
## GitHub Flow Development Pipeline
![GitHub Flow Diagram](/assets/github-flow-diagram.svg)
1. (*Manually*) Push changes, require to setup branch protection as follows
   -  for branch `feature/*`, open for each `developer`
   -  for branch `main`, allow for `repo admin`, `release admin`
2. Trigger pullrequest workflow
    ```
    on:
      push:
        branches:
          - 'feature/**'
    ```
   1. Verify source branch and target branch
      -  When source branch is `feature/*`, target branch must be `main`
   2. Create pullrequest from template with instructions for `developer`
3. Trigger CI workflow
    ```
    on:
      push:
        branches:
          - 'main'
          - 'feature/**'
    ```
   1. Run test
      -  For Node,
         - `npm ci`
         - `npm run build`
         - `npm run lint`
         - `npm test`
   2. Publish status check
   3. Report code analysis as comments
      - Code Coverage
      - Code Analysis
      - Dependencies Analysis
4. (*Manually*) Review & merge feature pullrequest
5. Trigger prerelease workflow
    ```
    on:
      push:
        branches:
          - 'main'
      pull_request:
        types:
          - closed
        branches:
          - 'main'
    ```
   1. Bump version as `$PRERELEASE`
   2. Create tag named as `release/$PRERELEASE` on merged commit
   3. Create release from template with changes log and prerelease flag
6. (*Manually*) Trigger release workflow
    ```
    on:
      workflow_dispatch:
    ```
   1. Bump version as `$RELEASE`
   2. Create tag named as `release/$RELEASE` on selected commit
   3. Create release from template with changes log
7. Trigger CD workflow
    ```
    on:
      release:
        types: [published]
    ```
   1. Deploy app server
   2. Publish app package
   3. Publish lib package
      - For NPM,
        - `npm pkg set version=$VERSION`, where `$GITHUB_REF=refs/tags/$VERSION`
        - `npm publish`
