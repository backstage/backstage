import {
  classNamePropDefs,
  stylePropDefs,
  childrenPropDefs,
  type PropDef,
} from '@/utils/propDefs';

export const cardPropDefs: Record<string, PropDef> = {
  ...childrenPropDefs,
  ...classNamePropDefs,
  ...stylePropDefs,
};

export const cardHeaderPropDefs: Record<string, PropDef> = {
  ...childrenPropDefs,
  ...classNamePropDefs,
  ...stylePropDefs,
};

export const cardBodyPropDefs: Record<string, PropDef> = {
  ...childrenPropDefs,
  ...classNamePropDefs,
  ...stylePropDefs,
};

export const cardFooterPropDefs: Record<string, PropDef> = {
  ...childrenPropDefs,
  ...classNamePropDefs,
  ...stylePropDefs,
};
