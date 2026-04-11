import type { EvalTask } from '../types';

const task: EvalTask = {
  id: 'dialog-form',
  tier: 'component',
  title: 'Dialog with Form',
  prompt: `Build a React component called CreateItemDialog using @backstage/ui components.

The component should contain:
- A Button labeled "Create new item" that opens a Dialog when clicked
- The Dialog should have a title "Create new item"
- Inside the dialog, a form with:
  - A TextField with label "Name"
  - A Select with label "Type" and options: "Service", "Library", "Website"
  - A Flex row of buttons at the bottom: a secondary "Cancel" button and a primary "Create" button

All components must be imported from "@backstage/ui". Use controlled open state with React.useState.

Return only a valid TSX code block, no explanation.`,
  relevantComponents: ['Dialog', 'Button', 'TextField', 'Select', 'Flex'],
};

export default task;
