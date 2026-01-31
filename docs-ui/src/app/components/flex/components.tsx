'use client';

import { Flex } from '../../../../../packages/ui/src/components/Flex/Flex';
import { DecorativeBox } from '@/components/DecorativeBox';

export const Default = () => {
  return (
    <Flex gap="4">
      <DecorativeBox />
      <DecorativeBox />
      <DecorativeBox />
    </Flex>
  );
};

export const DirectionExample = () => {
  return (
    <Flex direction="column" gap="2">
      <DecorativeBox>First</DecorativeBox>
      <DecorativeBox>Second</DecorativeBox>
      <DecorativeBox>Third</DecorativeBox>
    </Flex>
  );
};

export const ResponsiveExample = () => {
  return (
    <Flex gap={{ initial: '2', md: '4' }}>
      <DecorativeBox>1</DecorativeBox>
      <DecorativeBox>2</DecorativeBox>
      <DecorativeBox>3</DecorativeBox>
    </Flex>
  );
};

export const AlignExample = () => {
  return (
    <Flex align="center" justify="between" gap="4" style={{ width: '300px' }}>
      <DecorativeBox>Start</DecorativeBox>
      <DecorativeBox>Middle</DecorativeBox>
      <DecorativeBox>End</DecorativeBox>
    </Flex>
  );
};
