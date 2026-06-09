export const breadcrumbRegistrationSnippet = `import { BreadcrumbRegistration } from '@backstage/ui';

function SettingsPage() {
  return (
    <BreadcrumbRegistration entry={{ label: 'Settings', href: '/settings' }}>
      <h1>Settings</h1>
      {/* "Settings" is now in the breadcrumb trail for any useBreadcrumbs() consumer */}
    </BreadcrumbRegistration>
  );
}`;

export const useBreadcrumbsConsumerSnippet = `import { useBreadcrumbs, Breadcrumbs, Breadcrumb } from '@backstage/ui';

function MyHeader({ title }: { title: string }) {
  // Returns all registered entries sorted by nesting depth
  const breadcrumbs = useBreadcrumbs();

  return (
    <Breadcrumbs>
      {breadcrumbs.map(entry => (
        <Breadcrumb key={entry.label} href={entry.href}>
          {entry.label}
        </Breadcrumb>
      ))}
      <Breadcrumb>{title}</Breadcrumb>
    </Breadcrumbs>
  );
}`;

export const nestedExampleSnippet = `import { BreadcrumbRegistration, useBreadcrumbs } from '@backstage/ui';

// Depth is tracked automatically via nesting.
// A sibling header can read the full trail — it doesn't need to be
// a descendant of the registrations.
function App() {
  return (
    <BreadcrumbRegistration entry={{ label: 'Catalog', href: '/catalog' }}>
      <PageHeader />
      <BreadcrumbRegistration entry={{ label: 'Entity', href: '/catalog/entity' }}>
        {/* useBreadcrumbs() anywhere returns:
            [{ label: 'Catalog', href: '/catalog' },
             { label: 'Entity', href: '/catalog/entity' }] */}
        <EntityContent />
      </BreadcrumbRegistration>
    </BreadcrumbRegistration>
  );
}`;

export const subPageRoutesSnippet = `// --- plugin.tsx ---
// The plugin root page and sub-page are registered via blueprints.
// The framework handles their breadcrumbs automatically — no manual
// BreadcrumbRegistration needed at this level.

import { PageBlueprint, SubPageBlueprint } from '@backstage/frontend-plugin-api';

// Registered automatically as "Create" breadcrumb
const scaffolderPage = PageBlueprint.make({
  params: {
    path: '/create',
    title: 'Create',
    // ...
  },
});

// Registered automatically as "Tasks" breadcrumb
const scaffolderTasksSubPage = SubPageBlueprint.make({
  name: 'tasks',
  params: {
    path: 'tasks',
    title: 'Tasks',
    loader: () => import('./components/TasksSubPage').then(m => <m.TasksSubPage />),
  },
});

// --- TasksSubPage.tsx ---
// Inside the sub-page component, internal routes need manual
// BreadcrumbRegistration. The index route doesn't need one since
// the sub-page breadcrumb ("Tasks") already covers it.

import { Routes, Route, useParams } from 'react-router-dom';
import { BreadcrumbRegistration } from '@backstage/ui';

// For dynamic route params, extract the param and use it as the label.
function TaskDetailWithBreadcrumb() {
  const { taskId } = useParams<{ taskId: string }>();
  return (
    <BreadcrumbRegistration
      entry={{ label: taskId ?? 'Task', href: taskId ?? '' }}
    >
      <OngoingTaskBody />
    </BreadcrumbRegistration>
  );
}

// On /create/tasks         → Create > Tasks          (all automatic)
// On /create/tasks/abc-123 → Create > Tasks > abc-123 (abc-123 is manual)
function TasksSubPage() {
  return (
    <Routes>
      <Route path=":taskId" element={<TaskDetailWithBreadcrumb />} />
      // ...
    </Routes>
  );
}`;

export const stateBasedSnippet = `import { useState } from 'react';
import { BreadcrumbRegistration } from '@backstage/ui';

// BreadcrumbRegistration also works with state-driven views
// that don't use routes — tabs, selection panels, etc.
// The breadcrumb updates reactively when the label changes.

function ActionsPage() {
  const [selectedActionId, setSelectedActionId] = useState<string>();

  const content = (
    <>
      <ActionList onSelect={setSelectedActionId} />
      {selectedActionId && <ActionDetail id={selectedActionId} />}
    </>
  );

  // Only register a breadcrumb when an action is selected.
  // On /create/actions             → Create > Actions
  // On /create/actions (selected)  → Create > Actions > debug:log
  if (selectedActionId) {
    return (
      <BreadcrumbRegistration entry={{ label: selectedActionId, href: '#' }}>
        {content}
      </BreadcrumbRegistration>
    );
  }

  return content;
}

// For tab-based views, register the active tab label.
// Switching tabs updates the breadcrumb automatically.
// On /create/templating-extensions → Create > Templating Extensions > Filters
function TemplatingExtensionsContent() {
  const [tab, setTab] = useState('filter');
  const tabLabels = { filter: 'Filters', function: 'Functions', value: 'Values' };

  return (
    <BreadcrumbRegistration entry={{ label: tabLabels[tab], href: '#' }}>
      <Tabs value={tab} onChange={setTab}>
        {/* ... */}
      </Tabs>
      {/* tab content */}
    </BreadcrumbRegistration>
  );
}`;
