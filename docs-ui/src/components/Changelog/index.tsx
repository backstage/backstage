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

      return `## Version ${version}
      
      ${entries
        .map(e => {
          const prs =
            e.prs.length > 0 &&
            e.prs
              .map(
                pr =>
                  `[#${pr}](https://github.com/backstage/backstage/pull/${pr})`,
              )
              .join(', ');
          return `- ${e.description} ${prs}`;
        })
        .join('\n')}`;
    })
    .join('\n');

  return <MDXRemote components={formattedMDXComponents} source={content} />;
}
