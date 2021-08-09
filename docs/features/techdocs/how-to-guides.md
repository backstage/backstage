---
id: how-to-guides
title: TechDocs "HOW TO" guides
sidebar_label: "HOW TO" guides
description: TechDocs "HOW TO" guides related to TechDocs
---

## How to migrate from TechDocs Basic to Recommended deployment approach?

The main difference between TechDocs Basic and Recommended deployment approach
is where the docs are generated and stored. In Basic or the out-of-the-box
setup, docs are generated and stored at the server running your Backstage
instance. But the recommended setup is to generate docs on CI/CD and store the
generated sites to an external storage (e.g. AWS S3 or GCS). TechDocs in your
Backstage instance should turn into read-only mode. Read more details and the
benefits in the [TechDocs Architecture](architecture.md).

Here are the steps needed to switch from the Basic to Recommended setup -

### 1. Prepare a cloud storage

Choose a cloud storage provider like AWS, Google Cloud or Microsoft Azure.
Follow the detailed instructions for
[using cloud storage](using-cloud-storage.md) in TechDocs.

### 2. Publish to storage from CI/CD

Start publishing your TechDocs sites from the CI/CD workflow of each repository
containing the source markdown files. Read the detailed instructions for
[configuring CI/CD](configuring-ci-cd.md).

### 3. Switch TechDocs to read-only mode

In your Backstage instance's `app-config.yaml`, set `techdocs.builder` from
`'local'` to `'external'`. By doing this, TechDocs will not try to generate
docs. Look at [TechDocs configuration](configuration.md) for reference.

## How to understand techdocs-ref annotation values

If TechDocs is configured to generate docs, it will first download source files
based on the value of the `backstage.io/techdocs-ref` annotation defined in the
Entity's `catalog-info.yaml` file. This is also called the
[Prepare](./concepts.md#techdocs-preparer) step.

We strongly recommend that the `backstage.io/techdocs-ref` annotation in each
documented catalog entity's `catalog-info.yaml` be set to `dir:.` in almost all
situations. This is because TechDocs is aligned with the "docs like code"
philosophy, whereby documentation should be authored and managed alongside the
source code of the underlying software itself.

When you see `dir:.`, you can translate it to mean:

- That the documentation source code lives in the same location as the
  `catalog-info.yaml` file.
- That, in particular, the `mkdocs.yml` file is a sibling of `catalog-info.yaml`
  (meaning, it is in the same directory)
- And that all of the source content of the documentation would be available if
  one were to download the directory containing those two files (as well as all
  sub-directories).

The directory tree of the entity would look something like this:

```
├── catalog-info.yaml
├── mkdocs.yml
└── docs
    └── index.md
```

If, for example, you wanted to keep a lean root directory, you could place your
`mkdocs.yml` file in a subdirectory and update the `backstage.io/techdocs-ref`
annotation value accordingly, e.g. to `dir:./sub-folder`:

```
├── catalog-info.yaml
└── sub-folder
    ├── mkdocs.yml
    └── docs
        └── index.md
```

In rare situations where your TechDocs source content is managed and stored in a
location completely separate from your `catalog-info.yaml`, you can instead
specify a URL location reference, the exact value of which will vary based on
the source code hosting provider. Notice that instead of the `dir:` prefix, the
`url:` prefix is used instead. For example:

- **GitHub**: `url:https://githubhost.com/org/repo/tree/<branch_name>`
- **GitLab**: `url:https://gitlabhost.com/org/repo/tree/<branch_name>`
- **Bitbucket**: `url:https://bitbuckethost.com/project/repo/src/<branch_name>`
- **Azure**: `url:https://azurehost.com/organization/project/_git/repository`

Note, just as it's possible to specify a subdirectory with the `dir:` prefix,
you can also provide a path to a non-root directory inside the repository which
contains the `mkdocs.yml` file and `docs/` directory.

e.g.
`url:https://github.com/backstage/backstage/tree/master/plugins/techdocs-backend/examples/documented-component`

### Why is URL Reader faster than a git clone?

URL Reader uses the source code hosting provider to download a zip or tarball of
the repository. The archive does not have any git history attached to it. Also
it is a compressed file. Hence the file size is significantly smaller than how
much data git clone has to transfer.

## How to use a custom TechDocs home page?

### 1st way: TechDocsCustomHome with a custom configuration

As an example, in your main App.tsx:

```tsx
import {
  TechDocsCustomHome,
  PanelType,
  TechDocsReaderPage,
} from '@backstage/plugin-techdocs';
import { Entity } from '@backstage/catalog-model';

const tabsConfig = [
  {
    label: 'Custom Tab',
    panels: [
      {
        title: 'Custom Documents Cards 1',
        description:
          'Explore your internal technical ecosystem through documentation.',
        panelType: 'DocsCardGrid' as PanelType,
        // optional, is applied to a container of the panel (excludes header of panel)
        panelCSS: { maxHeight: '400px', overflow:'auto' },
        filterPredicate: (entity: Entity) => !!entity.metadata.annotations?.['customCardAnnotationOne'];
    },
      {
        title: 'Custom Documents Cards 2',
        description:
          'Explore your internal technical ecosystem through documentation.',
        panelType: 'DocsCardGrid' as PanelType,
        panelCSS: { maxHeight: '400px', overflow:'auto' },
        filterPredicate: (entity: Entity) => !!entity.metadata.annotations?.['customCardAnnotationTwo'];
      },
    ],
  },
  {
    label: 'Overview',
    panels: [
      {
        title: 'Overview',
        description:
          'Explore your internal technical ecosystem through documentation.',
        panelType: 'DocsTable' as PanelType,
        filterPredicate: () => true,
      },
    ],
  },
];

const routes = (
  <FlatRoutes>
    <Route
      path="/docs"
      element={<TechDocsCustomHome tabsConfig={tabsConfig} />}
    />
    <Route
      path="/docs/:namespace/:kind/:name/*"
      element={<TechDocsReaderPage />}
    />
  </FlatRoutes>
```

An example of tabsConfig that corresponds to the default documentation home page
can be found at `plugins/techdocs/src/home/components/TechDocsHome.tsx`.

Currently `panelType` has DocsCardGrid and DocsTable available. We currently
recommend that DocsCardGrid can be optionally vertically stacked by setting a
maxHeight using `panelCSS`, and DocsTable to be in a tab by itself.

### 2nd way: Custom home page plugin

A custom home page plugin can be built that uses the components extensions
DocsCardGrid and DocsTable, exported from @backstage/techdocs. They both take a
array of documentation entities ( i.e.have a 'backstage.io/techdocs-ref'
annotation ) as an 'entities' attribute.

For a reference to the React structure of the default home page, please refer to
`plugins/techdocs/src/home/components/TechDocsCustomHome.tsx`.
