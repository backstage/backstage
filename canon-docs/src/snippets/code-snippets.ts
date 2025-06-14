// Sometimes codes are not formatted correctly in the docs, so we need to use snippets

export const customTheme = `:root {
  --canon-font-regular: system-ui;
  --canon-font-weight-regular: 400;
  --canon-font-weight-bold: 600;
  --canon-bg: #f8f8f8;
  --canon-bg-surface-1: #fff;
  /* ... other CSS variables */

  /* Add your custom components styles here */
  .canon-Button {
    background-color: #000;
    color: #fff;
  }
}

[data-theme='dark'] {
  --canon-font-regular: system-ui;
  --canon-font-weight-regular: 400;
  --canon-font-weight-bold: 600;
  --canon-bg: #f8f8f8;
  --canon-bg-surface-1: #fff;
  /* ... other CSS variables */

  /* Add your custom components styles here */
  .canon-Button {
    background-color: #000;
    color: #fff;
  }
}
`;

export const grid = `import { Grid } from '@backstage/canon';

<Grid>
  <Grid.Item />
</Grid>
`;

export const buttonVariants = `<Flex align="center">
  <Button iconStart="cloud" variant="primary">
    Button
  </Button>
  <Button iconStart="cloud" variant="secondary">
    Button
  </Button>
  <Button iconStart="cloud" variant="tertiary">
    Button
  </Button>
</Flex>
`;

export const iconButtonVariants = `<Flex align="center">
  <IconButton icon="cloud" variant="primary" />
  <IconButton icon="cloud" variant="secondary" />
</Flex>
`;

export const flexFAQ1 = `<Grid columns={3} gap="4">
  <Box>Hello World</Box>
  <Box>Hello World</Box>
  <Box>Hello World</Box>
</Grid>`;

export const flexSimple = `<Flex>
  <Box>Hello World</Box>
  <Box>Hello World</Box>
  <Box>Hello World</Box>
</Flex>`;

export const flexResponsive = `<Flex gap={{ xs: 'sm', md: 'md' }}>
  <Box>Hello World</Box>
  <Box>Hello World</Box>
  <Box>Hello World</Box>
</Flex>`;

export const flexAlign = `<Flex align={{ xs: 'left', md: 'center' }}>
  <Box>Hello World</Box>
  <Box>Hello World</Box>
  <Box>Hello World</Box>
</Flex>`;
