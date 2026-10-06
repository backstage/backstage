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

import { ReactNode, useState } from 'react';
import { fetchApiRef, useApi } from '@backstage/core-plugin-api';
import { readSourceJson } from './sourceClient';

export function SourceAssetLink({
  base,
  onMissingArtifact,
  asset,
  children,
}: {
  base: string;
  onMissingArtifact?: (file: string) => void;
  asset: { path: string; file: string };
  children: ReactNode;
}) {
  const fetchApi = useApi(fetchApiRef);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);
  const download = async () => {
    setBusy(true);
    setError(false);
    try {
      const raw = await readSourceJson(
        fetchApi,
        `${base}${asset.file}`,
        14_000_000,
        false,
        undefined,
        () => onMissingArtifact?.(asset.file),
      );
      if (
        !raw ||
        typeof raw !== 'object' ||
        !('data' in raw) ||
        typeof raw.data !== 'string' ||
        !/^[a-zA-Z0-9+/]*={0,2}$/.test(raw.data)
      )
        throw new Error('Invalid asset artifact');
      const url = URL.createObjectURL(
        new Blob([Uint8Array.from(atob(raw.data), c => c.charCodeAt(0))], {
          type: 'application/octet-stream',
        }),
      );
      const link = document.createElement('a');
      link.href = url;
      link.download = asset.path.split('/').pop()!;
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 60_000);
    } catch {
      setError(true);
    } finally {
      setBusy(false);
    }
  };
  return (
    <>
      <button type="button" disabled={busy} onClick={download}>
        {children}
      </button>
      {error && <span role="alert">Download unavailable</span>}
    </>
  );
}
