import type { EvalTask } from '../types';

const task: EvalTask = {
  id: 'login-form',
  tier: 'component',
  title: 'Login Form',
  prompt: `Build a React component called LoginForm using @backstage/ui components.

The form should contain:
- An email input field (TextField) with label "Email" and type "email"
- A password input field (PasswordField) with label "Password"
- A primary submit Button labeled "Sign in" that spans the full width

Wrap the fields in a Flex column with a gap between them.
All components must be imported from "@backstage/ui".

Return only a valid TSX code block, no explanation.`,
  relevantComponents: ['TextField', 'PasswordField', 'Button', 'Flex'],
};

export default task;
