'use client';

import { Grid } from '../../../../../packages/ui/src/components/Grid/Grid';
import { Box } from '../../../../../packages/ui/src/components/Box/Box';

const boxStyle = {
  height: '64px',
  background: '#eaf2fd',
  border: '1px solid #2563eb',
  borderRadius: '4px',
};

const labelBoxStyle = {
  padding: '8px 12px',
  background: '#eaf2fd',
  border: '1px solid #2563eb',
  borderRadius: '4px',
};

export const Default = () => {
  return (
    <Grid.Root columns="3" gap="4">
      <Box style={boxStyle} />
      <Box style={boxStyle} />
      <Box style={boxStyle} />
      <Box style={boxStyle} />
      <Box style={boxStyle} />
      <Box style={boxStyle} />
    </Grid.Root>
  );
};

export const ResponsiveExample = () => {
  return (
    <Grid.Root columns={{ initial: '2', md: '4' }} gap="4">
      <Box style={labelBoxStyle}>1</Box>
      <Box style={labelBoxStyle}>2</Box>
      <Box style={labelBoxStyle}>3</Box>
      <Box style={labelBoxStyle}>4</Box>
    </Grid.Root>
  );
};

export const GridItemExample = () => {
  return (
    <Grid.Root columns="4" gap="4">
      <Grid.Item colSpan="2" style={labelBoxStyle}>
        Spans 2 columns
      </Grid.Item>
      <Box style={labelBoxStyle}>1 column</Box>
      <Box style={labelBoxStyle}>1 column</Box>
    </Grid.Root>
  );
};
