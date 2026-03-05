# Backstage UI Docs

Backstage UI is our internal UI library built for Backstage. We built this website to document the library and its components. You can view this website [here](https://ui.backstage.io).

## How to run locally

This website is built with Next.js and it is hosted on Github pages. To run it locally, you can run the following command:

```bash
yarn start
```

## Deployment

Deployments are done automatically when a PR is merged into the `master` branch. We host the website using Github pages.

## Maintaining Component Changelogs

After a `@backstage/ui` release, sync the component changelogs to keep documentation up-to-date:

```bash
yarn sync:changelog
```

This script:

- Parses `packages/ui/CHANGELOG.md` for new versions
- Extracts entries tagged with "Affected components: ..."
- Updates `src/utils/changelog.ts` with new entries
- Handles both component-specific and general package changes

After running, review the changes in `src/utils/changelog.ts` and commit them.

**Preview changes before writing:**

```bash
yarn sync:changelog:dry-run
```

Running this gives you a summary of what would be written, without actually adding or changing any files.
