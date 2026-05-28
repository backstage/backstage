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

export const inheritsStyleSnippet = `<div style={{ fontSize: '24px', color: '#61afef' }}>
  <Breadcrumbs>
    <Breadcrumb href="/home">Home</Breadcrumb>
    <Breadcrumb href="/home/settings">Settings</Breadcrumb>
    <Breadcrumb href="/home/settings/theme">Theme</Breadcrumb>
  </Breadcrumbs>
</div>`;

export const collapsedSnippet = `<Breadcrumbs>
  <Breadcrumb href="/home">Home</Breadcrumb>
  <Breadcrumb href="/home/docs">Docs</Breadcrumb>
  <Breadcrumb href="/home/docs/guides">Guides</Breadcrumb>
  <Breadcrumb href="/home/docs/guides/setup">Setup</Breadcrumb>
  <Breadcrumb href="/home/docs/guides/setup/intro">Introduction</Breadcrumb>
</Breadcrumbs>`;

export const mixedSegmentsSnippet = `<Breadcrumbs>
  <Breadcrumb href="/my-plugin">My Plugin</Breadcrumb>
  <Breadcrumb>Breadcrumb with no href</Breadcrumb>
  <Breadcrumb href="/my-plugin/subpage">Breadcrumb with href</Breadcrumb>
  <Breadcrumb href="/my-plugin/subpage/sub-subpage">
    Breadcrumb with href but is last
  </Breadcrumb>
</Breadcrumbs>`;
