import type { EvalTask } from '../types';

const task: EvalTask = {
  id: 'cards-with-table',
  tier: 'recipe',
  title: 'Cards with Table',
  prompt: `Build a React component called CatalogDashboard using @backstage/ui components.

The page layout should contain:
1. A page header (Header) with the title "Catalog" and a "Register component" primary action button
2. A three-column grid of metric stat cards, each showing a label, a large numeric value, and a trend line in a secondary colour
3. A paginated data table below the cards showing catalog services with columns: Name (with description), Owner, Type, and Lifecycle

For the table, use the useTable hook with mode "complete" and paginationOptions.
Use ColumnConfig to define columns and CellText / CellProfile for cell renderers.

Use these @backstage/ui components: Header, Button, Card, CardHeader, CardBody, Grid, Container, Flex, Text, Table, useTable, CellText, CellProfile.

Wrap the page in a BUIProvider and MemoryRouter (for the router context).

Return only a valid TSX code block, no explanation.`,
  relevantComponents: [
    'Header',
    'Button',
    'Card',
    'CardHeader',
    'CardBody',
    'Grid',
    'Container',
    'Flex',
    'Text',
    'Table',
    'useTable',
    'CellText',
    'CellProfile',
  ],
  referenceStoryPath: 'packages/ui/src/guidelines/CardsWithTable.stories.tsx',
  requiredCompositionChains: [
    ['Grid', 'Card', 'CardBody', 'Text'],
    ['Table'],
    ['useTable'],
  ],
};

export default task;
