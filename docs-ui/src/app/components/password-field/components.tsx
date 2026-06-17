'use client';

import { PasswordField } from '../../../../../packages/ui/src/components/PasswordField/PasswordField';
import { Flex } from '../../../../../packages/ui/src/components/Flex/Flex';
import { RiLockLine } from '@remixicon/react';

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
    <Flex
      direction="column"
      gap="4"
      style={{ width: '100%', maxWidth: '300px' }}
    >
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

export const WithIcon = () => {
  return (
    <PasswordField
      name="password"
      label="Password"
      icon={<RiLockLine />}
      style={{ maxWidth: '300px' }}
    />
  );
};

export const Validation = () => {
  return (
    <PasswordField
      name="password"
      label="Password"
      isRequired
      isInvalid
      description="Password must be at least 8 characters"
      style={{ maxWidth: '300px' }}
    />
  );
};
