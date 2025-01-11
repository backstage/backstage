import { ThemeSelector } from './theme';
import { ThemeNameSelector } from './theme-name';
import styles from './styles.module.css';
import { Nav } from './nav';

export const Toolbar = () => {
  return (
    <div className={styles.toolbar}>
      <div>
        <Nav />
      </div>
      <div className={styles.actions}>
        <ThemeNameSelector />
        <ThemeSelector />
      </div>
    </div>
  );
};
