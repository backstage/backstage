import { MDXRemote } from 'next-mdx-remote-client/rsc';
import { formattedMDXComponents } from '@/mdx-components';
import styles from './PageTitle.module.css';

export const PageTitle = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  return (
    <div className={styles.container}>
      <MDXRemote
        components={formattedMDXComponents}
        source={`# ${title}\n\n${description}`}
      />
    </div>
  );
};
