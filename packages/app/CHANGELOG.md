# example-app

## 0.2.3

### Patch Changes

- 475fc0aaa: Using the search field in the sidebar now navigates to the search result page.
- Updated dependencies [475fc0aaa]
- Updated dependencies [1166fcc36]
- Updated dependencies [29a0ccab2]
- Updated dependencies [8e6728e25]
- Updated dependencies [c93a14b49]
- Updated dependencies [ef2831dde]
- Updated dependencies [2a71f4bab]
- Updated dependencies [1185919f3]
- Updated dependencies [a8de7f554]
- Updated dependencies [faf311c26]
- Updated dependencies [31d8b6979]
- Updated dependencies [991345969]
- Updated dependencies [475fc0aaa]
  - @backstage/core@0.3.2
  - @backstage/catalog-model@0.3.0
  - @backstage/plugin-kubernetes@0.3.0
  - @backstage/cli@0.3.1
  - @backstage/plugin-cost-insights@0.4.1
  - @backstage/plugin-scaffolder@0.3.1
  - @backstage/plugin-register-component@0.2.2
  - @backstage/plugin-circleci@0.2.2
  - @backstage/plugin-search@0.2.1
  - @backstage/plugin-api-docs@0.2.2
  - @backstage/plugin-catalog@0.2.3
  - @backstage/plugin-cloudbuild@0.2.2
  - @backstage/plugin-github-actions@0.2.2
  - @backstage/plugin-jenkins@0.3.1
  - @backstage/plugin-lighthouse@0.2.3
  - @backstage/plugin-rollbar@0.2.3
  - @backstage/plugin-sentry@0.2.3
  - @backstage/plugin-techdocs@0.2.3

## 0.2.2

### Patch Changes

- 3efd03c0e: Removed obsolete CircleCI proxy config from example-app
- Updated dependencies [1722cb53c]
- Updated dependencies [1722cb53c]
- Updated dependencies [17a9f48f6]
- Updated dependencies [4040d4fcb]
- Updated dependencies [f360395d0]
- Updated dependencies [259d848ee]
- Updated dependencies [8b7737d0b]
- Updated dependencies [902340451]
  - @backstage/cli@0.3.0
  - @backstage/core@0.3.1
  - @backstage/plugin-cost-insights@0.4.0
  - @backstage/plugin-lighthouse@0.2.2
  - @backstage/plugin-rollbar@0.2.2
  - @backstage/plugin-sentry@0.2.2
  - @backstage/plugin-techdocs@0.2.2
  - @backstage/plugin-user-settings@0.2.2
  - @backstage/plugin-catalog@0.2.2
  - @backstage/test-utils@0.1.3

## 0.2.1

### Patch Changes

- Updated dependencies [7b37d65fd]
- Updated dependencies [4aca74e08]
- Updated dependencies [a41730c6e]
- Updated dependencies [9a294574c]
- Updated dependencies [0703edee0]
- Updated dependencies [e8f69ba93]
- Updated dependencies [0c0798f08]
- Updated dependencies [5a2705de2]
- Updated dependencies [0c0798f08]
- Updated dependencies [84b654d5d]
- Updated dependencies [0c0798f08]
- Updated dependencies [199237d2f]
- Updated dependencies [6627b626f]
- Updated dependencies [3f05616bf]
- Updated dependencies [803527bd3]
- Updated dependencies [4577e377b]
- Updated dependencies [2d0bd1be7]
- Updated dependencies [59166e5ec]
- Updated dependencies [a906f20e7]
  - @backstage/core@0.3.0
  - @backstage/plugin-jenkins@0.3.0
  - @backstage/plugin-cost-insights@0.3.0
  - @backstage/plugin-user-settings@0.2.1
  - @backstage/plugin-api-docs@0.2.1
  - @backstage/plugin-tech-radar@0.3.0
  - @backstage/theme@0.2.1
  - @backstage/plugin-catalog@0.2.1
  - @backstage/plugin-scaffolder@0.3.0
  - @backstage/plugin-circleci@0.2.1
  - @backstage/plugin-cloudbuild@0.2.1
  - @backstage/plugin-explore@0.2.1
  - @backstage/plugin-gcp-projects@0.2.1
  - @backstage/plugin-github-actions@0.2.1
  - @backstage/plugin-gitops-profiles@0.2.1
  - @backstage/plugin-graphiql@0.2.1
  - @backstage/plugin-kubernetes@0.2.1
  - @backstage/plugin-lighthouse@0.2.1
  - @backstage/plugin-newrelic@0.2.1
  - @backstage/plugin-register-component@0.2.1
  - @backstage/plugin-rollbar@0.2.1
  - @backstage/plugin-sentry@0.2.1
  - @backstage/plugin-techdocs@0.2.1
  - @backstage/plugin-welcome@0.2.1

## 0.2.0

### Minor Changes

- 6d97d2d6f: The InfoCard variant `'height100'` is deprecated. Use variant `'gridItem'` instead.

  When the InfoCard is displayed as a grid item within a grid, you may want items to have the same height for all items.
  Set to the `'gridItem'` variant to display the InfoCard with full height suitable for Grid:
  `<InfoCard variant="gridItem">...</InfoCard>`

  Changed the InfoCards in '@backstage/plugin-github-actions', '@backstage/plugin-jenkins', '@backstage/plugin-lighthouse'
  to pass an optional variant to the corresponding card of the plugin.

  As a result the overview content of the EntityPage shows cards with full height suitable for Grid.

### Patch Changes

- 65d722455: Add Pull Request tab to components view.
- 26e69ab1a: Remove cost insights example client from demo app and export from plugin
  Create cost insights dev plugin using example client
  Make PluginConfig and dependent types public
- e7f5471fd: cleaning up because external plugins have already implemented new api for creating
- Updated dependencies [28edd7d29]
- Updated dependencies [819a70229]
- Updated dependencies [2846ef95c]
- Updated dependencies [3a4236570]
- Updated dependencies [ae5983387]
- Updated dependencies [0d4459c08]
- Updated dependencies [d67c529ab]
- Updated dependencies [482b6313d]
- Updated dependencies [e0be86b6f]
- Updated dependencies [f70a52868]
- Updated dependencies [12b5fe940]
- Updated dependencies [8351ad79b]
- Updated dependencies [30dd11122]
- Updated dependencies [1297dcb3a]
- Updated dependencies [368fd8243]
- Updated dependencies [fb74f1db6]
- Updated dependencies [3472c8be7]
- Updated dependencies [cab473771]
- Updated dependencies [1d0aec70f]
- Updated dependencies [1c60f716e]
- Updated dependencies [a73979d45]
- Updated dependencies [144c66d50]
- Updated dependencies [a768a07fb]
- Updated dependencies [a3840bed2]
- Updated dependencies [339668995]
- Updated dependencies [b79017fd3]
- Updated dependencies [6d97d2d6f]
- Updated dependencies [5adfc005e]
- Updated dependencies [f0aa01bcc]
- Updated dependencies [8d1360aa9]
- Updated dependencies [72f6cda35]
- Updated dependencies [0ee9e9f66]
- Updated dependencies [5c70f3d35]
- Updated dependencies [bb48b9833]
- Updated dependencies [fd8384d7e]
- Updated dependencies [8c2b76e45]
- Updated dependencies [0aecfded0]
- Updated dependencies [93a3fa3ae]
- Updated dependencies [782f3b354]
- Updated dependencies [c5ef12926]
- Updated dependencies [8b9c8196f]
- Updated dependencies [2713f28f4]
- Updated dependencies [6a84cb072]
- Updated dependencies [406015b0d]
- Updated dependencies [82759d3e4]
- Updated dependencies [60d40892c]
- Updated dependencies [cba4e4d97]
- Updated dependencies [ac8d5d5c7]
- Updated dependencies [2ebcfac8d]
- Updated dependencies [4fc1d440e]
- Updated dependencies [fa56f4615]
- Updated dependencies [8afce088a]
- Updated dependencies [4512b9967]
- Updated dependencies [ebca83d48]
- Updated dependencies [aca79334f]
- Updated dependencies [c0d5242a0]
- Updated dependencies [b3d57961c]
- Updated dependencies [9a3b3dbf1]
- Updated dependencies [e7d4ac7ce]
- Updated dependencies [0b956f21b]
- Updated dependencies [1c8c43756]
- Updated dependencies [0e67c6b40]
- Updated dependencies [26e69ab1a]
- Updated dependencies [97c2cb19b]
- Updated dependencies [02c60b5f8]
- Updated dependencies [3beb5c9fc]
- Updated dependencies [754e31db5]
- Updated dependencies [57b54c8ed]
- Updated dependencies [1611c6dbc]
- Updated dependencies [7bbeb049f]
  - @backstage/cli@0.2.0
  - @backstage/plugin-api-docs@0.2.0
  - @backstage/plugin-catalog@0.2.0
  - @backstage/plugin-circleci@0.2.0
  - @backstage/plugin-explore@0.2.0
  - @backstage/plugin-gcp-projects@0.2.0
  - @backstage/plugin-github-actions@0.2.0
  - @backstage/plugin-gitops-profiles@0.2.0
  - @backstage/plugin-graphiql@0.2.0
  - @backstage/plugin-jenkins@0.2.0
  - @backstage/plugin-kubernetes@0.2.0
  - @backstage/plugin-lighthouse@0.2.0
  - @backstage/plugin-newrelic@0.2.0
  - @backstage/plugin-register-component@0.2.0
  - @backstage/plugin-rollbar@0.2.0
  - @backstage/plugin-scaffolder@0.2.0
  - @backstage/plugin-sentry@0.2.0
  - @backstage/plugin-tech-radar@0.2.0
  - @backstage/plugin-techdocs@0.2.0
  - @backstage/plugin-welcome@0.2.0
  - @backstage/core@0.2.0
  - @backstage/plugin-cloudbuild@0.2.0
  - @backstage/catalog-model@0.2.0
  - @backstage/theme@0.2.0
  - @backstage/plugin-cost-insights@0.2.0
  - @backstage/plugin-user-settings@0.2.0
  - @backstage/test-utils@0.1.2
