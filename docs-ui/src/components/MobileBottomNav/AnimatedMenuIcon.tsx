import styles from './AnimatedMenuIcon.module.css';

interface AnimatedMenuIconProps {
  isOpen: boolean;
  size?: number;
}

export const AnimatedMenuIcon = ({
  isOpen,
  size = 20,
}: AnimatedMenuIconProps) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={styles.icon}
      data-open={isOpen}
    >
      <g className={styles.lines}>
        <line
          x1="3"
          y1="5"
          x2="17"
          y2="5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          className={styles.topLine}
        />
        <line
          x1="3"
          y1="10"
          x2="17"
          y2="10"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          className={styles.middleLine}
        />
        <line
          x1="3"
          y1="15"
          x2="17"
          y2="15"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          className={styles.bottomLine}
        />
      </g>
    </svg>
  );
};
