/*
 * Copyright 2020 The Backstage Authors
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

import { Grid, type Columns } from '@backstage/ui';
import { IconLink } from './IconLink';
import { ColumnBreakpoints } from './types';
import { useDynamicColumns } from './useDynamicColumns';
import { IconComponent } from '@backstage/core-plugin-api';

export interface LinksGridListItem {
  href: string;
  text?: string;
  Icon?: IconComponent;
}

interface LinksGridListProps {
  items: LinksGridListItem[];
  cols?: ColumnBreakpoints | number;
}

export function LinksGridList(props: LinksGridListProps) {
  const { items, cols = undefined } = props;
  const numOfCols = useDynamicColumns(cols);

  return (
    <Grid.Root
      columns={String(Math.min(Math.max(numOfCols, 1), 12)) as Columns}
      gap="2"
    >
      {items.map(({ text, href, Icon }, i) => (
        <IconLink key={i} href={href} text={text ?? href} Icon={Icon} />
      ))}
    </Grid.Root>
  );
}
