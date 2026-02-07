'use client';

import { Grid } from '../../../../../packages/ui/src/components/Grid/Grid';
import { DecorativeBox } from '@/components/DecorativeBox';

export const Default = () => {
  return (
    <Grid.Root columns="3" gap="4">
      <DecorativeBox />
      <DecorativeBox />
      <DecorativeBox />
      <DecorativeBox />
      <DecorativeBox />
      <DecorativeBox />
    </Grid.Root>
  );
};

export const ResponsiveExample = () => {
  return (
    <Grid.Root columns={{ initial: '2', md: '4' }} gap="4">
      <DecorativeBox>1</DecorativeBox>
      <DecorativeBox>2</DecorativeBox>
      <DecorativeBox>3</DecorativeBox>
      <DecorativeBox>4</DecorativeBox>
    </Grid.Root>
  );
};

export const GridItemExample = () => {
  return (
    <Grid.Root columns="4" gap="4">
      <Grid.Item colSpan="2">
        <DecorativeBox>Spans 2 columns</DecorativeBox>
      </Grid.Item>
      <DecorativeBox>1 column</DecorativeBox>
      <DecorativeBox>1 column</DecorativeBox>
    </Grid.Root>
  );
};
