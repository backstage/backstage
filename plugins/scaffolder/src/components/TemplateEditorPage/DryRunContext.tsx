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

import yaml from 'yaml';
import { useApi } from '@backstage/core-plugin-api';
import { JsonObject } from '@backstage/types';
import React, {
  createContext,
  ReactNode,
  useContext,
  useRef,
  useState,
} from 'react';
import { scaffolderApiRef } from '../../api';
import { ScaffolderDryRunResponse } from '../../types';

interface DryRunOptions {
  templateContent: string;
  values: JsonObject;
  files: Array<{ path: string; content: string }>;
}

interface DryRunResult extends ScaffolderDryRunResponse {
  id: number;
}

interface DryRun {
  results: DryRunResult[];
  selectedResult: DryRunResult | undefined;

  selectResult(id: number): void;
  deleteResult(id: number): void;
  execute(options: DryRunOptions): Promise<void>;
}

const DryRunContext = createContext<DryRun | undefined>(undefined);

interface DryRunProviderProps {
  children: ReactNode;
}

const fakeResults: DryRunResult[] = [
  {
    id: 1,
    content: [
      {
        path: 'catalog-info.yaml',
        executable: false,
        base64Content:
          'CmFwaVZlcnNpb246IGJhY2tzdGFnZS5pby92MWFscGhhMQpraW5kOiBDb21wb25lbnQKbWV0YWRhdGE6CiAgbmFtZTogImFzZCIKc3BlYzoKICB0eXBlOiB3ZWJzaXRlCiAgbGlmZWN5Y2xlOiBleHBlcmltZW50YWwKICBvd25lcjogCg==',
      },
      {
        path: 'catalog-info.yaml1',
        executable: false,
        base64Content:
          'CmFwaVZlcnNpb246IGJhY2tzdGFnZS5pby92MWFscGhhMQpraW5kOiBDb21wb25lbnQKbWV0YWRhdGE6CiAgbmFtZTogImFzZCIKc3BlYzoKICB0eXBlOiB3ZWJzaXRlCiAgbGlmZWN5Y2xlOiBleHBlcmltZW50YWwKICBvd25lcjogCg==',
      },
      {
        path: 'catalog-info.yaml2',
        executable: false,
        base64Content:
          'CmFwaVZlcnNpb246IGJhY2tzdGFnZS5pby92MWFscGhhMQpraW5kOiBDb21wb25lbnQKbWV0YWRhdGE6CiAgbmFtZTogImFzZCIKc3BlYzoKICB0eXBlOiB3ZWJzaXRlCiAgbGlmZWN5Y2xlOiBleHBlcmltZW50YWwKICBvd25lcjogCg==',
      },
      {
        path: 'catalog-info.yaml3',
        executable: false,
        base64Content:
          'CmFwaVZlcnNpb246IGJhY2tzdGFnZS5pby92MWFscGhhMQpraW5kOiBDb21wb25lbnQKbWV0YWRhdGE6CiAgbmFtZTogImFzZCIKc3BlYzoKICB0eXBlOiB3ZWJzaXRlCiAgbGlmZWN5Y2xlOiBleHBlcmltZW50YWwKICBvd25lcjogCg==',
      },
      {
        path: 'catalog-info.yaml4',
        executable: false,
        base64Content:
          'CmFwaVZlcnNpb246IGJhY2tzdGFnZS5pby92MWFscGhhMQpraW5kOiBDb21wb25lbnQKbWV0YWRhdGE6CiAgbmFtZTogImFzZCIKc3BlYzoKICB0eXBlOiB3ZWJzaXRlCiAgbGlmZWN5Y2xlOiBleHBlcmltZW50YWwKICBvd25lcjogCg==',
      },
      {
        path: 'catalog-info.yaml5',
        executable: false,
        base64Content:
          'CmFwaVZlcnNpb246IGJhY2tzdGFnZS5pby92MWFscGhhMQpraW5kOiBDb21wb25lbnQKbWV0YWRhdGE6CiAgbmFtZTogImFzZCIKc3BlYzoKICB0eXBlOiB3ZWJzaXRlCiAgbGlmZWN5Y2xlOiBleHBlcmltZW50YWwKICBvd25lcjogCg==',
      },
      {
        path: 'catalog-info.yaml6',
        executable: false,
        base64Content:
          'CmFwaVZlcnNpb246IGJhY2tzdGFnZS5pby92MWFscGhhMQpraW5kOiBDb21wb25lbnQKbWV0YWRhdGE6CiAgbmFtZTogImFzZCIKc3BlYzoKICB0eXBlOiB3ZWJzaXRlCiAgbGlmZWN5Y2xlOiBleHBlcmltZW50YWwKICBvd25lcjogCg==',
      },
      {
        path: 'catalog-info.yaml7',
        executable: false,
        base64Content:
          'CmFwaVZlcnNpb246IGJhY2tzdGFnZS5pby92MWFscGhhMQpraW5kOiBDb21wb25lbnQKbWV0YWRhdGE6CiAgbmFtZTogImFzZCIKc3BlYzoKICB0eXBlOiB3ZWJzaXRlCiAgbGlmZWN5Y2xlOiBleHBlcmltZW50YWwKICBvd25lcjogCg==',
      },
      {
        path: 'catalog-info.yaml8',
        executable: false,
        base64Content:
          'CmFwaVZlcnNpb246IGJhY2tzdGFnZS5pby92MWFscGhhMQpraW5kOiBDb21wb25lbnQKbWV0YWRhdGE6CiAgbmFtZTogImFzZCIKc3BlYzoKICB0eXBlOiB3ZWJzaXRlCiAgbGlmZWN5Y2xlOiBleHBlcmltZW50YWwKICBvd25lcjogCg==',
      },
      {
        path: 'catalog-info.yaml9',
        executable: false,
        base64Content:
          'CmFwaVZlcnNpb246IGJhY2tzdGFnZS5pby92MWFscGhhMQpraW5kOiBDb21wb25lbnQKbWV0YWRhdGE6CiAgbmFtZTogImFzZCIKc3BlYzoKICB0eXBlOiB3ZWJzaXRlCiAgbGlmZWN5Y2xlOiBleHBlcmltZW50YWwKICBvd25lcjogCg==',
      },
      {
        path: 'catalog-info.yaml10',
        executable: false,
        base64Content:
          'CmFwaVZlcnNpb246IGJhY2tzdGFnZS5pby92MWFscGhhMQpraW5kOiBDb21wb25lbnQKbWV0YWRhdGE6CiAgbmFtZTogImFzZCIKc3BlYzoKICB0eXBlOiB3ZWJzaXRlCiAgbGlmZWN5Y2xlOiBleHBlcmltZW50YWwKICBvd25lcjogCg==',
      },
      {
        path: 'catalog-info.yaml11',
        executable: false,
        base64Content:
          'CmFwaVZlcnNpb246IGJhY2tzdGFnZS5pby92MWFscGhhMQpraW5kOiBDb21wb25lbnQKbWV0YWRhdGE6CiAgbmFtZTogImFzZCIKc3BlYzoKICB0eXBlOiB3ZWJzaXRlCiAgbGlmZWN5Y2xlOiBleHBlcmltZW50YWwKICBvd25lcjogCg==',
      },
      {
        path: 'catalog-info.yaml12',
        executable: false,
        base64Content:
          'CmFwaVZlcnNpb246IGJhY2tzdGFnZS5pby92MWFscGhhMQpraW5kOiBDb21wb25lbnQKbWV0YWRhdGE6CiAgbmFtZTogImFzZCIKc3BlYzoKICB0eXBlOiB3ZWJzaXRlCiAgbGlmZWN5Y2xlOiBleHBlcmltZW50YWwKICBvd25lcjogCg==',
      },
      {
        path: 'catalog-info.yaml13',
        executable: false,
        base64Content:
          'CmFwaVZlcnNpb246IGJhY2tzdGFnZS5pby92MWFscGhhMQpraW5kOiBDb21wb25lbnQKbWV0YWRhdGE6CiAgbmFtZTogImFzZCIKc3BlYzoKICB0eXBlOiB3ZWJzaXRlCiAgbGlmZWN5Y2xlOiBleHBlcmltZW50YWwKICBvd25lcjogCg==',
      },
      {
        path: 'catalog-info.yaml14',
        executable: false,
        base64Content:
          'CmFwaVZlcnNpb246IGJhY2tzdGFnZS5pby92MWFscGhhMQpraW5kOiBDb21wb25lbnQKbWV0YWRhdGE6CiAgbmFtZTogImFzZCIKc3BlYzoKICB0eXBlOiB3ZWJzaXRlCiAgbGlmZWN5Y2xlOiBleHBlcmltZW50YWwKICBvd25lcjogCg==',
      },
    ],
    steps: [
      {
        id: 'fetch-base',
        name: 'Fetch stuff',
        action: 'fetch:plain',
      },
      {
        id: 'fetch-base2',
        name: 'Fetch stuff',
        action: 'fetch:plain',
      },
      {
        id: 'fetch-base3',
        name: 'Fetch stuff',
        action: 'fetch:plain',
      },
      {
        id: 'fetch-base4',
        name: 'Fetch stuff',
        action: 'fetch:plain',
      },
      {
        id: 'fetch-base5',
        name: 'Fetch stuff',
        action: 'fetch:plain',
      },
      {
        id: 'publish',
        name: 'Publish Stuff',
        action: 'publish:github',
      },
      {
        id: 'register',
        name: 'Register Stuff',
        action: 'catalog:register',
      },
    ],
    log: [
      {
        message: 'Starting up task with 4 steps',
      },
      {
        stepId: 'fetch-base',
        status: 'processing',
        message: 'Beginning step Fetch Base',
      },
      {
        stepId: 'fetch-base',
        message:
          '\u001b[32minfo\u001b[39m: Fetching template content from remote URL {"timestamp":"2022-04-18T11:25:46.888Z"}',
      },
      {
        stepId: 'fetch-base',
        message:
          '\u001b[32minfo\u001b[39m: Listing files and directories in template {"timestamp":"2022-04-18T11:25:46.889Z"}',
      },
      {
        stepId: 'fetch-base',
        message:
          '\u001b[32minfo\u001b[39m: Processing 1 template files/directories with input values {"name":"asd","timestamp":"2022-04-18T11:25:46.890Z"}',
      },
      {
        stepId: 'fetch-base',
        message:
          '\u001b[32minfo\u001b[39m: Writing file catalog-info.yaml to template output path with mode 33188. {"timestamp":"2022-04-18T11:25:46.932Z"}',
      },
      {
        stepId: 'fetch-base',
        message:
          '\u001b[32minfo\u001b[39m: Template result written to /var/folders/ll/hcvgyy216t70dkjxwkk7csn00000gn/T/dry-run-5c024be8-8a08-4a10-a502-b43c64ed9061 {"timestamp":"2022-04-18T11:25:46.936Z"}',
      },
      {
        stepId: 'fetch-base',
        message:
          '\u001b[32minfo\u001b[39m: Template result written to /var/folders/ll/hcvgyy216t70dkjxwkk7csn00000gn/T/dry-run-5c024be8-8a08-4a10-a502-b43c64ed9061 {"timestamp":"2022-04-18T11:25:46.936Z"}',
      },
      {
        stepId: 'fetch-base',
        message:
          '\u001b[32minfo\u001b[39m: Template result written to /var/folders/ll/hcvgyy216t70dkjxwkk7csn00000gn/T/dry-run-5c024be8-8a08-4a10-a502-b43c64ed9061 {"timestamp":"2022-04-18T11:25:46.936Z"}',
      },
      {
        stepId: 'fetch-base',
        message:
          '\u001b[32minfo\u001b[39m: Template result written to /var/folders/ll/hcvgyy216t70dkjxwkk7csn00000gn/T/dry-run-5c024be8-8a08-4a10-a502-b43c64ed9061 {"timestamp":"2022-04-18T11:25:46.936Z"}',
      },
      {
        stepId: 'fetch-base',
        message:
          '\u001b[32minfo\u001b[39m: Template result written to /var/folders/ll/hcvgyy216t70dkjxwkk7csn00000gn/T/dry-run-5c024be8-8a08-4a10-a502-b43c64ed9061 {"timestamp":"2022-04-18T11:25:46.936Z"}',
      },
      {
        stepId: 'fetch-base',
        message:
          '\u001b[32minfo\u001b[39m: Template result written to /var/folders/ll/hcvgyy216t70dkjxwkk7csn00000gn/T/dry-run-5c024be8-8a08-4a10-a502-b43c64ed9061 {"timestamp":"2022-04-18T11:25:46.936Z"}',
      },
      {
        stepId: 'fetch-base',
        message:
          '\u001b[32minfo\u001b[39m: Template result written to /var/folders/ll/hcvgyy216t70dkjxwkk7csn00000gn/T/dry-run-5c024be8-8a08-4a10-a502-b43c64ed9061 {"timestamp":"2022-04-18T11:25:46.936Z"}',
      },
      {
        stepId: 'fetch-base',
        message:
          '\u001b[32minfo\u001b[39m: Template result written to /var/folders/ll/hcvgyy216t70dkjxwkk7csn00000gn/T/dry-run-5c024be8-8a08-4a10-a502-b43c64ed9061 {"timestamp":"2022-04-18T11:25:46.936Z"}',
      },
      {
        stepId: 'fetch-base',
        message:
          '\u001b[32minfo\u001b[39m: Template result written to /var/folders/ll/hcvgyy216t70dkjxwkk7csn00000gn/T/dry-run-5c024be8-8a08-4a10-a502-b43c64ed9061 {"timestamp":"2022-04-18T11:25:46.936Z"}',
      },
      {
        stepId: 'fetch-base',
        message:
          '\u001b[32minfo\u001b[39m: Template result written to /var/folders/ll/hcvgyy216t70dkjxwkk7csn00000gn/T/dry-run-5c024be8-8a08-4a10-a502-b43c64ed9061 {"timestamp":"2022-04-18T11:25:46.936Z"}',
      },
      {
        stepId: 'fetch-base',
        message:
          '\u001b[32minfo\u001b[39m: Template result written to /var/folders/ll/hcvgyy216t70dkjxwkk7csn00000gn/T/dry-run-5c024be8-8a08-4a10-a502-b43c64ed9061 {"timestamp":"2022-04-18T11:25:46.936Z"}',
      },
      {
        stepId: 'fetch-base',
        message:
          '\u001b[32minfo\u001b[39m: Template result written to /var/folders/ll/hcvgyy216t70dkjxwkk7csn00000gn/T/dry-run-5c024be8-8a08-4a10-a502-b43c64ed9061 {"timestamp":"2022-04-18T11:25:46.936Z"}',
      },
      {
        stepId: 'fetch-base',
        message:
          '\u001b[32minfo\u001b[39m: Template result written to /var/folders/ll/hcvgyy216t70dkjxwkk7csn00000gn/T/dry-run-5c024be8-8a08-4a10-a502-b43c64ed9061 {"timestamp":"2022-04-18T11:25:46.936Z"}',
      },
      {
        stepId: 'fetch-base',
        message:
          '\u001b[32minfo\u001b[39m: Template result written to /var/folders/ll/hcvgyy216t70dkjxwkk7csn00000gn/T/dry-run-5c024be8-8a08-4a10-a502-b43c64ed9061 {"timestamp":"2022-04-18T11:25:46.936Z"}',
      },
      {
        stepId: 'fetch-base',
        message:
          '\u001b[32minfo\u001b[39m: Template result written to /var/folders/ll/hcvgyy216t70dkjxwkk7csn00000gn/T/dry-run-5c024be8-8a08-4a10-a502-b43c64ed9061 {"timestamp":"2022-04-18T11:25:46.936Z"}',
      },
      {
        stepId: 'fetch-base',
        message:
          '\u001b[32minfo\u001b[39m: Template result written to /var/folders/ll/hcvgyy216t70dkjxwkk7csn00000gn/T/dry-run-5c024be8-8a08-4a10-a502-b43c64ed9061 {"timestamp":"2022-04-18T11:25:46.936Z"}',
      },
      {
        stepId: 'fetch-base',
        status: 'completed',
        message: 'Finished step Fetch Base',
      },
      {
        stepId: 'fetch-base2',
        status: 'completed',
        message: 'Finished step Fetch Base',
      },
      {
        stepId: 'fetch-base3',
        status: 'completed',
        message: 'Finished step Fetch Base',
      },
      {
        stepId: 'fetch-base4',
        status: 'completed',
        message: 'Finished step Fetch Base',
      },
      {
        stepId: 'fetch-base5',
        status: 'completed',
        message: 'Finished step Fetch Base',
      },
      {
        stepId: 'publish',
        status: 'processing',
        message: 'Beginning step Publish',
      },
      {
        stepId: 'publish',
        status: 'completed',
        message: 'Skipping because publish:bitbucket does not support dry-run',
      },
      {
        stepId: 'register',
        status: 'processing',
        message: 'Beginning step Register',
      },
      {
        stepId: 'register',
        status: 'completed',
        message: 'Skipping because catalog:register does not support dry-run',
      },
    ],
    output: {
      links: [
        {
          title: 'Repository',
          url: '<example>',
        },
        {
          title: 'Open in catalog',
          icon: 'catalog',
          entityRef: 'entity',
        },
      ],
    },
  },
];

export function DryRunProvider(props: DryRunProviderProps) {
  const scaffolderApi = useApi(scaffolderApiRef);

  const [state, setState] = useState<
    Pick<DryRun, 'results' | 'selectedResult'>
  >({
    results: [
      { ...fakeResults[0], id: 1 },
      { ...fakeResults[0], id: 2 },
      { ...fakeResults[0], id: 3 },
      { ...fakeResults[0], id: 4 },
      { ...fakeResults[0], id: 5 },
    ],
    selectedResult: fakeResults[0],
  });
  const idRef = useRef(1);

  const dryRun = {
    ...state,
    selectResult: (id: number) => {
      setState(prevState => {
        const result = prevState.results.find(r => r.id === id);
        if (result === prevState.selectedResult) {
          return prevState;
        }
        return {
          results: prevState.results,
          selectedResult: result,
        };
      });
    },
    deleteResult: (id: number) => {
      setState(prevState => {
        const index = prevState.results.findIndex(r => r.id === id);
        if (index === -1) {
          return prevState;
        }
        const newResults = prevState.results.slice();
        const [deleted] = newResults.splice(index, 1);
        return {
          results: newResults,
          selectedResult:
            prevState.selectedResult?.id === deleted.id
              ? newResults[0]
              : prevState.selectedResult,
        };
      });
    },
    execute: async (options: DryRunOptions) => {
      if (!scaffolderApi.dryRun) {
        throw new Error('Scaffolder API does not support dry-run');
      }

      const parsed = yaml.parse(options.templateContent);

      const response = await scaffolderApi.dryRun({
        template: parsed,
        values: options.values,
        secrets: {},
        content: options.files.map(file => ({
          path: file.path,
          base64Content: btoa(file.content),
        })),
      });

      const result = {
        ...response,
        id: idRef.current++,
      };

      setState(prevState => ({
        results: [...prevState.results, result],
        selectedResult: prevState.selectedResult ?? result,
      }));
    },
  };

  return (
    <DryRunContext.Provider value={dryRun}>
      {props.children}
    </DryRunContext.Provider>
  );
}

export function useDryRun(): DryRun {
  const value = useContext(DryRunContext);
  if (!value) {
    throw new Error('must be used within a DryRunProvider');
  }
  return value;
}
