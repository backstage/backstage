/*
 * Copyright 2026 The Backstage Authors
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

import { useState } from 'react';
import {
  Button,
  Dialog,
  DialogContent,
  DialogActions,
} from '@material-ui/core';
import {
  useTechDocsDocument,
  useTechDocsSelection,
  TechDocsMarkdownComponentProps,
} from '@backstage/plugin-techdocs-react/alpha';
import { useTechDocsReaderPage } from '@backstage/plugin-techdocs-react';
import { useApi } from '@backstage/core-plugin-api';
import { scmIntegrationsApiRef } from '@backstage/integration-react';
import parseGitUrl from 'git-url-parse';
import { IssueLink } from './ReportIssue/IssueLink';

export function MarkdownLightBox({
  defaultComponent,
}: TechDocsMarkdownComponentProps) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)} aria-label="Enlarge image">
        {defaultComponent}
      </Button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="xl"
        aria-label="Enlarged documentation image"
      >
        <DialogContent>{defaultComponent}</DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export function MarkdownReportIssue() {
  const document = useTechDocsDocument();
  const selection = useTechDocsSelection();
  const { entityMetadata } = useTechDocsReaderPage();
  const integrations = useApi(scmIntegrationsApiRef);
  const url = entityMetadata.value?.locationMetadata?.target;
  if (!selection.text || !url || !/^https?:\/\//.test(url)) return null;
  const type = integrations.byUrl(url)?.type;
  if (type !== 'github' && type !== 'gitlab') return null;
  const repository = { ...parseGitUrl(url), type };
  return (
    <IssueLink
      repository={repository}
      template={{
        title: `Documentation feedback: ${selection.text.slice(0, 70)}`,
        body: `Page: ${document.path}${
          selection.startLine ? ` (line ${selection.startLine})` : ''
        }\n\n${selection.text
          .split('\n')
          .map(line => `> ${line}`)
          .join('\n')}\n\nDocumentation: ${window.location.href}`,
      }}
    />
  );
}
