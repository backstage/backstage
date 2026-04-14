import {
  classNamePropDefs,
  stylePropDefs,
  type PropDef,
} from '@/utils/propDefs';

const optionalChildrenPropDef: Record<string, PropDef> = {
  children: {
    type: 'enum',
    values: ['ReactNode'],
    responsive: false,
    description: 'Content to display inside the component.',
  },
};

export const cardPropDefs: Record<string, PropDef> = {
  ...optionalChildrenPropDef,
  onPress: {
    type: 'enum',
    values: ['() => void'],
    responsive: false,
    description:
      'Handler called when the card is pressed. Makes the card interactive as a button. Requires label.',
  },
  href: {
    type: 'string',
    responsive: false,
    description:
      'URL to navigate to. Makes the card interactive as a link. Mutually exclusive with onPress.',
  },
  label: {
    type: 'string',
    responsive: false,
    description:
      'Accessible label announced by screen readers for the interactive overlay. Required when onPress or href is provided.',
  },
  ...classNamePropDefs,
  ...stylePropDefs,
};

export const cardHeaderPropDefs: Record<string, PropDef> = {
  ...optionalChildrenPropDef,
  ...classNamePropDefs,
  ...stylePropDefs,
};

export const cardBodyPropDefs: Record<string, PropDef> = {
  ...optionalChildrenPropDef,
  ...classNamePropDefs,
  ...stylePropDefs,
};

export const cardFooterPropDefs: Record<string, PropDef> = {
  ...optionalChildrenPropDef,
  ...classNamePropDefs,
  ...stylePropDefs,
};
