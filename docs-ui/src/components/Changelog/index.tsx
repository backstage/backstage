import { changelog } from '@/utils/changelog';
import { MDXRemote } from 'next-mdx-remote-client/rsc';
import { formattedMDXComponents } from '@/mdx-components';

export function Changelog() {
  // Group changelog entries by version
  const groupedChangelog = changelog.reduce((acc, entry) => {
    if (!acc[entry.version]) {
      acc[entry.version] = [];
    }
    acc[entry.version].push(entry);
    return acc;
  }, {} as Record<string, typeof changelog>);

  // Sort versions in descending order
  const sortedVersions = Object.keys(groupedChangelog).sort((a, b) =>
    b.localeCompare(a),
  );

  const content = sortedVersions
    .map(version => {
      const entries = groupedChangelog[version];

      // Group entries by bump type
      const groupedByBump = entries.reduce((acc, entry) => {
        const bumpType = entry.type || 'other';
        if (!acc[bumpType]) {
          acc[bumpType] = [];
        }
        acc[bumpType].push(entry);
        return acc;
      }, {} as Record<string, typeof entries>);

      // Define the order of bump types
      const bumpOrder = ['breaking', 'new', 'fix', 'other'];

      const bumpSections = bumpOrder
        .filter(bumpType => groupedByBump[bumpType]?.length > 0)
        .map(bumpType => {
          const bumpEntries = groupedByBump[bumpType];
          let sectionTitle = 'Other Changes';
          if (bumpType === 'breaking') {
            sectionTitle = 'Breaking Changes';
          } else if (bumpType === 'new') {
            sectionTitle = 'New Features';
          } else if (bumpType === 'fix') {
            sectionTitle = 'Bug Fixes';
          }

          return `### ${sectionTitle}
          
          ${bumpEntries
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
              return `- ${e.description}${prs ? ` ${prs}` : ''}`;
            })
            .join('\n')}`;
        })
        .join('\n\n');

      return `## Version ${version}
      
      ${bumpSections}`;
    })
    .join('\n');

  return <MDXRemote components={formattedMDXComponents} source={content} />;
}
