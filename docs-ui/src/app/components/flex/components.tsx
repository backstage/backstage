'use client';

import { Flex } from '../../../../../packages/ui/src/components/Flex/Flex';
import { Box } from '../../../../../packages/ui/src/components/Box/Box';

export const Default = () => {
  return (
    <Flex gap="4">
      <Box
        style={{
          width: '64px',
          height: '64px',
          background: '#eaf2fd',
          border: '1px solid #2563eb',
          borderRadius: '4px',
        }}
      />
      <Box
        style={{
          width: '64px',
          height: '64px',
          background: '#eaf2fd',
          border: '1px solid #2563eb',
          borderRadius: '4px',
        }}
      />
      <Box
        style={{
          width: '64px',
          height: '64px',
          background: '#eaf2fd',
          border: '1px solid #2563eb',
          borderRadius: '4px',
        }}
      />
    </Flex>
  );
};
