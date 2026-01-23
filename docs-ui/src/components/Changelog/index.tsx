import { changelog } from '@/utils/changelog';
import { MDXRemote } from 'next-mdx-remote-client/rsc';
import { formattedMDXComponents } from '@/mdx-components';

const Badge = ({
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

const BreakingBadge = () => <Badge variant="red">Breaking</Badge>;

export function Changelog() {
  // Convert kebab-case to Title Case
  const toTitleCase = (kebabCase: string) => {
    return kebabCase
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Group changelog entries by version
  const groupedChangelog = changelog.reduce((acc, entry) => {
    if (!acc[entry.version]) {
      acc[entry.version] = [];
    }
    acc[entry.version].push(entry);
    return acc;
  }, {} as Record<string, typeof changelog>);

  // Sort versions in descending order (semantic versioning)
  const sortedVersions = Object.keys(groupedChangelog).sort((a, b) => {
    const aParts = a.split('.').map(Number);
    const bParts = b.split('.').map(Number);

    for (let i = 0; i < 3; i++) {
      if (bParts[i] !== aParts[i]) {
        return bParts[i] - aParts[i]; // Descending order
      }
    }
    return 0;
  });

  const content = sortedVersions
    .map(version => {
      const entries = groupedChangelog[version];

      // Group entries: Breaking vs Everything Else
      const breakingChanges = entries.filter(e => e.breaking);
      const otherChanges = entries.filter(e => !e.breaking);

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
        .map(({ title, entries: bumpEntries }) => {
          const sectionTitle = title;

          const entriesMarkdown = bumpEntries
            .map(e => {
              const prs =
                e.prs.length > 0
                  ? e.prs
                      .map(
                        pr =>
                          `[#${pr}](https://github.com/backstage/backstage/pull/${pr})`,
                      )
                      .join(', ')
                  : '';

              // Prepend component names as badges if available
              const componentBadges =
                e.components.length > 0
                  ? e.components
                      .map(
                        c => `<Badge variant="gray">${toTitleCase(c)}</Badge>`,
                      )
                      .join(' ') + ' '
                  : '';

              // Add breaking badge if this is a breaking change
              const breakingBadge = e.breaking ? '<BreakingBadge /> ' : '';

              // Remove **BREAKING**: text from description since we show it as a badge
              let description = e.description.replace(
                /\*\*BREAKING\*\*:?\s*/,
                '',
              );

              // Description already has proper indentation from CHANGELOG
              let entry = `- ${componentBadges}${breakingBadge}${description}`;
              if (prs) {
                entry += ` ${prs}`;
              }

              // Add migration if present (should already be in description, but check)
              if (e.migration && !e.description.includes('**Migration:**')) {
                entry += `\n\n  Migration Guide:\n\n  ${e.migration
                  .split('\n')
                  .join('\n  ')}`;
              }

              return entry;
            })
            .join('\n\n');

          return `### ${sectionTitle}\n\n${entriesMarkdown}`;
        })
        .join('\n\n');

      return `## Version ${version}
      
      ${bumpSections}`;
    })
    .join('\n');

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
