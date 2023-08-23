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
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';
import * as zip from "@zip.js/zip.js";
import {
  scaffolderApiRef,
  ScaffolderDryRunResponse,
} from '@backstage/plugin-scaffolder-react';

const MAX_CONTENT_SIZE = 64 * 1024;
const CHUNK_SIZE = 32 * 1024;

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
  downloadResult(id: number): void;
  execute(options: DryRunOptions): Promise<void>;
}

const DryRunContext = createContext<DryRun | undefined>(undefined);

interface DryRunProviderProps {
  children: ReactNode;
}

export function base64EncodeContent(content: string): string {
  if (content.length > MAX_CONTENT_SIZE) {
    return window.btoa('<file too large>');
  }

  try {
    return window.btoa(content);
  } catch {
    const decoder = new TextEncoder();
    const buffer = decoder.encode(content);

    const chunks = new Array<string>();
    for (let offset = 0; offset < buffer.length; offset += CHUNK_SIZE) {
      chunks.push(
        String.fromCharCode(...buffer.slice(offset, offset + CHUNK_SIZE)),
      );
    }
    return window.btoa(chunks.join(''));
  }
}

export function DryRunProvider(props: DryRunProviderProps) {
  const scaffolderApi = useApi(scaffolderApiRef);

  const [state, setState] = useState<
    Pick<DryRun, 'results' | 'selectedResult'>
  >({
    results: [],
    selectedResult: undefined,
  });
  const idRef = useRef(1);

  const selectResult = useCallback((id: number) => {
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
  }, []);

  const deleteResult = useCallback((id: number) => {
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
  }, []);

  const downloadResult = useCallback((id: number) => {
    setState(prevState => {
      const index = prevState.results.findIndex(r => r.id === id);
      if (index === -1) {
        return prevState;
      }
      const result = prevState.results[index];
      console.log('Result', result.id);
      createZipDownload(result.directoryContents, 'result_' + result.id)
      return {
        results: prevState.results,
        selectedResult: prevState.selectedResult,
      };
    });
  }, []);

  const execute = useCallback(
    async (options: DryRunOptions) => {
      if (!scaffolderApi.dryRun) {
        throw new Error('Scaffolder API does not support dry-run');
      }

      const parsed = yaml.parse(options.templateContent);

      const response = await scaffolderApi.dryRun({
        template: parsed,
        values: options.values,
        secrets: {},
        directoryContents: options.files.map(file => ({
          path: file.path,
          base64Content: base64EncodeContent(file.content),
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
    [scaffolderApi],
  );

  const dryRun = useMemo(
    () => ({
      ...state,
      selectResult,
      deleteResult,
      downloadResult,
      execute,
    }),
    [state, selectResult, deleteResult, execute],
  );

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

async function createZipDownload(directoryContents: { path: string; base64Content: string; executable: boolean; }[], name: string) {
  // needs zip.js

  // Creates a BlobWriter object where the zip content will be written.
  const zipFileWriter = new zip.BlobWriter();

  // Creates a ZipWriter object writing data via `zipFileWriter`, adds the entry
  const zipWriter = new zip.ZipWriter(zipFileWriter);

  for (const d of directoryContents) {
    // Decode text content from base64 to ascii
    const converted = atob(d.base64Content);
    
    // Creates a TextReader object storing the text of the entry to add in the zip (i.e. "Hello world!").
    const fileReader = new zip.TextReader(converted);

    await zipWriter.add(d.path, fileReader);
  }

  // Closes the writer.
  await zipWriter.close();

  // Retrieves the Blob object containing the zip content into `zipFileBlob`
  const zipFileBlob = await zipFileWriter.getData();

  // Download zip
  const a = document.createElement('a');
  a.href = URL.createObjectURL(zipFileBlob);
  a.download = `dry-run-${name}.zip`;
  a.click();
  URL.revokeObjectURL(a.href);
  a.remove();
}

