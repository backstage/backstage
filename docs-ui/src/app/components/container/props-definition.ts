import {
  classNamePropDefs,
  stylePropDefs,
  gapPropDefs,
  type PropDef,
} from '@/utils/propDefs';

export const containerPropDefs: Record<string, PropDef> = {
  ...gapPropDefs,
  ...classNamePropDefs,
  ...stylePropDefs,
};
