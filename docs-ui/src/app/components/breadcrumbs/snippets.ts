export const breadcrumbsUsageSnippet = `import { Breadcrumbs, Breadcrumb } from '@backstage/ui';

<Breadcrumbs>
  <Breadcrumb href="/my-plugin">My Plugin</Breadcrumb>
  <Breadcrumb href="/my-plugin/settings">Settings</Breadcrumb>
  <Breadcrumb href="/my-plugin/settings/theme">Theme</Breadcrumb>
</Breadcrumbs>`;

export const defaultSnippet = `<Breadcrumbs>
  <Breadcrumb href="/my-plugin">My Plugin</Breadcrumb>
  <Breadcrumb href="/my-plugin/settings">Settings</Breadcrumb>
  <Breadcrumb href="/my-plugin/settings/theme">Theme</Breadcrumb>
</Breadcrumbs>`;

export const truncationSnippet = `<Breadcrumbs>
  <Breadcrumb href="/home">Home</Breadcrumb>
  <Breadcrumb href="/home/catalog">
    A very long breadcrumb label that will be truncated by CSS
  </Breadcrumb>
  <Breadcrumb href="/home/catalog/details">
    Another extremely long segment name that overflows its container
  </Breadcrumb>
</Breadcrumbs>`;

export const variantAndColorSnippet = `<Breadcrumbs variant="title-x-small" color="info">
  <Breadcrumb href="/home">Home</Breadcrumb>
  <Breadcrumb href="/home/settings">Settings</Breadcrumb>
  <Breadcrumb href="/home/settings/theme">Theme</Breadcrumb>
</Breadcrumbs>

{/* Individual items can override */}
<Breadcrumbs variant="body-large">
  <Breadcrumb href="/home">Home</Breadcrumb>
  <Breadcrumb href="/home/settings" color="danger">
    Settings (danger)
  </Breadcrumb>
  <Breadcrumb href="/home/settings/theme">Theme</Breadcrumb>
</Breadcrumbs>`;

export const collapsedSnippet = `<Breadcrumbs>
  <Breadcrumb href="/home">Home</Breadcrumb>
  <Breadcrumb href="/home/docs">Docs</Breadcrumb>
  <Breadcrumb href="/home/docs/guides">Guides</Breadcrumb>
  <Breadcrumb href="/home/docs/guides/setup">Setup</Breadcrumb>
  <Breadcrumb href="/home/docs/guides/setup/intro">Introduction</Breadcrumb>
</Breadcrumbs>`;

export const customStylingSnippet = `{/* Typography via props */}
<Breadcrumbs variant="title-small" color="secondary">
  <Breadcrumb href="/home">Home</Breadcrumb>
  <Breadcrumb href="/home/settings">Settings</Breadcrumb>
  <Breadcrumb href="/home/settings/theme" color="primary" weight="regular">
    Theme
  </Breadcrumb>
</Breadcrumbs>

{/* Layout via CSS tokens on style */}
<Breadcrumbs style={{ '--bui-Breadcrumbs-gap': 'var(--bui-space-10)' }}>
  ...
</Breadcrumbs>

{/* Custom separator */}
<Breadcrumbs separator={<RiMore2Line size="1em" />}>
  ...
</Breadcrumbs>`;

export const mixedSegmentsSnippet = `<Breadcrumbs>
  <Breadcrumb href="/my-plugin">My Plugin</Breadcrumb>
  <Breadcrumb>Breadcrumb with no href</Breadcrumb>
  <Breadcrumb href="/my-plugin/subpage">Breadcrumb with href</Breadcrumb>
  <Breadcrumb href="/my-plugin/subpage/sub-subpage">
    Breadcrumb with href but is last
  </Breadcrumb>
</Breadcrumbs>`;
