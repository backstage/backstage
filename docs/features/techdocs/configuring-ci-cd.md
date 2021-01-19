---
id: configuring-ci-cd
title: Configuring CI/CD to generate and publish TechDocs sites
# prettier-ignore
description: Configuring CI/CD to generate and publish TechDocs sites to cloud storage
---

In the [Recommended deployment setup](./architecture.md#recommended-deployment),
TechDocs reads the static generated documentation files from a cloud storage
bucket (GCS, AWS S3, etc.). The documentation site is generated on the CI/CD
workflow associated with the repository containing the documentation files. This
document explains the steps needed to generate docs on CI and publish to a cloud
storage using [`techdocs-cli`](https://github.com/backstage/techdocs-cli).

The steps here target all kinds of CI providers (GitHub Actions, CircleCI,
Jenkins, etc.). Specific tools for individual providers will also be made
available here for simplicity (e.g. a GitHub Actions runner, CircleCI orb,
etc.).

A summary of the instructions below looks like this -

```sh
# This is an example script

# Prepare
REPOSITORY_URL='https://github.com/org/repo'
git clone $REPOSITORY_URL
cd repo

# Generate
npx @techdocs/cli generate

# Publish
npx @techdocs/cli publish --publisher-type awsS3 --storage-name <bucket/container> --entity <Namespace/Kind/Name>
```

That's it!

Take a look at
[`techdocs-cli` README](https://github.com/backstage/techdocs-cli) for the
complete command reference, details, and options.

## 1. Setup a workflow

The TechDocs workflow should trigger on CI when any changes are made in the
repository containing the documentation files. You can be specific and configure
the workflow to be triggered only when files inside the `docs/` directory or
`mkdocs.yml` are changed.

## 2. Prepare step

The first step on the CI is to clone your documentation source repository in a
working directory. This is almost always the first step in most CI workflows.

On GitHub Actions, you can add a step

[`- uses: actions@checkout@v2`](https://github.com/actions/checkout).

On CircleCI, you can add a special
[`checkout`](https://circleci.com/docs/2.0/configuration-reference/#checkout)
step.

Eventually we are trying to do a `git clone <https://path/to/docs-repository/>`.

## 3. Generate step

Install [`npx`](https://www.npmjs.com/package/npx) to use it for running
`techdocs-cli`. Or you can install using `npm install -g @techdocs/cli`.

We are going to use the
[`techdocs-cli generate`](https://github.com/backstage/techdocs-cli#generate-techdocs-site-from-a-documentation-project)
command in this step.

```sh
npx @techdocs/cli generate --no-docker --source-dir PATH_TO_REPO --output-dir ./site
```

`PATH_TO_REPO` should be the location in the file path where the prepare step
above clones the repository.

## 4. Publish step

Depending on your cloud storage provider (AWS, Google Cloud, or Azure), set the
necessary authentication environment variables.

- [Google Cloud authentication](https://cloud.google.com/storage/docs/authentication#libauth)
- [AWS authentication](https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/loading-node-credentials-environment.html)

And then run the
[`techdocs-cli publish`](https://github.com/backstage/techdocs-cli#publish-generated-techdocs-sites)
command.

```sh
npx @techdocs/cli publish --publisher-type <awsS3|googleGcs> --storage-name <bucket/container> --entity <namespace/kind/name> --directory ./site
```

The updated TechDocs site built in this workflow is now ready to be served by
the TechDocs plugin in your Backstage app.
