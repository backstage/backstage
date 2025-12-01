---
'@backstage/core-components': patch
'@backstage/core-app-api': patch
---

Add internationalization support for app title with the `useAppTitle()` hook.
All components that display the app title now support translations via the fixed translation key `app.title`.

**Translation priority:** translation override → config value → default ('Backstage').

**Updated components:**- Header, SignInPage, OAuthRequestDialog, SearchBar, ImportInfoCard, ConsentPage, TechDocsReaderPageHeader, CompanyLogo, UnregisterEntityDialog, and more.
