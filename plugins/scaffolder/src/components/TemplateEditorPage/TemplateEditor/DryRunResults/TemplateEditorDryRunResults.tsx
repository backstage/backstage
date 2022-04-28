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

import { makeStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import React, { useEffect, useMemo, useState } from 'react';
import { useDryRun } from '../DryRunContext';
import ExpandMoreIcon from '@material-ui/icons/ExpandLess';
import { FileBrowser } from '../FileBrowser';
import CodeMirror from '@uiw/react-codemirror';
import { yaml as yamlSupport } from '@codemirror/legacy-modes/mode/yaml';
import { StreamLanguage } from '@codemirror/language';
import { LogViewer } from '@backstage/core-components';
import { usePrevious } from '@react-hookz/web';
import { TaskStatusStepper } from '../../../TaskPage/TaskPage';
import { TaskPageLinks } from '../../../TaskPage/TaskPageLinks';
import { BackstageTheme } from '@backstage/theme';
import { DryRunResultsSplitView } from './DryRunResultsSplitView';
import { DryRunResultsList } from './DryRunResultsList';

const useStyles = makeStyles((theme: BackstageTheme) => ({
  accordionHeader: {
    height: 48,
    minHeight: 0,
    '&.Mui-expanded': {
      height: 48,
      minHeight: 0,
    },
  },
  accordionContent: {
    display: 'grid',
    background: theme.palette.background.default,
    gridTemplateColumns: '180px auto 1fr',
    gridTemplateRows: '1fr',
    padding: 0,
    height: 400,
  },
  resultView: {
    display: 'flex',
    flexFlow: 'column nowrap',
  },
  resultViewItemWrapper: {
    flex: 1,
    position: 'relative',
  },
  resultViewItem: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,

    display: 'flex',
    '& > *': {
      flex: 1,
    },
  },
  codeMirror: {
    height: '100%',
    overflowY: 'auto',
  },
}));

export function TemplateEditorDryRunResults() {
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
          className={classes.accordionHeader}
          expandIcon={<ExpandMoreIcon />}
        >
          <Typography>Dry-run results</Typography>
        </AccordionSummary>
        <Divider orientation="horizontal" />
        <AccordionDetails className={classes.accordionContent}>
          <DryRunResultsList />
          <Divider orientation="horizontal" />
          <ResultView />
        </AccordionDetails>
      </Accordion>
    </>
  );
}

function ResultView() {
  const classes = useStyles();
  const [selectedTab, setSelectedTab] = useState<'files' | 'log' | 'output'>(
    'files',
  );

  return (
    <div className={classes.resultView}>
      <Tabs value={selectedTab} onChange={(_, v) => setSelectedTab(v)}>
        <Tab value="files" label="Files" />
        <Tab value="log" label="Log" />
        <Tab value="output" label="Output" />
      </Tabs>
      <Divider />

      <div className={classes.resultViewItemWrapper}>
        <div className={classes.resultViewItem}>
          {selectedTab === 'files' && <FilesContent />}
          {selectedTab === 'log' && <LogContent />}
          {selectedTab === 'output' && <OutputContent />}
        </div>
      </div>
    </div>
  );
}

function FilesContent() {
  const classes = useStyles();
  const { selectedResult } = useDryRun();
  const [selectedPath, setSelectedPath] = useState<string>('');
  const selectedFile = selectedResult?.content.find(
    f => f.path === selectedPath,
  );

  useEffect(() => {
    if (selectedResult) {
      const [firstFile] = selectedResult.content;
      if (firstFile) {
        setSelectedPath(firstFile.path);
      } else {
        setSelectedPath('');
      }
    }
    return undefined;
  }, [selectedResult]);

  if (!selectedResult) {
    return null;
  }
  return (
    <DryRunResultsSplitView>
      <FileBrowser
        selected={selectedPath}
        onSelect={setSelectedPath}
        filePaths={selectedResult.content.map(file => file.path)}
      />
      <CodeMirror
        className={classes.codeMirror}
        theme="dark"
        height="100%"
        extensions={[StreamLanguage.define(yamlSupport)]}
        readOnly
        value={
          selectedFile?.base64Content ? atob(selectedFile.base64Content) : ''
        }
      />
    </DryRunResultsSplitView>
  );
}
function LogContent() {
  const { selectedResult } = useDryRun();
  const [currentStepId, setUserSelectedStepId] = useState<string>();

  const steps = useMemo(() => {
    if (!selectedResult) {
      return [];
    }
    return (
      selectedResult.steps.map(step => {
        const stepLog = selectedResult.log.filter(l => l.stepId === step.id);
        return {
          id: step.id,
          name: step.name,
          logString: stepLog.map(l => l.message).join('\n'),
          status: stepLog[stepLog.length - 1]?.status ?? 'completed',
        };
      }) ?? []
    );
  }, [selectedResult]);

  if (!selectedResult) {
    return null;
  }

  const selectedStep = steps.find(s => s.id === currentStepId) ?? steps[0];

  return (
    <DryRunResultsSplitView>
      <TaskStatusStepper
        steps={steps}
        currentStepId={selectedStep.id}
        onUserStepChange={setUserSelectedStepId}
      />
      <LogViewer text={selectedStep?.logString ?? ''} />
    </DryRunResultsSplitView>
  );
}

function OutputContent() {
  const classes = useStyles();
  const { selectedResult } = useDryRun();

  if (!selectedResult) {
    return null;
  }

  return (
    <DryRunResultsSplitView>
      <Box pt={2}>
        {selectedResult.output?.links?.length && (
          <TaskPageLinks output={selectedResult.output} />
        )}
      </Box>
      <CodeMirror
        className={classes.codeMirror}
        theme="dark"
        height="100%"
        extensions={[StreamLanguage.define(yamlSupport)]}
        readOnly
        value={JSON.stringify(selectedResult.output, null, 2)}
      />
    </DryRunResultsSplitView>
  );
}
