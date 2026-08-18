import { changelog } from '@/utils/changelog';
import { MDXRemote } from 'next-mdx-remote-client/rsc';
import remarkGfm from 'remark-gfm';
import { formattedMDXComponents } from '@/mdx-components';
import {
  Badge,
  BreakingBadge,
  generateChangelogMarkdown,
} from '../Changelog/utils';

export const ChangelogTokens = () => {
  const tokenChangelog = changelog.filter(entry => entry.tokens);

  const content = `## Changelog

${generateChangelogMarkdown(tokenChangelog, {
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
      options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
      source={content}
    />
  );
};
