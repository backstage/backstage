export const passwordFieldUsageSnippet = `import { PasswordField } from '@backstage/ui';

<PasswordField />`;

export const withLabelSnippet = `<PasswordField
  name="password"
  label="Password"
/>`;

export const sizesSnippet = `<Flex direction="row" gap="4">
  <PasswordField name="password" label="Password" size="small" />
  <PasswordField name="password" label="Password" size="medium" />
</Flex>`;

export const withDescriptionSnippet = `<PasswordField
  name="password"
  label="Password"
  description="Enter your password"
/>`;
