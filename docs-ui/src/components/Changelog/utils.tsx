import type { ChangelogProps } from '@/utils/types';

// Badge Components
export const Badge = ({
  children,
  variant = 'gray',
}: {
  children: React.ReactNode;
  variant?: 'red' | 'gray';
}) => {
  const colors = {
    red: {
      backgroundColor: 'var(--badge-red-bg)',
      color: 'var(--badge-red-color)',
    },
    gray: {
      backgroundColor: 'var(--badge-gray-bg)',
      color: 'var(--badge-gray-color)',
    },
  };

  return (
    <span
      style={{
        display: 'inline-block',
        ...colors[variant],
        padding: '0.125rem 0.375rem',
        borderRadius: '0.25rem',
        fontSize: '0.75rem',
        fontWeight: 600,
        marginRight: '0.25rem',
        lineHeight: 1.3,
      }}
    >
      {children}
    </span>
  );
};

export const BreakingBadge = () => <Badge variant="red">Breaking</Badge>;

// Utility Functions
export const toTitleCase = (kebabCase: string): string => {
  return kebabCase
    .split('-')
    .map(word => word.charAt(0).toLocaleUpperCase('en-US') + word.slice(1))
    .join(' ');
};

export const groupByVersion = (
  entries: ChangelogProps[],
): Record<string, ChangelogProps[]> => {
  return entries.reduce((acc, entry) => {
    if (!acc[entry.version]) {
      acc[entry.version] = [];
    }
    acc[entry.version].push(entry);
    return acc;
  }, {} as Record<string, ChangelogProps[]>);
};

export const sortVersions = (versions: string[]): string[] => {
  return versions.sort((a, b) => {
    const aParts = a.split('.').map(Number);
    const bParts = b.split('.').map(Number);

    for (let i = 0; i < 3; i++) {
      if (bParts[i] !== aParts[i]) {
        return bParts[i] - aParts[i]; // Descending order
      }
    }
    return 0;
  });
};

export const formatPRLinks = (prs: string[]): string => {
  if (prs.length === 0) return '';

  return prs
    .map(pr => `[#${pr}](https://github.com/backstage/backstage/pull/${pr})`)
    .join(', ');
};

export const generateEntryMarkdown = (
  entry: ChangelogProps,
  options: { showComponentBadges?: boolean } = {},
): string => {
  const { showComponentBadges = true } = options;
  const prs = formatPRLinks(entry.prs);

  // Prepend component names as badges if available and requested
  const componentBadges =
    showComponentBadges && entry.components.length > 0
      ? entry.components
          .map(c => `<Badge variant="gray">${toTitleCase(c)}</Badge>`)
          .join(' ') + ' '
      : '';

  // Add breaking badge if this is a breaking change
  const breakingBadge = entry.breaking ? '<BreakingBadge /> ' : '';

  // Remove **BREAKING**: text from description since we show it as a badge
  const description = entry.description.replace(/\*\*BREAKING\*\*:?\s*/, '');

  // Build the entry
  let entryMarkdown = `- ${componentBadges}${breakingBadge}${description}`;
  if (prs) {
    entryMarkdown += ` ${prs}`;
  }

  // Add migration if present (should already be in description, but check)
  if (entry.migration && !entry.description.includes('**Migration:**')) {
    entryMarkdown += `\n\n  Migration Guide:\n\n  ${entry.migration
      .split('\n')
      .join('\n  ')}`;
  }

  return entryMarkdown;
};

export interface GenerateChangelogOptions {
  showComponentBadges?: boolean;
  headingLevel?: number;
}

export const generateChangelogMarkdown = (
  entries: ChangelogProps[],
  options: GenerateChangelogOptions = {},
): string => {
  const { showComponentBadges = true, headingLevel = 2 } = options;

  // Group changelog entries by version
  const groupedChangelog = groupByVersion(entries);

  // Sort versions in descending order (semantic versioning)
  const sortedVersions = sortVersions(Object.keys(groupedChangelog));

  // Generate heading prefix based on level (e.g., "##" for level 2, "###" for level 3)
  const versionHeading = '#'.repeat(headingLevel);
  const sectionHeading = '#'.repeat(headingLevel + 1);

  const content = sortedVersions
    .map(version => {
      const versionEntries = groupedChangelog[version];

      // Group entries: Breaking vs Everything Else
      const breakingChanges = versionEntries.filter(e => e.breaking);
      const otherChanges = versionEntries.filter(e => !e.breaking);

      const sections = [];

      // Breaking changes section
      if (breakingChanges.length > 0) {
        sections.push({
          title: 'Breaking Changes',
          entries: breakingChanges,
        });
      }

      // All other changes section
      if (otherChanges.length > 0) {
        sections.push({
          title: 'Changes',
          entries: otherChanges,
        });
      }

      const bumpSections = sections
        .map(({ title, entries: sectionEntries }) => {
          const entriesMarkdown = sectionEntries
            .map(e => generateEntryMarkdown(e, { showComponentBadges }))
            .join('\n\n');

          return `${sectionHeading} ${title}\n\n${entriesMarkdown}`;
        })
        .join('\n\n');

      return `${versionHeading} Version ${version}
      
      ${bumpSections}`;
    })
    .join('\n');

  return content;
};
