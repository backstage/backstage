/*
 * Copyright 2025 The Backstage Authors
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

import { forwardRef } from 'react';
import type { FullPageProps } from './types';
import { useStyles } from '../../hooks/useStyles';
import { FullPageDefinition } from './definition';
import styles from './FullPage.module.css';
import clsx from 'clsx';

/**
 * A component that fills the remaining viewport height below the Header.
 *
 * The FullPage component consumes the `--bui-header-height` CSS custom property
 * set by the Header component to calculate its height as
 * `calc(100dvh - var(--bui-header-height, 0px))`. Content inside the FullPage
 * scrolls independently while the Header stays visible.
 *
 * @public
 */
export const FullPage = forwardRef<HTMLElement, FullPageProps>((props, ref) => {
  const { classNames, cleanedProps } = useStyles(FullPageDefinition, props);
  const { className, ...rest } = cleanedProps;

  return (
    <main
      ref={ref}
      className={clsx(classNames.root, styles[classNames.root], className)}
      {...rest}
    />
  );
});
