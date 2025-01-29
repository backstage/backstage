'use client';

import { Button, Flex, ButtonProps, Text } from '../../../packages/canon';

export const ButtonPreview = () => {
  return (
    <Flex align="center">
      <Button iconStart="cloud" variant="primary">
        Button
      </Button>
      <Button iconStart="cloud" variant="secondary">
        Button
      </Button>
      <Button iconStart="cloud" variant="tertiary">
        Button
      </Button>
    </Flex>
  );
};

export const ButtonSizes = () => {
  return (
    <Flex align="center">
      <Button size="medium">Medium</Button>
      <Button size="small">Small</Button>
    </Flex>
  );
};

export const ButtonWithIcons = () => {
  return (
    <Flex align="center">
      <Button iconStart="cloud">Button</Button>
      <Button iconEnd="chevronRight">Button</Button>
      <Button iconStart="cloud" iconEnd="chevronRight">
        Button
      </Button>
    </Flex>
  );
};

export const ButtonFullWidth = () => {
  return (
    <Flex direction="column" style={{ width: '300px' }}>
      <Button iconStart="cloud">Button</Button>
      <Button iconEnd="chevronRight">Button</Button>
      <Button iconStart="cloud" iconEnd="chevronRight">
        Button
      </Button>
    </Flex>
  );
};

export const ButtonDisabled = () => {
  return <Button disabled>Button</Button>;
};

export const ButtonResponsive = () => {
  return (
    <Button variant={{ initial: 'primary', lg: 'secondary' }}>
      Responsive Button
    </Button>
  );
};

export const ButtonPlayground = () => {
  const variants: string[] = ['primary', 'secondary', 'tertiary'];

  return (
    <Flex direction="column">
      {variants.map(variant => (
        <Flex direction="column" key={variant}>
          <Text>{variant}</Text>
          {['small', 'medium'].map(size => (
            <Flex align="center" key={size}>
              <Button
                iconStart="cloud"
                variant={variant as ButtonProps['variant']}
                size={size as ButtonProps['size']}
              >
                Button
              </Button>
              <Button
                iconEnd="chevronRight"
                variant={variant as ButtonProps['variant']}
                size={size as ButtonProps['size']}
              >
                Button
              </Button>
              <Button
                iconStart="cloud"
                iconEnd="chevronRight"
                style={{ width: '200px' }}
                variant={variant as ButtonProps['variant']}
                size={size as ButtonProps['size']}
              >
                Button
              </Button>
            </Flex>
          ))}
        </Flex>
      ))}
    </Flex>
  );
};
