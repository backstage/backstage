import React from 'react';
import { BoxSvg } from './svgs/box';
import { StackSvg } from './svgs/stack';
import { GridSvg } from './svgs/grid';
import { InlineSvg } from './svgs/inline';
import { ContainerSvg } from './svgs/container';
import styles from './LayoutComponents.module.css';
import Link from 'next/link';

export const LayoutComponents = () => {
  return (
    <div className={styles.layoutComponents}>
      <div className={styles.box}>
        <Link className={styles.content} href="/components/box">
          <BoxSvg />
        </Link>
        <div className={styles.title}>Box</div>
        <div className={styles.description}>
          The most basic layout component
        </div>
      </div>
      <div className={styles.box}>
        <Link className={styles.content} href="/components/stack">
          <StackSvg />
        </Link>
        <div className={styles.title}>Stack</div>
        <div className={styles.description}>
          Arrange your components vertically
        </div>
      </div>
      <div className={styles.box}>
        <Link className={styles.content} href="/components/grid">
          <GridSvg />
        </Link>
        <div className={styles.title}>Grid</div>
        <div className={styles.description}>
          Arrange your components in a grid
        </div>
      </div>
      <div className={styles.box}>
        <Link className={styles.content} href="/components/inline">
          <InlineSvg />
        </Link>
        <div className={styles.title}>Inline</div>
        <div className={styles.description}>
          Arrange your components in a row
        </div>
      </div>
      <div className={styles.box}>
        <Link className={styles.content} href="/components/container">
          <ContainerSvg />
        </Link>
        <div className={styles.title}>Container</div>
        <div className={styles.description}>
          A container for your components
        </div>
      </div>
    </div>
  );
};
