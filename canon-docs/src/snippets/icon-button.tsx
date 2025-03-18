'use client';

import { IconButton, Flex, ButtonProps, Text } from '../../../packages/canon';

export const IconButtonPreview = () => {
  return (
    <Flex align="center">
      <IconButton icon="cloud" variant="primary" />
      <IconButton icon="cloud" variant="secondary" />
    </Flex>
  );
};

export const IconButtonSizes = () => {
  return (
    <Flex align="center">
      <IconButton icon="cloud" size="medium" />
      <IconButton icon="cloud" size="small" />
    </Flex>
  );
};

export const IconButtonDisabled = () => {
  return <IconButton icon="cloud" disabled />;
};

export const IconButtonResponsive = () => {
  return (
    <IconButton
      icon="cloud"
      variant={{ initial: 'primary', lg: 'secondary' }}
    />
  );
};

export const IconButtonPlayground = () => {
  const variants: string[] = ['primary', 'secondary'];

  return (
    <Flex direction="column">
      {variants.map(variant => (
        <Flex direction="column" key={variant}>
          <Text>{variant}</Text>
          {['small', 'medium'].map(size => (
            <Flex align="center" key={size}>
              <IconButton
                icon="cloud"
                variant={variant as ButtonProps['variant']}
                size={size as ButtonProps['size']}
              />
            </Flex>
          ))}
        </Flex>
      ))}
    </Flex>
  );
};
