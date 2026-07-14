'use client';

import { TextAreaField } from '../../../../../packages/ui/src/components/TextAreaField/TextAreaField';
import { Flex } from '../../../../../packages/ui/src/components/Flex/Flex';
import { Form } from 'react-aria-components';

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

export const Scrolling = () => {
  return (
    <TextAreaField
      name="message"
      label="Message"
      rows={3}
      defaultValue={Array.from(
        { length: 12 },
        (_, i) => `Line ${i + 1}: this content scrolls within a fixed height.`,
      ).join('\n')}
      style={{ maxWidth: '300px' }}
    />
  );
};

export const ShowError = () => {
  return (
    <Form validationErrors={{ message: 'Message is required' }}>
      <TextAreaField
        name="message"
        placeholder="Enter a message"
        label="Message"
        style={{ maxWidth: '300px' }}
      />
    </Form>
  );
};
