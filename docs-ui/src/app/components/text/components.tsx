'use client';

import { Text } from '../../../../../packages/ui/src/components/Text/Text';
import { Flex } from '../../../../../packages/ui/src/components/Flex/Flex';

export const Default = () => {
  return <Text>This is a text component</Text>;
};

export const Variants = () => {
  return (
    <Flex direction="column" gap="2">
      <Text variant="title-large">Title Large</Text>
      <Text variant="title-medium">Title Medium</Text>
      <Text variant="title-small">Title Small</Text>
      <Text variant="title-x-small">Title X-Small</Text>
      <Text variant="body-large">Body Large</Text>
      <Text variant="body-medium">Body Medium</Text>
      <Text variant="body-small">Body Small</Text>
      <Text variant="body-x-small">Body X-Small</Text>
    </Flex>
  );
};

export const Colors = () => {
  return (
    <Flex direction="column" gap="2">
      <Text color="primary">Primary</Text>
      <Text color="secondary">Secondary</Text>
      <Text color="danger">Danger</Text>
      <Text color="warning">Warning</Text>
      <Text color="success">Success</Text>
      <Text color="info">Info</Text>
    </Flex>
  );
};

export const Weights = () => {
  return (
    <Flex direction="column" gap="2">
      <Text weight="regular">Regular weight</Text>
      <Text weight="bold">Bold weight</Text>
    </Flex>
  );
};

export const AsElement = () => {
  return (
    <Flex direction="column" gap="2">
      <Text as="p">Paragraph element</Text>
      <Text as="span">Span element</Text>
      <Text as="div">Div element</Text>
    </Flex>
  );
};

export const Truncate = () => {
  return (
    <div style={{ width: '200px' }}>
      <Text truncate style={{ display: 'block' }}>
        This is a very long text that will be truncated when it exceeds the
        container width
      </Text>
    </div>
  );
};
