import styles from './page.module.css';

export default async function Page() {
  const { default: Post } = await import(`@/content/home.mdx`);

  return (
    <div className={styles.content}>
      <Post />
    </div>
  );
}
