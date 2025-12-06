---
'@backstage/core-components': patch
'@backstage/core-app-api': patch
'@backstage/plugin-auth': patch
'@backstage/plugin-catalog-import': patch
'@backstage/plugin-catalog-react': patch
'@backstage/plugin-home': patch
'@backstage/plugin-search-react': patch
'@backstage/plugin-techdocs-module-addons-contrib': patch
'@backstage/plugin-techdocs': patch
---

Add internationalization support for app title with the `useAppTitle()` hook.
All components that display the app title now support translations via the fixed translation key `app.title`.

**Translation priority:** translation override → config value → default ('Backstage').

**Updated components:** Header, SignInPage, OAuthRequestDialog, SearchBar, ImportInfoCard, ConsentPage, TechDocsReaderPageHeader, CompanyLogo, UnregisterEntityDialog, and more.
