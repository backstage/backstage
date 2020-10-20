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
import React from 'react';
import moment from 'moment';
import { TooltipPayload, TooltipProps } from 'recharts';
import Tooltip, { TooltipItemProps } from '../../components/Tooltip';
import { DEFAULT_DATE_FORMAT } from '../../types';

export type CostOverviewTooltipProps = TooltipProps & {
  dataKeys: Array<string>;
  format: (payload: TooltipPayload) => TooltipItemProps;
};

const CostOverviewTooltip = ({
  label,
  payload,
  dataKeys,
  format,
}: CostOverviewTooltipProps) => {
  const tooltipLabel = moment(label).format(DEFAULT_DATE_FORMAT);
  const items = payload
    ?.filter((p: TooltipPayload) => dataKeys.includes(p.dataKey as string))
    .map(p => format(p));
  return <Tooltip label={tooltipLabel} items={items} />;
};

export default CostOverviewTooltip;
