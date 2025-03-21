import { classNamePropDefs, stylePropDefs } from '../../../../utils/propDefs';
import type { PropDef } from '../../../../utils/propDefs';

export const fieldRootPropDefs: Record<string, PropDef> = {
  name: {
    type: 'string',
    responsive: false,
  },
  disabled: {
    type: 'boolean',
    responsive: false,
  },
  invalid: {
    type: 'boolean',
    responsive: false,
  },
  validate: {
    type: 'enum',
    values: ['(value) => string | string[] | null | Promise'],
    responsive: false,
  },
  validationMode: {
    type: 'enum',
    values: ['onBlur', 'onChange'],
    responsive: false,
  },
  validationDebounceTime: {
    type: 'number',
    responsive: false,
  },
  ...classNamePropDefs,
  ...stylePropDefs,
};

export const fieldLabelPropDefs: Record<string, PropDef> = {
  ...classNamePropDefs,
  ...stylePropDefs,
};

export const fieldDescriptionPropDefs: Record<string, PropDef> = {
  ...classNamePropDefs,
  ...stylePropDefs,
};

export const fieldErrorPropDefs: Record<string, PropDef> = {
  match: {
    type: 'enum',
    values: [
      'badInput',
      'customError',
      'patternMismatch',
      'rangeOverflow',
      'rangeUnderflow',
      'stepMismatch',
      'tooLong',
      'tooShort',
      'typeMismatch',
      'valid',
      'valueMissing',
    ],
    responsive: false,
  },
  forceShow: {
    type: 'boolean',
    responsive: false,
  },
  ...classNamePropDefs,
  ...stylePropDefs,
};
