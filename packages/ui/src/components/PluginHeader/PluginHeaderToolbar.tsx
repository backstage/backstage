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

import { Link } from 'react-aria-components';
import { useStyles } from '../../hooks/useStyles';
import { PluginHeaderDefinition } from './definition';
import { useRef } from 'react';
import { RiShapesLine } from '@remixicon/react';
import type { PluginHeaderToolbarProps } from './types';
import { Text } from '../Text';
import styles from './PluginHeader.module.css';
import clsx from 'clsx';

/**
 * A component that renders the toolbar section of a plugin header.
 *
 * @internal
 */
export const PluginHeaderToolbar = (props: PluginHeaderToolbarProps) => {
  const { classNames, cleanedProps } = useStyles(PluginHeaderDefinition, props);
  const { className, icon, title, titleLink, customActions, hasTabs } =
    cleanedProps;

  // Refs for collision detection
  const toolbarWrapperRef = useRef<HTMLDivElement>(null);
  const toolbarContentRef = useRef<HTMLDivElement>(null);
  const toolbarControlsRef = useRef<HTMLDivElement>(null);

  const titleContent = (
    <>
      <div
        className={clsx(classNames.toolbarIcon, styles[classNames.toolbarIcon])}
      >
        {icon || <RiShapesLine />}
      </div>
      <Text variant="body-medium">{title || 'Your plugin'}</Text>
    </>
  );

  return (
    <div
      className={clsx(
        classNames.toolbar,
        styles[classNames.toolbar],
        className,
      )}
      data-has-tabs={hasTabs}
    >
      <div
        className={clsx(
          classNames.toolbarWrapper,
          styles[classNames.toolbarWrapper],
        )}
        ref={toolbarWrapperRef}
      >
        <div
          className={clsx(
            classNames.toolbarContent,
            styles[classNames.toolbarContent],
          )}
          ref={toolbarContentRef}
        >
          <Text as="h1" variant="body-medium">
            {titleLink ? (
              <Link
                className={clsx(
                  classNames.toolbarName,
                  styles[classNames.toolbarName],
                )}
                href={titleLink}
              >
                {titleContent}
              </Link>
            ) : (
              <div
                className={clsx(
                  classNames.toolbarName,
                  styles[classNames.toolbarName],
                )}
              >
                {titleContent}
              </div>
            )}
          </Text>
        </div>
        <div
          className={clsx(
            classNames.toolbarControls,
            styles[classNames.toolbarControls],
          )}
          ref={toolbarControlsRef}
        >
          {customActions}
        </div>
      </div>
    </div>
  );
};
