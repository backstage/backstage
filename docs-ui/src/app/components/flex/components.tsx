'use client';

import { Flex } from '../../../../../packages/ui/src/components/Flex/Flex';
import { Box } from '../../../../../packages/ui/src/components/Box/Box';

const boxStyle = {
  width: '64px',
  height: '64px',
  background: '#eaf2fd',
  border: '1px solid #2563eb',
  borderRadius: '4px',
};

const smallBoxStyle = {
  padding: '8px 12px',
  background: '#eaf2fd',
  border: '1px solid #2563eb',
  borderRadius: '4px',
};

export const Default = () => {
  return (
    <Flex gap="4">
      <Box style={boxStyle} />
      <Box style={boxStyle} />
      <Box style={boxStyle} />
    </Flex>
  );
};

export const DirectionExample = () => {
  return (
    <Flex direction="column" gap="2">
      <Box style={smallBoxStyle}>First</Box>
      <Box style={smallBoxStyle}>Second</Box>
      <Box style={smallBoxStyle}>Third</Box>
    </Flex>
  );
};

export const ResponsiveExample = () => {
  return (
    <Flex gap={{ initial: '2', md: '4' }}>
      <Box style={smallBoxStyle}>Item 1</Box>
      <Box style={smallBoxStyle}>Item 2</Box>
      <Box style={smallBoxStyle}>Item 3</Box>
    </Flex>
  );
};

export const AlignExample = () => {
  return (
    <Flex align="center" justify="between" gap="4" style={{ width: '300px' }}>
      <Box style={smallBoxStyle}>Start</Box>
      <Box style={smallBoxStyle}>Middle</Box>
      <Box style={smallBoxStyle}>End</Box>
    </Flex>
  );
};
