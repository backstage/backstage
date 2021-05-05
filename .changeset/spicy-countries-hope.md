---
'@backstage/techdocs-common': minor
---

Migrate the package to use the `ContainerRunner` interface instead of `runDockerContainer(…)`.
It also no longer provides the `ContainerRunner` as an input to the `GeneratorBase#run(…)` function, but expects it as a constructor parameter instead.

If you use the `TechdocsGenerator` you need to update the usage:

```diff
+ const containerRunner = new DockerContainerRunner({ dockerClient });

- const generator = new TechdocsGenerator(logger, config);
+ const techdocsGenerator = new TechdocsGenerator({
+   logger,
+   containerRunner,
+   config,
+ });

  await this.generator.run({
    inputDir: preparedDir,
    outputDir,
-   dockerClient: this.dockerClient,
    parsedLocationAnnotation,
    etag: newEtag,
  });
```
