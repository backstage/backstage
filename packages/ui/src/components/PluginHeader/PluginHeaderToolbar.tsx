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
import { useDefinition } from '../../hooks/useDefinition';
import { PluginHeaderToolbarDefinition } from './definition';
import { useRef } from 'react';
import { RiShapesLine } from '@remixicon/react';
import type { PluginHeaderToolbarProps } from './types';
import { Text } from '../Text';

/**
 * A component that renders the toolbar section of a plugin header.
 *
 * @internal
 */
export const PluginHeaderToolbar = (props: PluginHeaderToolbarProps) => {
  const { ownProps } = useDefinition(PluginHeaderToolbarDefinition, props);
  const { classes, icon, title, titleLink, customActions, hasTabs } = ownProps;

  // Refs for collision detection
  const toolbarWrapperRef = useRef<HTMLDivElement>(null);
  const toolbarContentRef = useRef<HTMLDivElement>(null);
  const toolbarControlsRef = useRef<HTMLDivElement>(null);

  const titleContent = (
    <>
      <div className={classes.icon}>{icon || <RiShapesLine />}</div>
      <Text variant="body-medium">{title || 'Your plugin'}</Text>
    </>
  );

  return (
    <div className={classes.root} data-has-tabs={hasTabs}>
      <div className={classes.wrapper} ref={toolbarWrapperRef}>
        <div className={classes.content} ref={toolbarContentRef}>
          <Text as="h1" variant="body-medium">
            {titleLink ? (
              <Link className={classes.name} href={titleLink}>
                {titleContent}
              </Link>
            ) : (
              <div className={classes.name}>{titleContent}</div>
            )}
          </Text>
        </div>
        <div className={classes.controls} ref={toolbarControlsRef}>
          {customActions}
        </div>
      </div>
    </div>
  );
};
