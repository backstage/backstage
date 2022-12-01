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
import { techdocsStorageApiRef } from '@backstage/plugin-techdocs-react';
import { useEffect } from 'react';
import { useNavigate, useParams, generatePath } from 'react-router';
import { AsyncState } from 'react-use/lib/useAsyncFn';
import { CompoundEntityRef } from '@backstage/catalog-model';
import { useApi } from '@backstage/core-plugin-api';
import useAsyncRetry from 'react-use/lib/useAsyncRetry';
import { parseRefresh, resolveRelPath } from './utilities';

/**
 * TechDocsRedirectAddon component
 *
 * @internal
 *
 */

export type RawPage = {
  content: string;
  path: string;
  entityId: CompoundEntityRef;
};

export type RawPageParams = {
  path: string;
  kind: string;
  namespace: string;
  name: string;
};

export function useRawPage(params: RawPageParams): AsyncState<RawPage> & {
  retry(): void;
} {
  const { path, kind, namespace, name } = params;
  const techdocsStorageApi = useApi(techdocsStorageApiRef);

  return useAsyncRetry(async () => {
    const content = await techdocsStorageApi.getEntityDocs(
      { kind, namespace, name },
      path,
    );

    return {
      content,
      path,
      entityId: {
        kind,
        name,
        namespace,
      },
    };
  }, [techdocsStorageApi, kind, namespace, name, path]);
}

export const TechDocsRedirectAddon = () => {
  const params = useParams();

  const rp = useRawPage(params as RawPageParams);

  const navigate = useNavigate();
  useEffect(() => {
    // don't do anything until we are done loading
    if (rp.loading || rp.value === undefined) {
      return;
    }
    const path = params['*'] ?? '';
    const { namespace, name, kind } = params;
    const { content } = rp.value;
    let r = parseRefresh(content);
    // if there is no redirect to interpret or it's an empty string, do nothing
    if (r === undefined || r.length === 0) {
      return;
    } else if (r.startsWith('http://') || r.startsWith('https://')) {
      // handle external redirects. just these 2 protocols are respected
      window.location.replace(r);
      return;
    }
    // handle ../... as path-relative and /abc/def/xyz as route-relative to allow redirecting across projects if need be
    // TODO: react-router v6.4+ only, enable when backstage gets there
    /*
      const relativeMode: RelativeRoutingType = r.startsWith('..')
        ? 'path'
        : 'route';
      navigate(r, {
        relative: relativeMode,
      });
      */
    // in react-router v6.3 we gotta manage this ourselves, with the following limitations:
    // - multiple ../ in redirects will not be handled correctly
    // - redirects will send to the main /docs/ portal always
    r = resolveRelPath(path, r); // drop the ../ and generate an absolute path instead
    const pathTo = generatePath('/docs/:namespace/:kind/:name/*', {
      namespace: namespace!,
      name: name!,
      kind: kind!,
      '*': r,
    });
    navigate(pathTo);
  }, [navigate, rp, params]);
  return null;
};
