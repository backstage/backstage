import Link from 'next/link';
import styles from './ComponentCards.module.css';

export const ComponentCards = ({ children }: { children: React.ReactNode }) => {
  return <div className={styles.grid}>{children}</div>;
};

export const ComponentCard = ({
  title,
  description,
  href,
}: {
  title: string;
  description: string;
  href: string;
}) => {
  return (
    <Link href={href} className={styles.card}>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>
    </Link>
  );
};
