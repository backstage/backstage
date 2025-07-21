import { MDXRemote } from 'next-mdx-remote-client/rsc';
import { formattedMDXComponents } from '@/mdx-components';
import { Component } from '@/utils/changelog';
import { componentDefinitions } from '../../../../packages/ui/src/utils/componentDefinitions';

export function Theming({ component }: { component: Component }) {
  const componentDefinition = componentDefinitions[component];

  if (!componentDefinition) {
    return null;
  }

  const classNames = componentDefinition.classNames;

  // Convert classNames object values to array
  const classNameArray = Object.values(classNames);

  return (
    <MDXRemote
      components={formattedMDXComponents}
      source={`## Theming
      ${classNameArray.map(className => `- \`${className}\``).join('\n')}
      `}
    />
  );
}
