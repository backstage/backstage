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
import React, { useState, FC } from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  styled,
} from '@material-ui/core';
import { StatusIndicator } from './StatusIndicator';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Status } from '../types';
import { RmErrorBoundary } from './RmErrorBoundry';

const BlankIcon = styled('div')({
  width: 24,
});

export const RmAccordion: FC<{
  children?: React.ReactNode;
  status?: Status;
  loading?: boolean;
  title: string | React.ReactNode;
  expandable?: boolean;
  flexDirection?: 'row' | 'column';
}> = ({
  children,
  status,
  loading = false,
  title,
  expandable,
  flexDirection = 'row',
}) => {
  const [expanded, setExpanded] = useState(false);

  const _expandable =
    expandable === undefined ? !loading && status !== 'ok' : expandable;

  const handleExpansionClick = () => {
    if (_expandable) setExpanded(!expanded);
  };

  return (
    <Accordion expanded={expanded} style={{ width: '100%' }}>
      <AccordionSummary
        onClick={handleExpansionClick}
        expandIcon={_expandable ? <ExpandMoreIcon /> : <BlankIcon />}
      >
        {status && <StatusIndicator status={status} />}
        {title}
      </AccordionSummary>
      <RmErrorBoundary>
        <>
          {children && (
            <AccordionDetails style={{ flexDirection }}>
              {children}
            </AccordionDetails>
          )}
        </>
      </RmErrorBoundary>
    </Accordion>
  );
};
