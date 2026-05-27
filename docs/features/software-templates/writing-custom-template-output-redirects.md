---
id: writing-custom-template-output-redirects
title: Writing Custom Template Output Redirects
description: How to write your own template output redirects
---

::::info
This documentation is written for the new frontend system, which is the default in new Backstage apps.
::::

Sometimes when running a template, you want the output to redirect the user to a specific page based on their input, reducing extra clicks. This functionality was previously supported by `EXPERIMENTAL_TemplateOutputsComponent` in the old frontend system.

This is where `Template Output Redirects` come in.

With them, you can redirect template completion to a specific page based on the template output.

## What are Template Output Redirects?

Template Output Redirects let your app choose the page a user lands on after a template finishes running. Instead of always staying on the default completion screen, the template can evaluate its result and send the user to a different route.

For example, if a template receives an optional input value and the user enters `a`, the completed run can redirect to `/page-a`. If the user leaves that input blank, the same template can instead redirect to `/page-b`.

That means you can build workflows that guide users to the most relevant next page automatically, reducing extra clicks and making post-template navigation context-aware.

## Creating a Template Output Redirect

Using a simple example, we will first create a component that waits for the template task to finish and then navigates to a new page.

```tsx
import { Progress } from '@backstage/core-components';
import { useRouteRefParams } from '@backstage/core-plugin-api';
import { scaffolderPlugin } from '@backstage/plugin-scaffolder';
import { useTaskEventStream } from '@backstage/plugin-scaffolder-react';
import { Navigate } from 'react-router-dom';

export const TestScaffolderRedirect = () => {
  const { taskId } = useRouteRefParams(scaffolderPlugin.routes.ongoingTask) as {
    taskId: string;
  };

  const taskStream = useTaskEventStream(taskId);

  if (taskStream.completed && !taskStream.error) {
    return <Navigate to="catalog" replace />;
  }

  return <Progress />;
};
```

This component is responsible for redirecting the user after the task completes.

- It reads the current `taskId` from the ongoing task route using `useRouteRefParams`.
- It subscribes to task status with `useTaskEventStream`.
- While the task is still running, it shows a `Progress` indicator.
- When the task completes successfully, it redirects the user to the `catalog` route.

Next, we create a wrapper component that chooses the right redirect behavior based on the currently executing template and register it as a template output redirect.

```tsx packages/app/src/TestTemplateOutputRedirect.tsx
import { useRouteRefParams } from '@backstage/core-plugin-api';
import { scaffolderPlugin } from '@backstage/plugin-scaffolder';
import { useTaskEventStream } from '@backstage/plugin-scaffolder-react';
import { DefaultTemplateOutputs } from '@backstage/plugin-scaffolder-react/alpha';
import { TestScaffolderRedirect } from './TestScaffolderRedirect';

const redirectComponents: Record<string, any> = {
  'template:default/test-redirect': TestScaffolderRedirect,
};

const TestTemplateOutputsComponent = (props: any) => {
  const { taskId } = useRouteRefParams(
    scaffolderPlugin.routes.ongoingTask,
  ) as any;

  const taskStream = useTaskEventStream(taskId);

  const currentTemplateRef = taskStream.task?.spec.templateInfo?.entityRef;
  if (!currentTemplateRef) {
    return <DefaultTemplateOutputs {...props} />;
  }

  const SelectedTemplate =
    redirectComponents[currentTemplateRef] || DefaultTemplateOutputs;

  return <SelectedTemplate {...props} />;
};

export const testTemplateOutputRedirect =
  scaffolderTemplateOutputsBlueprint.make({
    name: 'example-template-redirect',
    params: {
      component: TestTemplateOutputsComponent,
    },
  });
```

This wrapper does three things:

- Gets the current task from the route and the task event stream.
- Reads the executing template's reference from `taskStream.task?.spec.templateInfo?.entityRef`.
- Chooses a redirect component from the `redirectComponents` map, or falls back to `DefaultTemplateOutputs` if no redirect is configured for the template.

Once the redirect is created, install it in your app by wrapping it in a frontend module and passing it to `createApp`:

```tsx title="packages/app/src/App.tsx"
import { createApp } from '@backstage/frontend-defaults';
import { testTemplateOutputRedirect } from './TestTemplateOutputRedirect';

const scaffolderTemplateOutputsModule = createFrontendModule({
  pluginId: 'scaffolder',
  extensions: [testTemplateOutputRedirect],
});

const app = createApp({
  features: [scaffolderTemplateOutputsModule],
});

export default app.createRoot();
```
