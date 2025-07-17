import { Tabs } from '@/components/Tabs';
import { CodeBlock } from '@/components/CodeBlock';
import type { ComponentInfosProps } from './types';
import styles from '@/css/mdx.module.css';
import Link from 'next/link';
import { changelog } from '@/utils/changelog';
import { MDXRemote } from 'next-mdx-remote-client/rsc';
import { formattedMDXComponents } from '@/mdx-components';

export const ComponentInfos = ({
  usageCode,
  component,
  classNames,
}: ComponentInfosProps) => {
  const componentChangelog = changelog.filter(c =>
    c.components.includes(component),
  );

  return (
    <Tabs.Root>
      <Tabs.List>
        <Tabs.Tab>Usage</Tabs.Tab>
        {classNames && classNames.length > 0 && <Tabs.Tab>Theming</Tabs.Tab>}
        <Tabs.Tab>Changelog</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel>
        <CodeBlock code={usageCode} />
      </Tabs.Panel>
      {classNames && classNames.length > 0 && (
        <Tabs.Panel>
          <p className={styles.p}>
            We recommend starting with our{' '}
            <Link className={styles.a} href="/theme/theming">
              global tokens
            </Link>{' '}
            to customize the library and align it with your brand. For
            additional flexibility, you can use the provided class names for
            each element listed below.
          </p>
          <MDXRemote
            components={formattedMDXComponents}
            source={`${classNames
              ?.map(className => `- \`${className}\``)
              .join('\n')}`}
          />
        </Tabs.Panel>
      )}
      <Tabs.Panel>
        <MDXRemote
          components={formattedMDXComponents}
          source={`${componentChangelog
            ?.map(change => {
              const prs =
                change.prs.length > 0 &&
                change.prs
                  .map(
                    pr =>
                      `[#${pr}](https://github.com/backstage/backstage/pull/${pr})`,
                  )
                  .join(', ');
              return `- \`${change.version}\` - ${change.description} ${prs}`;
            })
            .join('\n')}`}
        />
      </Tabs.Panel>
    </Tabs.Root>
  );
};
