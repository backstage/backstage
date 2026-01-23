'use client';

import { PasswordField } from '../../../../../packages/ui/src/components/PasswordField/PasswordField';
import { Flex } from '../../../../../packages/ui/src/components/Flex/Flex';

export const WithLabel = () => {
  return (
    <PasswordField
      name="password"
      label="Password"
      style={{ maxWidth: '300px' }}
    />
  );
};

export const Sizes = () => {
  return (
    <Flex direction="row" gap="4" style={{ width: '100%', maxWidth: '600px' }}>
      <PasswordField name="password" label="Password" size="small" />
      <PasswordField name="password" label="Password" size="medium" />
    </Flex>
  );
};

export const WithDescription = () => {
  return (
    <PasswordField
      name="password"
      label="Password"
      description="Enter your password"
      style={{ maxWidth: '300px' }}
    />
  );
};
