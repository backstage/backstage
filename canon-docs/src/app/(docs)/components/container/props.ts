import {
  classNamePropDefs,
  stylePropDefs,
  gapPropDefs,
} from '../../../../utils/propDefs';
import type { PropDef } from '../../../../utils/propDefs';

export const containerPropDefs: Record<string, PropDef> = {
  ...gapPropDefs,
  ...classNamePropDefs,
  ...stylePropDefs,
};
