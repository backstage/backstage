export const buttonSnippetUsage = `import { Button } from '@backstage/ui';

<Button>Click me</Button>`;

export const buttonResponsiveSnippet = `<Button variant={{ initial: 'primary', lg: 'secondary' }}>
  Responsive Button
</Button>`;

export const variantsSnippet = `<Flex>
  <Button variant="primary" iconStart={<RiCloudLine />}>
    Button
  </Button>
  <Button variant="secondary" iconStart={<RiCloudLine />}>
    Button
  </Button>
  <Button variant="tertiary" iconStart={<RiCloudLine />}>
    Button
  </Button>
</Flex>`;

export const sizesSnippet = `<Flex align="center">
  <Button size="small">Small</Button>
  <Button size="medium">Medium</Button>
</Flex>`;

export const withIconsSnippet = `<Flex align="center">
  <Button iconStart={<RiCloudLine />}>Button</Button>
  <Button iconEnd={<RiArrowRightSLine />}>Button</Button>
  <Button iconStart={<RiCloudLine />} iconEnd={<RiArrowRightSLine />}>
    Button
  </Button>
</Flex>`;

export const disabledSnippet = `<Flex gap="4">
  <Button variant="primary" isDisabled>
    Primary
  </Button>
  <Button variant="secondary" isDisabled>
    Secondary
  </Button>
  <Button variant="tertiary" isDisabled>
    Tertiary
  </Button>
</Flex>`;

export const destructiveSnippet = `<Flex gap="4">
  <Button variant="primary" destructive>
    Primary
  </Button>
  <Button variant="secondary" destructive>
    Secondary
  </Button>
  <Button variant="tertiary" destructive>
    Tertiary
  </Button>
</Flex>`;

export const loadingSnippet = `<Button variant="primary" loading={true}>
  Load more items
</Button>`;

export const asLinkSnippet = `<MemoryRouter>
  <ButtonLink href="https://ui.backstage.io" target="_blank">
    Button
  </ButtonLink>
</MemoryRouter>`;
