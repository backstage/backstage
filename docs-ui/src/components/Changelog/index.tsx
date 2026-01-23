import { changelog } from '@/utils/changelog';
import { MDXRemote } from 'next-mdx-remote-client/rsc';
import { formattedMDXComponents } from '@/mdx-components';
import { Badge, BreakingBadge, generateChangelogMarkdown } from './utils';

export function Changelog() {
  const content = generateChangelogMarkdown(changelog, {
    showComponentBadges: true,
  });

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
}
