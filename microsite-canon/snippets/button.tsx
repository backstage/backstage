'use client';

import { ButtonProps, Text } from '@backstage/canon';
import { Stack, Inline, Button } from '@backstage/canon';

const variants: string[] = ['primary', 'secondary', 'tertiary'];

const capitalizeFirstLetter = (string: string): string => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const Button1 = () => {
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

export const Button2 = () => {
  return (
    <Inline alignY="center">
      <Button size="small">Small</Button>
      <Button size="medium">Medium</Button>
    </Inline>
  );
};

export const Button3 = () => {
  return (
    <Inline alignY="center">
      <Button iconStart="cloud">Button</Button>
      <Button iconEnd="chevronRight">Button</Button>
      <Button
        iconStart="cloud"
        iconEnd="chevronRight"
        style={{ width: '200px' }}
      >
        Button
      </Button>
    </Inline>
  );
};

export const Button4 = () => {
  return (
    <Stack style={{ width: '300px' }}>
      <Button>Full width</Button>
    </Stack>
  );
};

export const Button5 = () => {
  return <Button disabled>Button</Button>;
};

export const Button6 = () => {
  return null;
  return (
    <Button
      variant={{ xs: 'primary', sm: 'secondary', md: 'tertiary' }}
      size={{ xs: 'small', sm: 'medium' }}
    >
      Button
    </Button>
  );
};

export const ButtonPlayground = () => {
  return (
    <Stack>
      {variants.map(variant => (
        <Stack key={variant}>
          <Text>{capitalizeFirstLetter(variant as string)}</Text>
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
