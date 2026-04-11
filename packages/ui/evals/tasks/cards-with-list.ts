import type { EvalTask } from '../types';

const task: EvalTask = {
  id: 'cards-with-list',
  tier: 'recipe',
  title: 'Cards with List',
  prompt: `Build a React component called ServiceCatalog using @backstage/ui components.

The layout should show two cards side by side in a two-column grid:
- "Frontend services" card containing a list of frontend service items
- "Backend services" card containing a list of backend service items

Each list item should display a service name, and have:
- An icon on the left
- A contextual action menu (Edit, Share, Delete) triggered from the list row
- Tags displayed as a tag group on the right (e.g. "production", "experimental")

Use these @backstage/ui components: Card, CardHeader, CardBody, Grid, List, ListRow, TagGroup, Tag, MenuTrigger, Menu, MenuItem.
Wrap the whole thing in a Container with some top padding.

Return only a valid TSX code block, no explanation.`,
  relevantComponents: [
    'Card',
    'CardHeader',
    'CardBody',
    'Grid',
    'List',
    'ListRow',
    'TagGroup',
    'Tag',
    'MenuItem',
    'Container',
    'Flex',
    'Text',
  ],
  referenceStoryPath: 'packages/ui/src/recipes/CardsWithList.stories.tsx',
  requiredCompositionChains: [
    ['Grid', 'Card', 'CardBody', 'List', 'ListRow'],
    ['ListRow', 'TagGroup', 'Tag'],
  ],
};

export default task;
