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

import { ReactNode } from 'react';
import { Button, SelectValue } from 'react-aria-components';
import { RiArrowDownSLine } from '@remixicon/react';
import { useDefinition } from '../../hooks/useDefinition';
import { SelectTriggerDefinition } from './definition';

interface SelectTriggerProps {
  icon?: ReactNode;
}

export function SelectTrigger(props: SelectTriggerProps) {
  const { ownProps } = useDefinition(SelectTriggerDefinition, props);
  const { classes, icon } = ownProps;

  return (
    <Button className={classes.root}>
      {icon}
      <SelectValue className={classes.value} />
      <div className={classes.chevron}>
        <RiArrowDownSLine aria-hidden="true" />
      </div>
    </Button>
  );
}
