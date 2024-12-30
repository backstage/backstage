/*
 * Copyright 2024 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React from 'react';
import { BoxSvg } from './svgs/box';
import { StackSvg } from './svgs/stack';
import { GridSvg } from './svgs/grid';
import { InlineSvg } from './svgs/inline';
import { ContainerSvg } from './svgs/container';
import styles from './LayoutComponents.module.css';

export const LayoutComponents = () => {
  return (
    <div className={styles.layoutComponents}>
      <div className={styles.box}>
        <a className={styles.content} href="/?path=/docs/components-box--docs">
          <BoxSvg />
        </a>
        <div className={styles.title}>Box</div>
        <div className={styles.description}>
          The most basic layout component
        </div>
      </div>
      <div className={styles.box}>
        <a
          className={styles.content}
          href="/?path=/docs/components-stack--docs"
        >
          <StackSvg />
        </a>
        <div className={styles.title}>Stack</div>
        <div className={styles.description}>
          Arrange your components vertically
        </div>
      </div>
      <div className={styles.box}>
        <a className={styles.content} href="/?path=/docs/components-grid--docs">
          <GridSvg />
        </a>
        <div className={styles.title}>Grid</div>
        <div className={styles.description}>
          Arrange your components in a grid
        </div>
      </div>
      <div className={styles.box}>
        <a
          className={styles.content}
          href="/?path=/docs/components-inline--docs"
        >
          <InlineSvg />
        </a>
        <div className={styles.title}>Inline</div>
        <div className={styles.description}>
          Arrange your components in a row
        </div>
      </div>
      <div className={styles.box}>
        <a
          className={styles.content}
          href="/?path=/docs/components-container--docs"
        >
          <ContainerSvg />
        </a>
        <div className={styles.title}>Container</div>
        <div className={styles.description}>
          A container for your components
        </div>
      </div>
    </div>
  );
};
