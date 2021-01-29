---
'@backstage/plugin-scaffolder-backend': minor
---

The scaffolder is updated to generate a unique workspace directory inside the temp folder. This directory is cleaned up by the job processor after each run.

The prepare/template/publish steps have been refactored to operate on known directories, `template/` and `result/`, inside the temporary workspace path.

Updated preparers to accept the template url instead of the entire template. This is done primarily to allow for backwards compatibility between v1 and v2 scaffolder templates.

Fixes broken GitHub actions templating in the Create React App template.

#### For those with **custom** preparers, templates, or publishers

The preparer interface has changed, the prepare method now only takes a single argument, and doesn't return anything. As part of this change the preparers were refactored to accept a URL pointing to the target directory, rather than computing that from the template entity.

The `workingDirectory` option was also removed, and replaced with a `workspacePath` option. The difference between the two is that `workingDirectory` was a place for the preparer to create temporary directories, while the `workspacePath` is the specific folder were the entire templating process for a single template job takes place. Instead of returning a path to the folder were the prepared contents were placed, the contents are put at the `<workspacePath>/template` path.

```diff
type PreparerOptions = {
-  workingDirectory?: string;
+  /**
+   * Full URL to the directory containg template data
+   */
+  url: string;
+  /**
+   * The workspace path that will eventually be the the root of the new repo
+   */
+  workspacePath: string;
  logger: Logger;
};

-prepare(template: TemplateEntityV1alpha1, opts?: PreparerOptions): Promise<string>
+prepare(opts: PreparerOptions): Promise<void>;
```

Instead of returning a path to the folder were the templaters contents were placed, the contents are put at the `<workspacePath>/result` path. All templaters now also expect the source template to be present in the `template` directory within the `workspacePath`.

```diff
export type TemplaterRunOptions = {
-  directory: string;
+  workspacePath: string;
  values: TemplaterValues;
  logStream?: Writable;
  dockerClient: Docker;
};

-public async run(options: TemplaterRunOptions): Promise<TemplaterRunResult>
+public async run(options: TemplaterRunOptions): Promise<void>
```

Just like the preparer and templaters, the publishers have also switched to using `workspacePath`. The root of the new repo is expected to be located at `<workspacePath>/result`.

```diff
export type PublisherOptions = {
  values: TemplaterValues;
-  directory: string;
+  workspacePath: string;
  logger: Logger;
};
```
