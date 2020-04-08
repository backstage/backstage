/*
 * Copyright 2020 Spotify AB
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
import React, { FC } from 'react';
import { Sparklines, SparklinesLine, SparklinesProps } from 'react-sparklines';
import { COLORS } from '@backstage/theme';

function color(data: number[]): string | undefined {
  const lastNum = data[data.length - 1];
  if (!lastNum) return undefined;
  if (lastNum >= 0.9) return COLORS.STATUS.OK;
  if (lastNum >= 0.5) return COLORS.STATUS.WARNING;
  return COLORS.STATUS.ERROR;
}

const CategoryTrendline: FC<SparklinesProps & { title?: string }> = props => {
  if (!props.data) return null;
  return (
    <Sparklines width={120} height={30} min={0} max={1} {...props}>
      {props.title && <title>{props.title}</title>}
      <SparklinesLine color={color(props.data)} />
    </Sparklines>
  );
};

export default CategoryTrendline;
