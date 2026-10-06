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

import useAsync from 'react-use/esm/useAsync';
import { fetchApiRef, useApi } from '@backstage/core-plugin-api';
import DOMPurify from 'dompurify';
import { readSourceJson } from './sourceClient';

export function SourceImage({
  base,
  onMissingArtifact,
  file,
  alt,
  width,
}: {
  base: string;
  onMissingArtifact?: (file: string) => void;
  file: string;
  alt: string;
  width?: number;
}) {
  const fetchApi = useApi(fetchApiRef);
  const state = useAsync(async () => {
    const raw = await readSourceJson(
      fetchApi,
      `${base}${file}`,
      14_000_000,
      false,
      undefined,
      () => onMissingArtifact?.(file),
    );
    if (
      !raw ||
      typeof raw !== 'object' ||
      !('data' in raw) ||
      !('extension' in raw) ||
      typeof raw.data !== 'string' ||
      typeof raw.extension !== 'string' ||
      !/^[a-zA-Z0-9+/]*={0,2}$/.test(raw.data)
    )
      throw new Error('Invalid image artifact');
    const type = (
      {
        png: 'png',
        jpg: 'jpeg',
        jpeg: 'jpeg',
        gif: 'gif',
        webp: 'webp',
        avif: 'avif',
        svg: 'svg+xml',
      } as Record<string, string>
    )[raw.extension];
    if (!type) throw new Error('Unsupported image type');
    if (type === 'svg+xml') {
      const text = new TextDecoder().decode(
        Uint8Array.from(atob(raw.data), c => c.charCodeAt(0)),
      );
      const clean = DOMPurify.sanitize(text, {
        USE_PROFILES: { svg: true, svgFilters: true },
        FORBID_TAGS: ['foreignObject', 'image', 'use', 'style'],
        FORBID_ATTR: ['href', 'xlink:href', 'style'],
      });
      return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(clean)}`;
    }
    return `data:image/${type};base64,${raw.data}`;
  }, [fetchApi, base, file, onMissingArtifact]);
  if (state.error) return <span role="note">Image unavailable: {alt}</span>;
  return state.value ? (
    <img width={width} src={state.value} alt={alt} loading="lazy" />
  ) : (
    <span>{alt}</span>
  );
}
