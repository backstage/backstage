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
import { AlertInsightsSectionHeader } from './AlertInsightsSectionHeader';
import { Alert } from '../../types';

type AlertInsightsSectionProps = {
  alert: Alert;
  number: number;
};

export const AlertInsightsSection = ({
  alert,
  number,
}: AlertInsightsSectionProps) => {
  return (
    <Box display="flex" flexDirection="column">
      <AlertInsightsSectionHeader
        title={alert.title}
        subtitle={alert.subtitle}
        number={number}
      />
      {alert.url && (
        <Box textAlign="left" mt={0} mb={4}>
          <Button variant="contained" color="primary" href={alert.url}>
            {alert.buttonText || 'View Instructions'}
          </Button>
        </Box>
      )}
      {alert.element}
    </Box>
  );
};
