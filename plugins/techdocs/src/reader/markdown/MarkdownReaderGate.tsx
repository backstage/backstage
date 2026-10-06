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

import { ReactNode, lazy, Suspense } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import useAsync from 'react-use/esm/useAsync';
import { configApiRef, fetchApiRef, useApi } from '@backstage/core-plugin-api';
import { Progress, ResponseErrorPanel } from '@backstage/core-components';
import {
  techdocsStorageApiRef,
  useTechDocsReaderPage,
} from '@backstage/plugin-techdocs-react';
import {
  selectTechDocsRenderer,
  TECHDOCS_SOURCE_MANIFEST,
  techDocsSourceManifestSchema,
  TechDocsRenderingMode,
} from '@backstage/plugin-techdocs-common/alpha';
import { readSourceJson } from './sourceClient';

const MarkdownReader = lazy(() => import('./MarkdownReader'));

export function MarkdownReaderGate(props: {
  children: ReactNode;
  defaultPath?: string;
  onReady?: () => void;
}) {
  const config = useApi(configApiRef);
  // An absent migration configuration preserves the existing reader and its requests.
  if (!config.has('techdocs.migration.rendering')) return <>{props.children}</>;
  return <ConfiguredReader {...props} />;
}

function ConfiguredReader({
  children,
  defaultPath,
  onReady,
}: {
  children: ReactNode;
  defaultPath?: string;
  onReady?: () => void;
}) {
  const config = useApi(configApiRef);
  const storage = useApi(techdocsStorageApiRef);
  const fetchApi = useApi(fetchApiRef);
  const { entityRef } = useTechDocsReaderPage();
  const { namespace, kind, name } = entityRef;
  const [params] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const policy = config.getString(
    'techdocs.migration.rendering',
  ) as TechDocsRenderingMode;
  const state = useAsync(async () => {
    if (!['legacy', 'opt-in', 'prefer-source', 'source'].includes(policy))
      throw new Error(`Invalid rendering policy: ${policy}`);
    const base = `${(await storage.getStorageUrl()).replace(/\/$/, '')}/${[
      namespace,
      kind,
      name,
    ]
      .map(encodeURIComponent)
      .join('/')}/`;
    // Synchronization also handles the first source-only build, which has no HTML page.
    if ((await storage.getBuilder()) === 'local')
      await storage.syncEntityDocs(entityRef);
    const raw = await readSourceJson(
      fetchApi,
      `${base}${TECHDOCS_SOURCE_MANIFEST}`,
      5_000_000,
      true,
    );
    const manifest =
      raw === undefined ? undefined : techDocsSourceManifestSchema.parse(raw);
    return { base, manifest };
  }, [fetchApi, storage, namespace, kind, name, policy]);
  if (state.loading) return <Progress />;
  if (state.error) return <ResponseErrorPanel error={state.error} />;
  const { base, manifest } = state.value!;
  const renderer = selectTechDocsRenderer(
    policy,
    manifest,
    params.get('techdocs-preview'),
  );
  if (renderer === 'source' && !manifest?.available)
    return (
      <ResponseErrorPanel
        error={
          new Error(
            'Source documentation is unavailable. Publish with dual or source mode.',
          )
        }
      />
    );
  if (renderer === 'legacy' && manifest && !manifest.legacy)
    return (
      <ResponseErrorPanel
        error={
          new Error(
            'Published HTML is unavailable. Select source rendering for this source-only publication.',
          )
        }
      />
    );
  return (
    <>
      {manifest?.available && manifest.legacy && policy !== 'source' && (
        <label>
          Documentation preview{' '}
          <select
            aria-label="Documentation preview"
            value={renderer}
            onChange={event => {
              const next = new URLSearchParams(params);
              next.set('techdocs-preview', event.target.value);
              navigate(
                { ...location, search: next.toString() },
                { replace: true },
              );
            }}
          >
            <option value="legacy">Published HTML</option>
            <option value="source">Markdown</option>
          </select>
        </label>
      )}
      {renderer === 'source' ? (
        <Suspense fallback={<Progress />}>
          <MarkdownReader
            manifest={manifest!}
            base={base}
            defaultPath={defaultPath}
            onReady={onReady}
          />
        </Suspense>
      ) : (
        children
      )}
    </>
  );
}
