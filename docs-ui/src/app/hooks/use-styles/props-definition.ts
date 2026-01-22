import { type PropDef } from '@/utils/propDefs';

export const useStylesPropsDefs: Record<string, PropDef> = {
  componentDefinition: {
    type: 'complex',
    complexType: {
      name: 'ComponentDefinition',
      properties: {
        classNames: {
          type: 'Record<string, string>',
          required: true,
        },
        dataAttributes: {
          type: 'Record<string, readonly (string | number | boolean)[]>',
          required: false,
        },
        utilityProps: {
          type: 'string[]',
          required: false,
        },
      },
    },
  },
  props: {
    type: 'enum',
    description: 'All component props',
    values: ['{ [key: string]: any; }'],
  },
};

export const useStylesReturnDefs: Record<string, PropDef> = {
  classNames: {
    type: 'enum',
    values: ['Record<string, string>'],
    description:
      "The component's class names mapped to their style definitions",
  },
  dataAttributes: {
    type: 'enum',
    values: ['Record<string, string>'],
    description:
      'Data attributes generated from the component definition and props',
  },
  utilityClasses: {
    type: 'string',
    description: 'Combined utility classes based on utility props',
  },
  style: {
    type: 'enum',
    values: ['React.CSSProperties'],
    description: 'The combined style object for the component',
  },
  cleanedProps: {
    type: 'enum',
    values: ['Record<string, any>'],
    description: 'The original props with utility props removed',
  },
};
