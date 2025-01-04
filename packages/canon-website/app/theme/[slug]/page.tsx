import { theme } from '@/utils/data';
import { notFound } from 'next/navigation';
import fs from 'fs';
import path from 'path';
import styles from '../../page.module.css';

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;
  const filePath = path.resolve(process.cwd(), `content/${slug}.mdx`);

  if (fs.existsSync(filePath)) {
    const { default: Post } = await import(`@/content/${slug}.mdx`);
    return (
      <div className={styles.pageContainer}>
        <Post />
      </div>
    );
  } else {
    return notFound();
  }
}

export function generateStaticParams() {
  return theme.map(component => ({
    slug: component.slug,
  }));
}

export const dynamicParams = false;
