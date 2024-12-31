import { ButtonProps, Text } from '@backstage/canon';
import { Stack, Inline, Button } from '@backstage/canon';

const variants: {
  variant: ButtonProps['variant'];
  size: ButtonProps['size'];
}[] = [
  { variant: 'primary', size: 'small' },
  { variant: 'primary', size: 'medium' },
  { variant: 'secondary', size: 'small' },
  { variant: 'secondary', size: 'medium' },
  { variant: 'tertiary', size: 'small' },
  { variant: 'tertiary', size: 'medium' },
];

const capitalizeFirstLetter = (string: string): string => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const ButtonPlayground = () => {
  return (
    <Stack>
      {variants.map(({ variant, size }) => (
        <Stack key={`${variant}-${size}`}>
          <Text>
            {capitalizeFirstLetter(variant as string)} -{' '}
            {capitalizeFirstLetter(size as string)}
          </Text>
          <Inline alignY="center">
            <Button iconStart="cloud" variant={variant} size={size}>
              Button
            </Button>
            <Button iconEnd="chevronRight" variant={variant} size={size}>
              Button
            </Button>
            <Button
              iconStart="cloud"
              iconEnd="chevronRight"
              style={{ width: '200px' }}
              variant={variant}
              size={size}
            >
              Button
            </Button>
          </Inline>
        </Stack>
      ))}
    </Stack>
  );
};
