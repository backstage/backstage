'use client';

import { Tabs as TabsPrimitive } from '@base-ui-components/react/tabs';
import styles from './styles.module.css';

export const Root = ({
  className,
  ...rest
}: React.ComponentProps<typeof TabsPrimitive.Root>) => (
  <TabsPrimitive.Root className={`${styles.root} ${className}`} {...rest} />
);

export const List = ({
  className,
  children,
  ...rest
}: React.ComponentProps<typeof TabsPrimitive.List>) => (
  <TabsPrimitive.List className={`${styles.list} ${className}`} {...rest}>
    {children}
    <TabsPrimitive.Indicator className={styles.indicator} />
  </TabsPrimitive.List>
);

export const Tab = (props: React.ComponentProps<typeof TabsPrimitive.Tab>) => (
  <TabsPrimitive.Tab
    {...props}
    render={({ children, ...rest }, state) => {
      return (
        <button className={styles.tab} data-selected={state.selected} {...rest}>
          {children}
        </button>
      );
    }}
  />
);

export const Panel = ({
  className,
  ...rest
}: React.ComponentProps<typeof TabsPrimitive.Panel>) => (
  <TabsPrimitive.Panel className={`${styles.panel} ${className}`} {...rest} />
);
