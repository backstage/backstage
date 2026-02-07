---
'@backstage/plugin-app': minor
---

**BREAKING**: Extensions created with the following blueprints must now be provided via an override or a module for the `app` plugin. Extensions from other plugins will now trigger a warning in the app and be ignored.

- `IconBundleBlueprint`
- `NavContentBlueprint`
- `RouterBlueprint`
- `SignInPageBlueprint`
- `SwappableComponentBlueprint`
- `ThemeBlueprint`
- `TranslationBlueprint`
