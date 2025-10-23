---
'@backstage/ui': patch
---

The Header and HeaderPage components now automatically set the browser title.

The Header component sets a title template that allows other components (like HeaderPage) to automatically include the header title as part of the browser title. The default browser title is `{title} | {appTitle}`, where `title` comes from the Header component props and `appTitle` is retrieved from your Backstage `app.title` configuration (defaults to "Backstage" if not set).

When using HeaderPage alongside a Header, the browser title becomes `{headerPageTitle} | {headerTitle} | {appTitle}`. Using Helmet to set the title directly has a similar effect when Header is used, the browser title would become `{helmetTitle} | {headerTitle} | {appTitle}`.
