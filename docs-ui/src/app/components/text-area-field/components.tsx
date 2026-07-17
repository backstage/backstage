'use client';

import { TextAreaField } from '../../../../../packages/ui/src/components/TextAreaField/TextAreaField';
import { Flex } from '../../../../../packages/ui/src/components/Flex/Flex';

export const WithLabel = () => {
  return (
    <TextAreaField
      name="message"
      placeholder="Enter a message"
      label="Message"
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
      <TextAreaField
        name="message"
        placeholder="Enter a message"
        label="Small"
        size="small"
      />
      <TextAreaField
        name="message"
        placeholder="Enter a message"
        label="Medium"
        size="medium"
      />
    </Flex>
  );
};

export const WithDescription = () => {
  return (
    <TextAreaField
      name="message"
      placeholder="Enter a message"
      label="Message"
      description="Share as much detail as you like."
      style={{ maxWidth: '300px' }}
    />
  );
};
