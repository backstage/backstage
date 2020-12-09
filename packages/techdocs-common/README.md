# @backstage/techdocs-common

Common functionalities for TechDocs, to be shared between techdocs-backend plugin and techdocs-cli

This package is used by `techdocs-backend` to serve docs from different types of publishers (Google GCS, Local, etc.).
It is also used to build docs and publish them to storage, by both `techdocs-backend` and `techdocs-cli`.

## Usage

Create a preparer instance from the [preparers available](/packages/techdocs-common/src/stages/prepare) at which takes an Entity instance.
Run the [docs generator](/packages/techdocs-common/src/stages/generate) on the prepared directory.
Publish the generated directory files to a [storage](/packages/techdocs-common/src/stages/publish) of your choice.

Example:

```js
async () => {
  const preparedDir = await preparer.prepare(entity);

  const parsedLocationAnnotation = getLocationForEntity(entity);
  const { resultDir } = await generator.run({
    directory: preparedDir,
    dockerClient: dockerClient,
    parsedLocationAnnotation,
  });

  await publisher.publish({
    entity: entity,
    directory: resultDir,
  });
};
```

## Features

Currently the build process is split up in these three stages.

- Preparers
- Generators
- Publishers

Preparers read your entity data and creates a working directory with your documentation source code. For example if you have set your `backstage.io/techdocs-ref` to `github:https://github.com/backstage/backstage.git` it will clone that repository to a temp folder and pass that on to the generator.

Generators takes the prepared source and runs the `techdocs-container` on it. It then passes on the output folder of that build to the publisher.

Publishers gets a folder path from the generator and publish it to your storage solution. Read documentation to know more about configuring storage solutions.
http://backstage.io/docs/features/techdocs/configuration

Any of these can be extended. We want to extend our support to most of the storage providers (Publishers) and source code host providers (Preparers).
