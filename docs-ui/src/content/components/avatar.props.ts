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
    values: ['small', 'medium', 'large'],
    default: 'medium',
    responsive: true,
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
</Flex>`;

export const snippetFallback = `<Avatar
  src="https://avatars.githubusercontent.com/u/15406AAAAAAAAA"
  name="Charles de Dreuille"
/>`;
