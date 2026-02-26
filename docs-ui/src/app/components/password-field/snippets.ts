export const passwordFieldUsageSnippet = `import { PasswordField } from '@backstage/ui';

<PasswordField label="Password" />`;

export const withLabelSnippet = `<PasswordField
  name="password"
  label="Password"
/>`;

export const sizesSnippet = `<Flex direction="column" gap="4">
  <PasswordField size="small" name="password" label="Password" />
  <PasswordField size="medium" name="password" label="Password" />
</Flex>`;

export const withDescriptionSnippet = `<PasswordField
  name="password"
  label="Password"
  description="Enter your password"
/>`;

export const withIconSnippet = `<PasswordField
  name="password"
  label="Password"
  icon={<RiLockLine />}
/>`;

export const validationSnippet = `<PasswordField
  name="password"
  label="Password"
  isRequired
  isInvalid
  description="Password must be at least 8 characters"
/>`;
