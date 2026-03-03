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

import {
  LogViewer,
  Separator,
  ShadcnTabs,
  TabsList,
  TabsTrigger,
  cn,
} from '@backstage/core-components';
import { StreamLanguage } from '@codemirror/language';
import { yaml as yamlSupport } from '@codemirror/legacy-modes/mode/yaml';
import CodeMirror from '@uiw/react-codemirror';
import { useEffect, useMemo, useState } from 'react';
import { useDryRun } from '../DryRunContext';
import { DryRunResultsSplitView } from './DryRunResultsSplitView';
import { FileBrowser } from '../../../../components/FileBrowser';
import { TaskPageLinks } from './TaskPageLinks';
import { TaskStatusStepper } from './TaskStatusStepper';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import { scaffolderTranslationRef } from '../../../../translation';

function FilesContent() {
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
        className="h-full overflow-y-auto"
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
  const { selectedResult } = useDryRun();

  if (!selectedResult) {
    return null;
  }

  return (
    <DryRunResultsSplitView>
      <div className="pt-2">
        {selectedResult.output?.links?.length && (
          <TaskPageLinks output={selectedResult.output} />
        )}
      </div>
      <CodeMirror
        className="h-full overflow-y-auto"
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
  const [selectedTab, setSelectedTab] = useState<'files' | 'log' | 'output'>(
    'files',
  );
  const { t } = useTranslationRef(scaffolderTranslationRef);

  return (
    <ShadcnTabs
      value={selectedTab}
      onValueChange={v => setSelectedTab(v as 'files' | 'log' | 'output')}
      className="flex flex-col"
    >
      <TabsList>
        <TabsTrigger value="files">
          {t('templateEditorPage.dryRunResultsView.tab.files')}
        </TabsTrigger>
        <TabsTrigger value="log">
          {t('templateEditorPage.dryRunResultsView.tab.log')}
        </TabsTrigger>
        <TabsTrigger value="output">
          {t('templateEditorPage.dryRunResultsView.tab.output')}
        </TabsTrigger>
      </TabsList>
      <Separator />
      <div className="flex-1 relative">
        <div className={cn('absolute inset-0 flex [&>*]:flex-1')}>
          {selectedTab === 'files' && <FilesContent />}
          {selectedTab === 'log' && <LogContent />}
          {selectedTab === 'output' && <OutputContent />}
        </div>
      </div>
    </ShadcnTabs>
  );
}
