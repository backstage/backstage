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

import { forwardRef, Ref } from 'react';
import { Button as RAButton, ProgressBar } from 'react-aria-components';
import { RiLoader4Line } from '@remixicon/react';
import type { ButtonIconProps } from './types';
import { useDefinition } from '../../hooks/useDefinition';
import { ButtonIconDefinition } from './definition';

/** @public */
export const ButtonIcon = forwardRef(
  (props: ButtonIconProps, ref: Ref<HTMLButtonElement>) => {
    const { ownProps, restProps, dataAttributes } = useDefinition(
      ButtonIconDefinition,
      props,
    );
    const { classes, icon, loading } = ownProps;

    return (
      <RAButton
        className={classes.root}
        ref={ref}
        isPending={loading}
        {...dataAttributes}
        {...restProps}
      >
        {({ isPending }) => (
          <>
            <span className={classes.content}>{icon}</span>

            {isPending && (
              <ProgressBar
                aria-label="Loading"
                isIndeterminate
                className={classes.spinner}
              >
                <RiLoader4Line aria-hidden="true" />
              </ProgressBar>
            )}
          </>
        )}
      </RAButton>
    );
  },
);

ButtonIcon.displayName = 'ButtonIcon';
