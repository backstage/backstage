import { changelog } from '@/utils/changelog';
import { MDXRemote } from 'next-mdx-remote-client/rsc';
import { formattedMDXComponents } from '@/mdx-components';
import type { Component } from '@/utils/changelog';
import {
  Badge,
  BreakingBadge,
  generateChangelogMarkdown,
} from '../Changelog/utils';

export const ChangelogComponent = ({ component }: { component: Component }) => {
  const componentChangelog = changelog.filter(c =>
    c.components.includes(component),
  );

  const content = `## Changelog

${generateChangelogMarkdown(componentChangelog, {
  showComponentBadges: false,
  headingLevel: 3,
})}`;

  return (
    <MDXRemote
      components={{
        ...formattedMDXComponents,
        Badge,
        BreakingBadge,
      }}
      source={content}
    />
  );
};
