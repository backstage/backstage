import { Text } from '@backstage/canon';
import { Stack, Inline, Checkbox } from '@backstage/canon';

export const CheckboxPlayground = () => {
  return (
    <Stack>
      <Stack>
        <Text>All variants</Text>
        <Inline alignY="center">
          <Checkbox />
          <Checkbox checked />
          <Checkbox label="Checkbox" />
          <Checkbox label="Checkbox" checked />
        </Inline>
      </Stack>
    </Stack>
  );
};
