import type { EvalTask } from '../types';

const task: EvalTask = {
  id: 'header-with-actions',
  tier: 'recipe',
  title: 'Header with Actions',
  prompt: `Build a React component called EntityHeader using @backstage/ui components.

The layout should show a Header component with:
- Title: "payment-service"
- Breadcrumbs: [{ label: "Catalog", href: "/catalog" }, { label: "Services", href: "/catalog?kind=Component" }]
- A primary action button "Edit" with an edit icon on the left
- A secondary action button "View logs" with a download icon on the left
- A ButtonIcon for a "More options" overflow menu (secondary variant), which opens a Menu with items: "Share", "Unregister"

Use these @backstage/ui components: Header, Button, ButtonIcon, MenuTrigger, Menu, MenuItem.

Return only a valid TSX code block, no explanation.`,
  relevantComponents: [
    'Header',
    'Button',
    'ButtonIcon',
    'MenuTrigger',
    'Menu',
    'MenuItem',
  ],
  referenceStoryPath:
    'packages/ui/src/recipes/PluginHeaderAndHeader.stories.tsx',
  requiredCompositionChains: [['Header'], ['MenuTrigger', 'Menu', 'MenuItem']],
};

export default task;
