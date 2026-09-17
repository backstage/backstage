/*
 * Copyright 2026 The Backstage Authors
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

import { Button, Group, Input } from 'react-aria-components';
import { RiArrowDownSLine } from '@remixicon/react';
import { useDefinition } from '../../hooks/useDefinition';
import { ComboboxInputDefinition } from './definition';
import type { ComboboxInputOwnProps } from './types';

export function ComboboxInput(props: ComboboxInputOwnProps) {
  const { ownProps, dataAttributes } = useDefinition(
    ComboboxInputDefinition,
    props,
  );
  const { classes, icon, placeholder } = ownProps;

  return (
    <Group className={classes.root} {...dataAttributes}>
      {icon ? (
        <div className={classes.icon} aria-hidden="true">
          {icon}
        </div>
      ) : null}
      <Input className={classes.input} placeholder={placeholder} />
      <Button className={classes.chevron}>
        <RiArrowDownSLine aria-hidden="true" />
      </Button>
    </Group>
  );
}
