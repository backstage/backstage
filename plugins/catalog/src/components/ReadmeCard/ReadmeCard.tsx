/*
 * Copyright 2025 The Backstage Authors
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

import { useEffect, useState } from 'react';
import { useEntity } from '@backstage/plugin-catalog-react';
import { useApi, configApiRef } from '@backstage/core-plugin-api';
import { InfoCard, MarkdownContent } from '@backstage/core-components';

/** @public */
export function ReadmeCard(props: { variant?: 'gridItem' | 'fullHeight' }) {
  const { variant } = props;
  const { entity } = useEntity();
  const config = useApi(configApiRef);
  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchReadme() {
      try {
        const slug = entity.metadata.annotations?.['github.com/project-slug'];

        if (!slug) {
          setError('No github.com/project-slug annotation found');
          setLoading(false);
          return;
        }

        // Fetch README via Backstage backend, which handles GitHub auth
        const backendUrl = config.getString('backend.baseUrl');
        const response = await fetch(
          `${backendUrl}/api/catalog/entities/by-name/component/default/${entity.metadata.name}`,
        );

        // Fallback: fetch directly from GitHub raw content (no auth needed for public repos)
        const rawUrl = `https://raw.githubusercontent.com/${slug}/HEAD/README.md`;
        const readmeResponse = await fetch(rawUrl);

        if (!readmeResponse.ok) {
          setError('No README.md found in repository');
          setLoading(false);
          return;
        }

        const text = await readmeResponse.text();
        setContent(text);
      } catch (e) {
        setError(`Error: ${e instanceof Error ? e.message : String(e)}`);
      } finally {
        setLoading(false);
      }
    }

    fetchReadme();
  }, [entity, config]);

  if (loading) {
    return (
      <InfoCard title="README" variant={variant}>
        <div className="p-4 text-muted-foreground">Loading README...</div>
      </InfoCard>
    );
  }

  if (error || !content) {
    return (
      <InfoCard title="README" variant={variant}>
        <div className="p-4 text-muted-foreground">
          {error || 'No README found'}
        </div>
      </InfoCard>
    );
  }

  return (
    <InfoCard title="README" variant={variant}>
      <div className="p-4 max-h-[600px] overflow-y-auto">
        <MarkdownContent content={content} />
      </div>
    </InfoCard>
  );
}
