import styles from './styles.module.css';
import { Text } from '../../../../packages/canon/src/components/Text';
import { Icon } from '../../../../packages/canon/src/components/Icon';

interface BaseUIProps {
  href: string;
}

export const BaseUI = ({ href }: BaseUIProps) => {
  return (
    <div className={styles.container}>
      <svg
        width="17"
        height="30"
        viewBox="0 0 17 30"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={styles.icon}
      >
        <path d="M8 12.8V15V26C3.58172 26 0 22.0601 0 17.2V15V4C4.41828 4 8 7.93989 8 12.8Z" />
        <path d="M9.5001 10.0154C9.2245 9.99843 9 10.2239 9 10.5V26.0001C13.4183 26.0001 17 22.4184 17 18.0001C17 13.7498 13.6854 10.2736 9.5001 10.0154Z" />
      </svg>
      <div className={styles.content}>
        <Text variant="subtitle" weight="bold">
          Base UI
        </Text>
        <div className={styles.description}>
          <Text variant="subtitle">
            This component is using Base UI under the hood. While most of the
            original props are available, we have made some changes to the API
            to fit our needs.
          </Text>
        </div>
        {href && (
          <a className={styles.button} href={href} target="_blank">
            Discover more
            <Icon name="externalLink" />
          </a>
        )}
      </div>
    </div>
  );
};
