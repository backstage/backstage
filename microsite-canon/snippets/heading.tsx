import { Text, Heading } from '@backstage/canon';
import { Stack } from '@backstage/canon';

export const HeadingPlayground = () => {
  return (
    <Stack>
      <Text>All variants</Text>
      <Heading variant="display">Display</Heading>
      <Heading variant="title1">Title 1</Heading>
      <Heading variant="title2">Title 2</Heading>
      <Heading variant="title3">Title 3</Heading>
      <Heading variant="title4">Title 4</Heading>
      <Heading variant="title5">Title 5</Heading>
    </Stack>
  );
};
