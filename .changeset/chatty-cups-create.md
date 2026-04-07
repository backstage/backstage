---
'@backstage/ui': minor
---

**BREAKING**: The `Header` component's `tabs` prop now uses `HeaderNavTabItem[]` instead of `HeaderTab[]`. Tabs render as a `<nav>` element with links and optional dropdown menus instead of `role="tablist"`. A new `activeTabId` prop controls which tab is highlighted.

**Migration:**

```diff
- import { Header, type HeaderTab } from '@backstage/ui';
+ import { Header, type HeaderNavTabItem } from '@backstage/ui';

  // Tabs no longer support matchStrategy — active state is controlled via activeTabId
- const tabs: HeaderTab[] = [
-   { id: 'overview', label: 'Overview', href: '/overview', matchStrategy: 'prefix' },
+ const tabs: HeaderNavTabItem[] = [
+   { id: 'overview', label: 'Overview', href: '/overview' },
  ];

- <Header title="My Page" tabs={tabs} />
+ <Header title="My Page" tabs={tabs} activeTabId="overview" />
```

**Affected components:** Header
