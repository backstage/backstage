import { changelog } from '@/utils/changelog';
import { MDXRemote } from 'next-mdx-remote-client/rsc';
import { formattedMDXComponents } from '@/mdx-components';
import type { ChangelogProps } from '@/utils/changelog';
import {
  Badge,
  BreakingBadge,
  generateChangelogMarkdown,
} from '../Changelog/utils';

// Token/theme changes aren't tied to a component, so they are selected by
// looking for token-related keywords in entries that don't belong to a
// specific component or hook.
const TOKEN_KEYWORDS =
  /--bui-|semantic color|color token|gray scale|neutral background token|surface token|CSS token|CSS variable|token famil/i;

const isTokenEntry = (entry: ChangelogProps): boolean => {
  const isGlobal =
    (!entry.components || entry.components.length === 0) &&
    (!entry.hooks || entry.hooks.length === 0);
  if (!isGlobal) return false;
  return (
    TOKEN_KEYWORDS.test(entry.description ?? '') ||
    TOKEN_KEYWORDS.test(entry.migration ?? '')
  );
};

export const ChangelogTokens = () => {
  const tokenChangelog = changelog.filter(isTokenEntry);

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
      source={content}
    />
  );
};
