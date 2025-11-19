import { changelog } from '@/utils/changelog';
import { MDXRemote } from 'next-mdx-remote-client/rsc';
import { formattedMDXComponents } from '@/mdx-components';
import type { Component } from '@/utils/changelog';

export const ChangelogComponent = ({ component }: { component: Component }) => {
  const componentChangelog = changelog.filter(c =>
    c.components.includes(component),
  );

  return (
    <MDXRemote
      components={formattedMDXComponents}
      source={`
        ## Changelog

        ${componentChangelog
          ?.map(change => {
            const prs =
              change.prs.length > 0
                ? change.prs
                    .map(
                      pr =>
                        `[#${pr}](https://github.com/backstage/backstage/pull/${pr})`,
                    )
                    .join(', ')
                : '';
            return `- \`${change.version}\` - ${change.description}${
              prs ? ` ${prs}` : ''
            }`;
          })
          .join('\n')}`}
    />
  );
};
