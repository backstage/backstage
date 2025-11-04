import { classNamePropDefs, stylePropDefs } from '@/utils/propDefs';
import type { PropDef } from '@/utils/propDefs';

export const avatarPropDefs: Record<string, PropDef> = {
  src: {
    type: 'string',
  },
  name: {
    type: 'string',
  },
  size: {
    type: 'enum',
    values: ['x-small', 'small', 'medium', 'large', 'x-large'],
    default: 'medium',
    responsive: true,
  },
  purpose: {
    type: 'enum',
    values: ['informative', 'decoration'],
    default: 'informative',
  },
  ...classNamePropDefs,
  ...stylePropDefs,
};

export const snippetUsage = `import { Avatar } from '@backstage/ui';

<Avatar
  src="https://avatars.githubusercontent.com/u/1540635?v=4"
  name="Charles de Dreuille"
/>`;

export const snippetSizes = `<Flex gap="4" direction="column">
  <Avatar
    src="https://avatars.githubusercontent.com/u/1540635?v=4"
    name="Charles de Dreuille" size="x-small"
  />
  <Avatar
    src="https://avatars.githubusercontent.com/u/1540635?v=4"
    name="Charles de Dreuille" size="small"
  />
  <Avatar
    src="https://avatars.githubusercontent.com/u/1540635?v=4"
    name="Charles de Dreuille" size="medium"
  />
  <Avatar
    src="https://avatars.githubusercontent.com/u/1540635?v=4"
    name="Charles de Dreuille" size="large"
  />
  <Avatar
    src="https://avatars.githubusercontent.com/u/1540635?v=4"
    name="Charles de Dreuille" size="x-large"
  />
</Flex>`;

export const snippetFallback = `<Avatar
  src="https://avatars.githubusercontent.com/u/15406AAAAAAAAA"
  name="Charles de Dreuille"
/>`;

export const snippetPurpose = `<Flex direction="column" gap="4">
  <Flex direction="column" gap="1">
    <Text variant="title-x-small">Informative (default)</Text>
    <Text variant="body-medium">
      Use when avatar appears alone. Announced as "Charles de Dreuille" to screen readers:
    </Text>
    <Flex gap="2" align="center">
      <Avatar
        src="https://avatars.githubusercontent.com/u/1540635?v=4"
        name="Charles de Dreuille"
        purpose="informative"
      />
    </Flex>
  </Flex>
  <Flex direction="column" gap="1">
    <Text variant="title-x-small">Decoration</Text>
    <Text variant="body-medium">
      Use when name appears adjacent to avatar. Hidden from screen readers to avoid redundancy:
    </Text>
    <Flex gap="2" align="center">
      <Avatar
        src="https://avatars.githubusercontent.com/u/1540635?v=4"
        name="Charles de Dreuille"
        purpose="decoration"
      />
      <Text>Charles de Dreuille</Text>
    </Flex>
  </Flex>
</Flex>`;
