/*
 * Copyright 2021 The Backstage Authors
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
import { TrendLine } from '@backstage/core-components';
import { BuildCount } from '../../api';
import { Typography, useTheme } from '@material-ui/core';
import { BackstageTheme } from '@backstage/theme';

const TRENDLINE_TITLE = 'Build Count';

interface BuildTrendProps {
  buildCounts: BuildCount[];
}

export const BuildTrendComponent = ({ buildCounts }: BuildTrendProps) => {
  const theme = useTheme<BackstageTheme>();

  let max = 0;
  const builds = buildCounts.map(counts => {
    max = Math.max(max, counts.builds);
    return counts.builds;
  });

  return (
    <>
      <Typography variant="overline">{TRENDLINE_TITLE}</Typography>
      <TrendLine
        data={builds}
        title={TRENDLINE_TITLE}
        max={max}
        color={theme.palette.primary.main}
      />
    </>
  );
};
