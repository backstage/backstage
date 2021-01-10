---
id: configuring-ci-cd
title: Configuring CI/CD to generate and publish TechDocs sites
description:
  Configuring CI/CD to generate and publish TechDocs sites to cloud storage
---

In the [Recommended deployment setup](./architecture.md#recommended-deployment),
TechDocs reads the static generated documentation files from a cloud storage
bucket (GCS, AWS S3, etc.). The documentation site is generated on the CI/CD
workflow associated with the repository containing the documentation files. This
document explains the steps needed to generate docs on CI and publish to a cloud
storage using [`techdocs-cli`](https://github.com/backstage/techdocs-cli).

The steps here target all kinds of CI providers (GitHub actions, Circle CI,
Jenkins, etc.) Specific tools for individual providers will also be made
available here for simplicity (e.g. A GitHub Actions runner, CircleCI orb, etc.)

A summary of the instructions below looks like this -

```sh
# Prepare
REPOSITORY_URL='https://github.com/org/repo'
git clone $REPOSITORY_URL

# Generate
npx @techdocs/cli generate --source-dir ./repo --output-dir ./site

# Publish
npx @techdocs/cli publish --directory ./site --publisher-type awsS3 --bucket-name <bucket> --entity <Namespace/Kind/Name>

# That's it!
```

## 1. Setup a workflow

The TechDocs workflow should trigger on CI when any changes are made in the
repository containing the documentation files. You can be specific and trigger
the workflow only on changes to files inside the `docs/` directory or
`mkdocs.yml`.

## 2. Prepare step

The first step on the CI is to clone the repository in a working directory. This
is almost always the first step in most CI workflows.

On GitHub actions, you can add a step

[`- uses: actions@checkout@v2`](https://github.com/actions/checkout).

On CircleCI, you can add a special
[`checkout`](https://circleci.com/docs/2.0/configuration-reference/#checkout)
step.

Eventually we are trying to do a `git clone <https://path/to/docs-repository/>`.

## 3. Generate step

Install [`npx`](https://www.npmjs.com/package/npx) to use it for running
`techdocs-cli`. We are going to use the `techdocs-cli generate` command here.

Take a look at
[`techdocs-cli` README](https://github.com/backstage/techdocs-cli) for the
complete command reference, details, and options.

```
npx @techdocs/cli generate --no-docker --source-dir PATH_TO_REPO --output-dir ./site
```

`PATH_TO_REPO` should be the location where the prepare step above clones the
repository.

## 4. Publish step

Take a look at
[`techdocs-cli` README](https://github.com/backstage/techdocs-cli) for the
complete command reference, details, and options.

Depending on your cloud storage provider (AWS or Google Cloud), set the
necessary authentication environment variables.

- [Google Cloud authentication](https://cloud.google.com/storage/docs/authentication#libauth)
- [AWS authentication](https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/loading-node-credentials-environment.html)

```
npx @techdocs/cli publish --directory ./site --publisher-type <awsS3|googleGcs> --bucket-name <bucket> --entity <namespace/kind/name>
```
