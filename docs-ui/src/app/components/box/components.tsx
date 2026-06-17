'use client';

import { Box } from '../../../../../packages/ui/src/components/Box/Box';
import { Flex } from '../../../../../packages/ui/src/components/Flex/Flex';
import { DecorativeBox } from '@/components/DecorativeBox';

export const Default = () => {
  return (
    <Box width="64px" height="64px">
      <DecorativeBox />
    </Box>
  );
};

export const Surface = () => {
  return (
    <Flex direction="column" gap="4">
      <Box p="4" surface="0">
        Surface 0
      </Box>
      <Box p="4" surface="1">
        Surface 1
      </Box>
      <Box p="4" surface="2">
        Surface 2
      </Box>
      <Box p="4" surface="3">
        Surface 3
      </Box>
    </Flex>
  );
};

export const Responsive = () => {
  return (
    <Box
      p={{ initial: '2', md: '4' }}
      display={{ initial: 'block', md: 'flex' }}
    >
      <DecorativeBox>Resize to see change</DecorativeBox>
    </Box>
  );
};
