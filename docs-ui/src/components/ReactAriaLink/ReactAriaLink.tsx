import styles from './styles.module.css';

interface ReactAriaLinkProps {
  /** The React Aria component name (e.g., "Cell", "Table") */
  component: string;
  /** The documentation URL */
  href: string;
}

/**
 * Displays a standardized note linking to React Aria documentation.
 *
 * Usage:
 * <ReactAriaLink component="Cell" href="https://react-spectrum.adobe.com/react-aria/Table.html" />
 */
export function ReactAriaLink({ component, href }: ReactAriaLinkProps) {
  return (
    <p className={styles.note}>
      Inherits all{' '}
      <a href={href} target="_blank" rel="noopener noreferrer">
        React Aria {component}
      </a>{' '}
      props.
    </p>
  );
}
