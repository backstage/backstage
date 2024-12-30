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
import styles from './styles.module.css';

export const ComponentStatus = () => {
  return (
    <div className={styles.container}>
      <Component
        name="Box"
        status="alpha"
        link="/?path=/docs/components-box--docs"
      />
      <Component
        name="Button"
        status="inProgress"
        link="/?path=/docs/components-button--docs"
      />
      <Component name="Checkbox" status="inProgress" />
      <Component
        name="Container"
        status="alpha"
        link="/?path=/docs/components-container--docs"
      />
      <Component
        name="Grid"
        status="alpha"
        link="/?path=/story/components-grid--docs"
      />
      <Component name="Header" status="notStarted" />
      <Component
        name="Icon"
        status="alpha"
        link="/?path=/docs/components-icon--docs"
      />
      <Component
        name="Inline"
        status="alpha"
        link="/?path=/story/components-inline--default"
      />
      <Component name="Input" status="inProgress" />
      <Component name="Radio" status="notStarted" />
      <Component name="Select" status="notStarted" />
      <Component
        name="Stack"
        status="alpha"
        link="/?path=/docs/components-stack--default"
      />
      <Component name="Switch" status="notStarted" />
      <Component name="Tabs" status="notStarted" />
      <Component name="Tooltip" status="notStarted" />
    </div>
  );
};

export const Component = ({
  name,
  status = 'notStarted',
  style,
  link,
}: {
  name: string;
  status: 'notStarted' | 'inProgress' | 'alpha' | 'beta' | 'stable';
  style?: React.CSSProperties;
  link?: string;
}) => {
  return (
    <div className={styles.componentStatus} style={style}>
      {link ? (
        <a href={link} className={styles.title}>
          {name}
        </a>
      ) : (
        <span className={styles.title}>{name}</span>
      )}
      <span className={`${styles.pill} ${styles[status]}`}>
        {status === 'notStarted' && 'Not Started'}
        {status === 'inProgress' && 'In Progress'}
        {status === 'alpha' && 'Alpha'}
        {status === 'beta' && 'Beta'}
        {status === 'stable' && 'Stable'}
      </span>
    </div>
  );
};
