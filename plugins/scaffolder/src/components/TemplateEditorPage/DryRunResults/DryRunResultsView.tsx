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

import { LogViewer } from '@backstage/core-components';
import { StreamLanguage } from '@codemirror/language';
import { yaml as yamlSupport } from '@codemirror/legacy-modes/mode/yaml';
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import { makeStyles } from '@material-ui/core/styles';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import CodeMirror from '@uiw/react-codemirror';
import React, { useEffect, useMemo, useState } from 'react';
import { TaskStatusStepper } from '../../TaskPage/TaskPage';
import { TaskPageLinks } from '../../TaskPage/TaskPageLinks';
import { useDryRun } from '../DryRunContext';
import { FileBrowser } from '../../FileBrowser';
import { DryRunResultsSplitView } from './DryRunResultsSplitView';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexFlow: 'column nowrap',
  },
  contentWrapper: {
    flex: 1,
    position: 'relative',
  },
  content: {
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
});

function FilesContent() {
  const classes = useStyles();
  const { selectedResult } = useDryRun();
  const [selectedPath, setSelectedPath] = useState<string>('');
  const selectedFile = selectedResult?.directoryContents.find(
    f => f.path === selectedPath,
  );

  useEffect(() => {
    if (selectedResult) {
      const [firstFile] = selectedResult.directoryContents;
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
        filePaths={selectedResult.directoryContents.map(file => file.path)}
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
        const stepLog = selectedResult.log.filter(
          l => l.body.stepId === step.id,
        );
        return {
          id: step.id,
          name: step.name,
          logString: stepLog.map(l => l.body.message).join('\n'),
          status: stepLog[stepLog.length - 1]?.body.status ?? 'completed',
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

export function DryRunResultsView() {
  const classes = useStyles();
  const [selectedTab, setSelectedTab] = useState<'files' | 'log' | 'output'>(
    'files',
  );

  return (
    <div className={classes.root}>
      <Tabs value={selectedTab} onChange={(_, v) => setSelectedTab(v)}>
        <Tab value="files" label="Files" />
        <Tab value="log" label="Log" />
        <Tab value="output" label="Output" />
      </Tabs>
      <Divider />

      <div className={classes.contentWrapper}>
        <div className={classes.content}>
          {selectedTab === 'files' && <FilesContent />}
          {selectedTab === 'log' && <LogContent />}
          {selectedTab === 'output' && <OutputContent />}
        </div>
      </div>
    </div>
  );
}
