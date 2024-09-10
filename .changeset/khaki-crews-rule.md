---
'@backstage/plugin-app-backend': patch
---

**BREAKING**: The app backend now supports the new `index.html.tmpl` output from `@backstage/cli`. If available, the `index.html` will be templated at runtime with the current configuration of the app backend.

This is marked as a breaking change because you must now supply the app build-time configuration to the backend. This change also affects the public path behavior, where it is no longer necessary to build the app with the correct public path upfront. You now only need to supply a correct `app.baseUrl` to the app backend plugin at runtime.

An effect that this change has is that the `index.html` will now contain and present the frontend configuration in an easily readable way, which can aid in debugging. This data was always available in the frontend, but it was injected and hidden in the static bundle.

This templating behavior is enabled by default, but it can be disabled by setting the `app.disableConfigInjection` configuration option to `true`.
