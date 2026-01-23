'use client';

import { formattedMDXComponents } from '@/mdx-components';
import type { DataAttributeValues } from '../../../../packages/ui/src/types';

interface ThemingProps {
  definition: {
    classNames: Record<string, string>;
    dataAttributes?: Record<string, string[]>;
  };
}

export function Theming({ definition }: ThemingProps) {
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

  // Use the same styled components from MDX
  const H2 = formattedMDXComponents.h2!;
  const P = formattedMDXComponents.p!;
  const Ul = formattedMDXComponents.ul!;
  const Li = formattedMDXComponents.li!;
  const Code = formattedMDXComponents.code!;

  return (
    <div>
      <H2>Theming</H2>
      <P>
        Our theming system is based on a mix between CSS classes, CSS variables
        and data attributes. If you want to customise this component, you can
        use one of these class names below.
      </P>
      <Ul>
        {classNamesArray.map((selector, index) => (
          <Li key={index}>
            <Code>{selector}</Code>
          </Li>
        ))}
      </Ul>
    </div>
  );
}
