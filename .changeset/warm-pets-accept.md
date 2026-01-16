---
'@backstage/plugin-app': patch
---

The following blueprints are being restricted to only be used in app plugin overrides and modules. They will now produce a deprecation warning when used outside of the app plugin:

- `IconBundleBlueprint`
- `NavContentBlueprint`
- `RouterBlueprint`
- `SignInPageBlueprint`
- `SwappableComponentBlueprint`
- `ThemeBlueprint`
- `TranslationBlueprint`
