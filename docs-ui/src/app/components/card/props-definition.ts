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
