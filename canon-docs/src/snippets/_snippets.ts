// Sometimes codes are not formatted correctly in the docs, so we need to use snippets

export const grid = `import { Grid } from '@backstage/canon';

<Grid>
  <Grid.Item />
</Grid>
`;

export const buttonVariants = `<Inline alignY="center">
  <Button iconStart="cloud" variant="primary">
    Button
  </Button>
  <Button iconStart="cloud" variant="secondary">
    Button
  </Button>
  <Button iconStart="cloud" variant="tertiary">
    Button
  </Button>
</Inline>
`;

export const stackFAQ1 = `<Grid columns={3} gap="md">
  <Box>Hello World</Box>
  <Box>Hello World</Box>
  <Box>Hello World</Box>
</Grid>`;

export const stackSimple = `<Stack>
  <Box>Hello World</Box>
  <Box>Hello World</Box>
  <Box>Hello World</Box>
</Stack>`;

export const stackResponsive = `<Stack gap={{ xs: 'sm', md: 'md' }}>
  <Box>Hello World</Box>
  <Box>Hello World</Box>
  <Box>Hello World</Box>
</Stack>`;

export const stackAlign = `<Stack align={{ xs: 'left', md: 'center' }}>
  <Box>Hello World</Box>
  <Box>Hello World</Box>
  <Box>Hello World</Box>
</Stack>`;
