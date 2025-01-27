'use client';

import { Heading, Stack, Text } from '../../../packages/canon';

export const HeadingPreview = () => {
  return <Heading>Look mum, no hands!</Heading>;
};

export const HeadingAllVariants = () => {
  return (
    <Stack>
      <Heading variant="display">Display</Heading>
      <Heading variant="title1">Title 1</Heading>
      <Heading variant="title2">Title 2</Heading>
      <Heading variant="title3">Title 3</Heading>
      <Heading variant="title4">Title 4</Heading>
    </Stack>
  );
};

export const HeadingResponsive = () => {
  return (
    <Stack>
      <Heading variant={{ initial: 'title2', lg: 'title1' }}>
        Responsive heading
      </Heading>
    </Stack>
  );
};

export const HeadingPlayground = () => {
  return (
    <Stack>
      <Text>All variants</Text>
      <Heading variant="display">Display</Heading>
      <Heading variant="title1">Title 1</Heading>
      <Heading variant="title2">Title 2</Heading>
      <Heading variant="title3">Title 3</Heading>
      <Heading variant="title4">Title 4</Heading>
    </Stack>
  );
};
