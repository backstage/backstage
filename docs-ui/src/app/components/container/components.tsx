'use client';

import { Container } from '../../../../../packages/ui/src/components/Container/Container';
import { Box } from '../../../../../packages/ui/src/components/Box/Box';
import { Text } from '../../../../../packages/ui/src/components/Text/Text';

export const Preview = () => {
  return (
    <Container py="4">
      <Text>Content is centered with max-width</Text>
    </Container>
  );
};

export const BasicUsagePreview = () => {
  return (
    <Container>
      <Box>Hello World</Box>
      <Box>Hello World</Box>
      <Box>Hello World</Box>
    </Container>
  );
};

export const ResponsiveSpacingPreview = () => {
  return (
    <Container py={{ initial: '2', md: '4' }}>
      <Box>Hello World</Box>
      <Box>Hello World</Box>
      <Box>Hello World</Box>
    </Container>
  );
};
