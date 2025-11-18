import { MDXRemote } from 'next-mdx-remote-client/rsc';
import { formattedMDXComponents } from '@/mdx-components';
import type {
  ComponentDefinition,
  DataAttributeValues,
} from '../../../../packages/ui/src/types';

export function Theming({ definition }: { definition: ComponentDefinition }) {
  const classNames = definition.classNames;
  const dataAttributes = definition.dataAttributes;

  // Get the first class name
  const firstClassName = Object.values(classNames)[0];

  // Create array of selectors combining first class name with data attributes
  const selectorArray: string[] = [];

  if (dataAttributes) {
    Object.entries(dataAttributes).forEach(
      ([attributeName, attributeValues]) => {
        (attributeValues as DataAttributeValues).forEach(value => {
          selectorArray.push(
            `${firstClassName}[data-${attributeName}="${value}"]`,
          );
        });
      },
    );
  }

  const classNamesArray = [
    `${firstClassName}`,
    ...selectorArray,
    ...Object.values(classNames).slice(1),
  ];

  return (
    <MDXRemote
      components={formattedMDXComponents}
      source={`## Theming

        Our theming system is based on a mix between CSS classes, CSS variables and data attributes. If you want to customise this component, you can use one of these class names below.

        ${classNamesArray.map(selector => `- \`${selector}\``).join('\n')}
      `}
    />
  );
}
