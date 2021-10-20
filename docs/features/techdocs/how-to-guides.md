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

## How to customize the TechDocs home page?

TechDocs uses a composability pattern similar to the Search and Catalog plugins
in Backstage. While a default table experience, similar to the one provided by
the Catalog plugin, is made available for ease-of-use, it's possible for you to
provide a completely custom experience, tailored to the needs of your
organization. For example, TechDocs comes with an alternative grid based layout
(`<EntityListDocsGrid>`).

This is done in your `app` package. By default, you might see something like
this in your `App.tsx`:

```tsx
const AppRoutes = () => {
  <FlatRoutes>
    <Route path="/docs" element={<TechDocsIndexPage />}>
      <DefaultTechDocsHome />
    </Route>
  </FlatRoutes>;
};
```

But you can replace `<DefaultTechDocsHome />` with any React component, which
will be rendered in its place. Most likely, you would want to create and
maintain such a component in a new directory at
`packages/app/src/components/techdocs`, and import and use it in `App.tsx`:

```tsx
import { CustomTechDocsHome } from './components/techdocs/CustomTechDocsHome';
// ...
const AppRoutes = () => {
  <FlatRoutes>
    <Route path="/docs" element={<TechDocsIndexPage />}>
      <CustomTechDocsHome />
    </Route>
  </FlatRoutes>;
};
```

## How to customize the TechDocs reader page?

Similar to how it is possible to customize the TechDocs Home, it is also
possible to customize the TechDocs Reader Page. It is done in your `app`
package. By default, you might see something like this in your `App.tsx`:

```tsx
const AppRoutes = () => {
  <Route path="/docs/:namespace/:kind/:name/*" element={<TechDocsReaderPage />}>
    {techDocsPage}
  </Route>;
};
```

The `techDocsPage` is a default techdocs reader page which lives in
`packages/app/src/components/techdocs`. It includes the following without you
having to set anything up.

```tsx
<TechDocsPage>
  {({ techdocsMetadataValue, entityMetadataValue, entityRef, onReady }) => (
    <>
      <TechDocsPageHeader
        techDocsMetadata={techdocsMetadataValue}
        entityMetadata={entityMetadataValue}
        entityRef={entityRef}
      />
      <Content data-testid="techdocs-content">
        <Reader onReady={onReady} entityRef={entityRef} />
      </Content>
    </>
  )}
</TechDocsPage>
```

If you would like to compose your own `techDocsPage`, you can do so by replacing
the children of TechDocsPage with something else. Maybe you are _just_
interested in replacing the Header:

```tsx
<TechDocsPage>
  {({ entityRef, onReady }) => (
    <>
      <Header type="documentation" title="Custom Header" />
      <Content data-testid="techdocs-content">
        <Reader onReady={onReady} entityRef={entityRef} />
      </Content>
    </>
  )}
</TechDocsPage>
```

Or maybe you want to disable the in-context search

```tsx
<TechDocsPage>
  {({ entityRef, onReady }) => (
    <>
      <Header type="documentation" title="Custom Header" />
      <Content data-testid="techdocs-content">
        <Reader onReady={onReady} entityRef={entityRef} withSearch={false} />
      </Content>
    </>
  )}
</TechDocsPage>
```

Or maybe you want to replace the entire TechDocs Page.

```tsx
<TechDocsPage>
  <Header type="documentation" title="Custom Header" />
  <Content data-testid="techdocs-content">
    <p>my own content</p>
  </Content>
</TechDocsPage>
```

## How to migrate from TechDocs Alpha to Beta

> This guide only applies to the "recommended" TechDocs deployment method (where
> an external storage provider and external CI/CD is used). If you use the
> "basic" or "out-of-the-box" setup, you can stop here! No action needed.

For the purposes of this guide, TechDocs Beta version is defined as:

- **TechDocs Plugin**: At least `v0.11.0`
- **TechDocs Backend Plugin**: At least `v0.10.0`
- **TechDocs CLI**: At least `v0.7.0`

The beta version of TechDocs made a breaking change to the way TechDocs content
was accessed and stored, allowing pages to be accessed with case-insensitive
entity triplet paths (e.g. `/docs/namespace/kind/name` whereas in prior
versions, they could only be accessed at `/docs/namespace/Kind/name`). In order
to enable this change, documentation has to be stored in an external storage
provider using an object key whose entity triplet is lower-cased.

New installations of TechDocs since the beta version will work fine with no
action, but for those who were running TechDocs prior to this version, a
migration will need to be performed so that all existing content in your storage
bucket matches this lower-case entity triplet expectation.

1. **Ensure you have the right permissions on your storage provider**: In order
   to migrate files in your storage provider, the `techdocs-cli` needs to be
   able to read/copy/rename/move/delete files. The exact instructions vary by
   storage provider, but check the [using cloud storage][using-cloud-storage]
   page for details.

2. **Run a non-destructive migration of files**: Ensure you have the latest
   version of `techdocs-cli` installed. Then run the following command, using
   the details relevant for your provider / configuration. This will copy all
   files from, e.g. `namespace/Kind/name/index.html` to
   `namespace/kind/name/index.html`, without removing the original files.

```sh
techdocs-cli migrate --publisher-type <awsS3|googleGcs|azureBlobStorage> --storage-name <bucket/container name> --verbose
```

3. **Deploy the updated versions of the TechDocs plugins**: Once the migration
   above has been run, you can deploy the beta versions of the TechDocs backend
   and frontend plugins to your Backstage instance.

4. **Verify that your TechDocs sites are still loading/accessible**: Try
   accessing a TechDocs site using different entity-triplet case variants, e.g.
   `/docs/namespace/KIND/name` or `/docs/namespace/kind/name`. Your TechDocs
   site should load regardless of the URL path casing you use.

5. **Clean up the old objects from storage**: Once you've verified that your
   TechDocs site is accessible, you can clean up your storage bucket by
   re-running the `migrate` command on the TechDocs CLI, but with an additional
   `removeOriginal` flag passed:

```sh
techdocs-cli migrate --publisher-type <awsS3|googleGcs|azureBlobStorage> --storage-name <bucket/container name> --removeOriginal --verbose
```

6. **Update your CI/CD pipelines to use the beta version of the TechDocs CLI**:
   Finally, you can update all of your CI/CD pipelines to use at least v0.x.y of
   the TechDocs CLI, ensuring that all sites are published to the new,
   lower-cased entity triplet paths going forward.

If you encounter problems running this migration, please [report the
issue][beta-migrate-bug]. You can temporarily revert to pre-beta storage
expectations with a configuration change:

```yaml
techdocs:
  legacyUseCaseSensitiveTripletPaths: true
```

[beta-migrate-bug]:
https://github.com/backstage/backstage/issues/new?assignees=&labels=bug&template=bug_template.md&title=[TechDocs]%20Unable%20to%20run%20beta%20migration
[using-cloud-storage]: ./using-cloud-storage.md

## How to implement your own TechDocs APIs

The TechDocs plugin provides implementations of two primary APIs by default: the
[TechDocsStorageApi](https://github.com/backstage/backstage/blob/55114cfeb7045e3e5eeeaf67546b58964f4adcc7/plugins/techdocs/src/api.ts#L33),
which is responsible for talking to TechDocs storage to fetch files to render,
and
[TechDocsApi](https://github.com/backstage/backstage/blob/55114cfeb7045e3e5eeeaf67546b58964f4adcc7/plugins/techdocs/src/api.ts#L49),
which is responsible for talking to techdocs-backend.

There may be occasions where you need to implement these two APIs yourself, to
customize them to your own needs. The purpose of this guide is to walk you
through how to do that in two steps.

1. Implement the `TechDocsStorageApi` and `TechDocsApi` interfaces according to
   your needs.

```typescript
export class TechDocsCustomStorageApi implements TechDocsStorageApi {
  // your implementation
}

export class TechDocsCustomApiClient implements TechDocsApi {
  // your implementation
}
```

2. Override the API refs `techdocsStorageApiRef` and `techdocsApiRef` with your
   new implemented APIs in the `App.tsx` using `ApiFactories`.
   [Read more about App APIs](https://backstage.io/docs/api/utility-apis#app-apis).

```typescript
const app = createApp({
  apis: [
    // TechDocsStorageApi
    createApiFactory({
      api: techdocsStorageApiRef,
      deps: { discoveryApi: discoveryApiRef, configApi: configApiRef },
      factory({ discoveryApi, configApi }) {
        return new TechDocsCustomStorageApi({ discoveryApi, configApi });
      },
    }),
    // TechDocsApi
    createApiFactory({
      api: techdocsApiRef,
      deps: { discoveryApi: discoveryApiRef },
      factory({ discoveryApi }) {
        return new TechDocsCustomApiClient({ discoveryApi });
      },
    }),
  ],
});
```
