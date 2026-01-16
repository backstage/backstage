import { type PropDef } from '@/utils/propDefs';

export const useMediaQueryParamDefs: Record<string, PropDef> = {
  query: {
    type: 'string',
    description: 'The CSS media query to evaluate',
  },
  options: {
    type: 'complex',
    complexType: {
      name: 'UseMediaQueryOptions',
      properties: {
        defaultValue: {
          type: 'boolean',
          required: false,
          description:
            'Default value to use when rendering on the server, defaults to false',
        },
        initializeWithValue: {
          type: 'boolean',
          required: false,
          description:
            'Whether to initialize with the current value of the media query, or use the default value initially',
        },
      },
    },
    default: 'defaultValue: false\ninitializeWithValue: true',
  },
};

export const useMediaQueryReturnDefs: Record<string, PropDef> = {
  matches: {
    type: 'boolean',
    description: 'True if the media query currently matches',
  },
};
