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
  component: Component;
  hook: Hook;
}>;

export const ChangelogComponent = ({
  component,
  hook,
}: Readonly<ChangelogComponentProps>) => {
  const componentChangelog = changelog.filter(
    c => c.components?.includes(component) || c.hooks?.includes(hook),
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
