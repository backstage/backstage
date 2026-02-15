import {
  classNamePropDefs,
  stylePropDefs,
  type PropDef,
} from '@/utils/propDefs';
import { Chip } from '@/components/Chip';

export const avatarPropDefs: Record<string, PropDef> = {
  src: {
    type: 'string',
    description:
      'URL of the image to display. Pass an empty string to show initials fallback. Falls back to initials if the image fails to load.',
  },
  name: {
    type: 'string',
    required: true,
    description:
      'Name of the person. Used for generating initials fallback and accessibility label.',
  },
  size: {
    type: 'enum',
    values: ['x-small', 'small', 'medium', 'large', 'x-large'],
    default: 'medium',
    responsive: true,
    description:
      'Visual size. Smaller sizes show 1 initial, larger sizes show 2.',
  },
  purpose: {
    type: 'enum',
    values: ['informative', 'decoration'],
    default: 'informative',
    description: (
      <>
        Accessibility behavior. Use <Chip>decoration</Chip> when name appears in
        adjacent text.
      </>
    ),
  },
  ...classNamePropDefs,
  ...stylePropDefs,
};
