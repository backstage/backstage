/*
 * Copyright 2022 The Backstage Authors
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

import { BackstageTheme } from '@backstage/theme';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Divider from '@material-ui/core/Divider';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandLess';
import { usePrevious } from '@react-hookz/web';
import React, { useEffect, useState } from 'react';
import { useDryRun } from '../DryRunContext';
import { DryRunResultsList } from './DryRunResultsList';
import { DryRunResultsView } from './DryRunResultsView';

const useStyles = makeStyles((theme: BackstageTheme) => ({
  header: {
    height: 48,
    minHeight: 0,
    '&.Mui-expanded': {
      height: 48,
      minHeight: 0,
    },
  },
  content: {
    display: 'grid',
    background: theme.palette.background.default,
    gridTemplateColumns: '180px auto 1fr',
    gridTemplateRows: '1fr',
    padding: 0,
    height: 400,
  },
}));

export function DryRunResults() {
  const classes = useStyles();
  const dryRun = useDryRun();
  const [expanded, setExpanded] = useState(false);
  const [hidden, setHidden] = useState(true);

  const resultsLength = dryRun.results.length;
  const prevResultsLength = usePrevious(resultsLength);
  useEffect(() => {
    if (prevResultsLength === 0 && resultsLength === 1) {
      setHidden(false);
      setExpanded(true);
    } else if (prevResultsLength === 1 && resultsLength === 0) {
      setExpanded(false);
    }
  }, [prevResultsLength, resultsLength]);

  return (
    <>
      <Accordion
        variant="outlined"
        expanded={expanded}
        hidden={resultsLength === 0 && hidden}
        onChange={(_, exp) => setExpanded(exp)}
        onTransitionEnd={() => resultsLength === 0 && setHidden(true)}
      >
        <AccordionSummary
          className={classes.header}
          expandIcon={<ExpandMoreIcon />}
        >
          <Typography>Dry-run results</Typography>
        </AccordionSummary>
        <Divider orientation="horizontal" />
        <AccordionDetails className={classes.content}>
          <DryRunResultsList />
          <Divider orientation="horizontal" />
          <DryRunResultsView />
        </AccordionDetails>
      </Accordion>
    </>
  );
}
