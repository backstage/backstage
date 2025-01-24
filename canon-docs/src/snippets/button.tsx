'use client';

import {
  Inline,
  Button,
  Stack,
  ButtonProps,
  Text,
} from '../../../packages/canon';

export const ButtonPreview = () => {
  return (
    <Inline alignY="center">
      <Button iconStart="cloud" variant="primary">
        Button
      </Button>
      <Button iconStart="cloud" variant="secondary">
        Button
      </Button>
      <Button iconStart="cloud" variant="tertiary">
        Button
      </Button>
    </Inline>
  );
};

export const ButtonSizes = () => {
  return (
    <Inline alignY="center">
      <Button size="medium">Medium</Button>
      <Button size="small">Small</Button>
    </Inline>
  );
};

export const ButtonWithIcons = () => {
  return (
    <Inline alignY="center">
      <Button iconStart="cloud">Button</Button>
      <Button iconEnd="chevronRight">Button</Button>
      <Button iconStart="cloud" iconEnd="chevronRight">
        Button
      </Button>
    </Inline>
  );
};

export const ButtonFullWidth = () => {
  return (
    <Stack style={{ width: '300px' }}>
      <Button iconStart="cloud">Button</Button>
      <Button iconEnd="chevronRight">Button</Button>
      <Button iconStart="cloud" iconEnd="chevronRight">
        Button
      </Button>
    </Stack>
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
    <Stack>
      {variants.map(variant => (
        <Stack key={variant}>
          <Text>{variant}</Text>
          {['small', 'medium'].map(size => (
            <Inline alignY="center" key={size}>
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
            </Inline>
          ))}
        </Stack>
      ))}
    </Stack>
  );
};
