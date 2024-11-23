import React from 'react';
import { Stack } from '../../stack/stack';
import { Inline } from '../../inline/inline';
import { Box } from '../box';

const FakeBox = ({ children }: { children: string }) => (
  <Box
    px="md"
    py="sm"
    borderRadius="small"
    style={{ background: '#1f47ff', color: 'white' }}
  >
    {children}
  </Box>
);

export const Padding = () => {
  return (
    <Stack
      align="center"
      borderRadius="small"
      mb="md"
      gap="xl"
      py="xl"
      style={{ border: '1px solid #e7e7e7' }}
    >
      <Inline align="center" gap="xl">
        <Stack
          align="center"
          borderRadius="small"
          p="md"
          style={{ background: '#c4cafb', color: 'white' }}
        >
          <FakeBox>padding</FakeBox>
        </Stack>
        <Stack
          align="center"
          borderRadius="small"
          px="md"
          style={{ background: '#c4cafb', color: 'white' }}
        >
          <FakeBox>paddingX</FakeBox>
        </Stack>
        <Stack
          align="center"
          borderRadius="small"
          py="md"
          style={{ background: '#c4cafb', color: 'white' }}
        >
          <FakeBox>paddingY</FakeBox>
        </Stack>
      </Inline>
      <Inline align="center" gap="xl">
        <Stack
          align="center"
          borderRadius="small"
          pt="md"
          style={{ background: '#c4cafb', color: 'white' }}
        >
          <FakeBox>paddingTop</FakeBox>
        </Stack>
        <Stack
          align="center"
          borderRadius="small"
          pb="md"
          style={{ background: '#c4cafb', color: 'white' }}
        >
          <FakeBox>paddingBottom</FakeBox>
        </Stack>
        <Stack
          align="center"
          borderRadius="small"
          pl="md"
          style={{ background: '#c4cafb', color: 'white' }}
        >
          <FakeBox>paddingLeft</FakeBox>
        </Stack>
        <Stack
          align="center"
          borderRadius="small"
          pr="md"
          style={{ background: '#c4cafb', color: 'white' }}
        >
          <FakeBox>paddingRight</FakeBox>
        </Stack>
      </Inline>
    </Stack>
  );
};
