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
  <Breadcrumb href="/my-plugin">My Plugin</Breadcrumb>
  <Breadcrumb href="/my-plugin/subpage">Page with short name</Breadcrumb>
  <Breadcrumb href="/my-plugin/subpage/sub-subpage">
    Page with a long name that gets truncated
  </Breadcrumb>
  <Breadcrumb href="/my-plugin/subpage/sub-subpage/details">
    Current page with a long name is not truncated
  </Breadcrumb>
</Breadcrumbs>`;

export const inheritsStyleSnippet = `<div style={{ fontSize: '24px', color: '#98c379' }}>
  <Breadcrumbs>
    <Breadcrumb href="/my-plugin">My Plugin</Breadcrumb>
    <Breadcrumb href="/my-plugin/settings">Settings</Breadcrumb>
    <Breadcrumb href="/my-plugin/settings/theme">Theme</Breadcrumb>
  </Breadcrumbs>
</div>`;

export const mixedSegmentsSnippet = `<Breadcrumbs>
  <Breadcrumb href="/my-plugin">My Plugin</Breadcrumb>
  <Breadcrumb>Label without link</Breadcrumb>
  <Breadcrumb href="/my-plugin/subpage">Subpage</Breadcrumb>
  <Breadcrumb href="/my-plugin/subpage/details">Details</Breadcrumb>
</Breadcrumbs>`;
