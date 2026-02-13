'use client';

import styles from './ColorFamily.module.css';

const StateChip = ({
  level,
  state,
  label,
}: {
  level: number;
  state: string;
  label: string;
}) => (
  <div
    className={styles.chip}
    style={{
      backgroundColor: `var(--bui-bg-neutral-${level}${state})`,
    }}
  >
    {label}
  </div>
);

const NeutralLevel = ({
  level,
  children,
  height,
}: {
  level: number;
  children?: React.ReactNode;
  height?: number;
}) => (
  <div
    className={styles.level}
    style={{
      backgroundColor: `var(--bui-bg-neutral-${level})`,
      ...(height ? { minHeight: height } : {}),
    }}
  >
    <div className={styles.levelHeader}>
      <span className={styles.levelLabel}>Neutral {level}</span>
      <div className={styles.chips}>
        <StateChip level={level} state="-hover" label="Hover" />
        <StateChip level={level} state="-pressed" label="Pressed" />
        <StateChip level={level} state="-disabled" label="Disabled" />
      </div>
    </div>
    {children}
  </div>
);

export const ColorFamily = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.visual}>
        <div
          className={styles.base}
          style={{ backgroundColor: 'var(--bui-bg-app)' }}
        >
          <span className={styles.baseLabel}>Neutral 0</span>
          <NeutralLevel level={1}>
            <NeutralLevel level={2}>
              <NeutralLevel level={3}>
                <NeutralLevel level={4} height={120} />
              </NeutralLevel>
            </NeutralLevel>
          </NeutralLevel>
        </div>
      </div>
      <div className={styles.text}>
        <p className={styles.description}>
          BUI uses a layered neutral scale from 0 to 4. Each level nests inside
          the previous one, automatically incrementing the background depth.
          This creates clear visual hierarchy without manually picking colors.
        </p>
        <p className={styles.description}>
          Neutral 0 is the application background and should only be used once,
          at the root of your app. All other surfaces build on top of it.
        </p>
        <p className={styles.description}>
          Each level can be <strong>interactive</strong> or{' '}
          <strong>non-interactive</strong>. A Card, for example, can be flat
          (just a surface) or fully clickable with hover and pressed states. The
          three interaction states (hover, pressed, disabled) are built into
          every neutral level.
        </p>
        <p className={styles.description}>
          Explore the full list of color tokens on the{' '}
          <a href="/tokens" className={styles.link}>
            tokens page
          </a>
          .
        </p>
      </div>
    </div>
  );
};
