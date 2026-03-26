import { changelog } from '@/utils/changelog';
import { MDXRemote } from 'next-mdx-remote-client/rsc';
import { formattedMDXComponents } from '@/mdx-components';
import type { AtLeastOne, Component, Hook } from '@/utils/changelog';
import {
  Badge,
  BreakingBadge,
  generateChangelogMarkdown,
} from '../Changelog/utils';

type ChangelogComponentProps = AtLeastOne<{
  component: Component | Component[];
  hook: Hook;
}>;

export const ChangelogComponent = ({
  component,
  hook,
}: Readonly<ChangelogComponentProps>) => {
  const components = Array.isArray(component) ? component : [component];
  const componentChangelog = changelog.filter(
    c =>
      c.components?.some(cc => components.includes(cc)) ||
      c.hooks?.includes(hook),
  );

  const content = `## Changelog

${generateChangelogMarkdown(componentChangelog, {
  showComponentBadges: components.length > 1,
  componentBadgeFilter: components.length > 1 ? components : undefined,
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
