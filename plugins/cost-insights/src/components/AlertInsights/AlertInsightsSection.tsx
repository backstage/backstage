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
import { Box, Button } from '@material-ui/core';
import AlertInsightsSectionHeader from './AlertInsightsSectionHeader';
import {
  getAlertButtonText,
  getAlertText,
  getAlertUrl,
} from '../../utils/alerts';
import { Alert, Currency } from '../../types';
import { useCurrency } from '../../hooks';

type AlertInsightsSectionProps = {
  alert: Alert;
  number: number;
  render: (alert: Alert, currency: Currency) => JSX.Element;
};

const AlertInsightsSection = ({
  alert,
  number,
  render,
}: AlertInsightsSectionProps) => {
  const [currency] = useCurrency();
  const text = getAlertText(alert);
  const url = getAlertUrl(alert);
  const buttonText = getAlertButtonText(alert);

  return (
    <Box display="flex" flexDirection="column">
      <AlertInsightsSectionHeader
        alert={alert}
        title={text.title}
        subtitle={text.subtitle}
        number={number}
      />
      <Box textAlign="left" mt={0} mb={4}>
        <Button variant="contained" color="primary" href={url}>
          {buttonText}
        </Button>
        {/* <Button color="primary">Dismiss notification</Button> */}
      </Box>
      {render(alert, currency)}
    </Box>
  );
};

export default AlertInsightsSection;
