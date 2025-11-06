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

import { forwardRef } from 'react';
import { FlexProps } from './types';
import clsx from 'clsx';
import { useStyles } from '../../hooks/useStyles';
import styles from './Flex.module.css';
import { SurfaceLevel, SurfaceProvider } from '../../hooks/useSurface';

/** @public */
export const Flex = forwardRef<HTMLDivElement, FlexProps>((props, ref) => {
  const { classNames, utilityClasses, style, cleanedProps } = useStyles(
    'Flex',
    { gap: '4', ...props },
  );

  const { className, bg = 'surface-0', ...rest } = cleanedProps;

  const content = (
    <div
      ref={ref}
      className={clsx(
        classNames.root,
        utilityClasses,
        styles[classNames.root],
        className,
      )}
      style={style}
      data-bg={bg}
      {...rest}
    />
  );

  return bg ? (
    <SurfaceProvider surface={bg as unknown as SurfaceLevel}>
      {content}
    </SurfaceProvider>
  ) : (
    content
  );
});
