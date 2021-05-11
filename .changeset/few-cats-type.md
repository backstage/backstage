---
'@backstage/core': minor
'@backstage/core-api': patch
---

This change adds error boundary on extensions.

This means all exposed parts of a plugin are wrapped in a general error boundary component, that is plugin aware. The default design for the error box is borrowed from @backstage/errors. To override the default "fallback" one must provide a component named `ErrorBoundaryFallback` to `createApp`, like so:

```ts
const app = createApp({
  components: {
    ErrorBoundaryFallback: props => {
      // a custom fallback component
      return (
        <>
          <h1>Oops.</h1>
          <h2>
            The plugin {props.plugin.getId()} failed with {props.error.message}
          </h2>
          <button onClick={props.resetError}>Try again</button>
        </>
      );
    },
  },
});
```

The props here include:

- `error`. An Error object or something that inherits it that represents the error that was thrown from any inner component.
- `resetError`. A callback that will simply mount the children of the error boundary again.
- `plugin`. A BackstagePlugin that can be used to lookup info to be presented in the error message. For instance, you may want to keep a map of your internal plugins and team names or slack channels and present these when an error occurs. Typically, you'll do that by getting the plugin id with `plugin.getId()`.
