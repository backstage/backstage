/*
 * Copyright 2023 The Backstage Authors
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
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import { GaugePropsGetColor, LinearGauge } from '@backstage/core-components';
import { currentToDeclaredResourceToPerc } from '../../utils/resources';

/**
 * Context for Pod Metrics
 *
 * @public
 */
export interface ResourceUtilizationProps {
  compressed?: boolean;
  title: string;
  usage: number | string;
  total: number | string;
  totalFormatted: string;
}

const getProgressColor: GaugePropsGetColor = ({
  palette,
  value,
  inverse,
  max,
}) => {
  if (isNaN(value)) {
    return palette.status.pending;
  }
  const actualMax = max ? max : 100;
  const actualValue = inverse ? actualMax - value : value;

  if (actualValue >= actualMax) {
    return palette.status.error;
  } else if (actualValue > 90 || actualValue < 40) {
    return palette.status.warning;
  }

  return palette.status.ok;
};

/**
 * Context for Pod Metrics
 *
 * @public
 */
export const ResourceUtilization = ({
  compressed = false,
  title,
  usage,
  total,
  totalFormatted,
}: ResourceUtilizationProps) => {
  const utilization = currentToDeclaredResourceToPerc(usage, total);
  return (
    <Grid container spacing={0}>
      <Grid item xs={12}>
        <Typography
          variant={compressed ? 'caption' : 'subtitle2'}
        >{`${title}: ${totalFormatted}`}</Typography>
      </Grid>
      <Grid item xs={12}>
        <LinearGauge
          getColor={getProgressColor}
          width={compressed ? 'thin' : 'thick'}
          value={utilization / 100}
        />
        {!compressed && (
          <Typography variant="caption">usage: {`${utilization}%`}</Typography>
        )}
      </Grid>
    </Grid>
  );
};
