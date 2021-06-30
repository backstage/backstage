/*
 * Copyright 2021 Spotify AB
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
import { Octokit } from '@octokit/core';
import React, { ReactNode } from 'react';
import yaml from 'js-yaml';
import { generatePath, useParams } from 'react-router-dom';
import { useAsync } from 'react-use';
import { Page, Content } from '@backstage/core';
import { Header, HeaderLabel } from '@backstage/core-components';
import { useApi } from '@backstage/core-plugin-api';
import { techdocsApiRef } from '@backstage/plugin-techdocs';
import MDX from '@mdx-js/runtime';

import { rootDocsRouteRef } from '../../routes';

const octokit = new Octokit({
  auth: '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',
});
const getContents = async (owner, repo, path) => {
  try {
    const response = await octokit.request(
      'GET /repos/{owner}/{repo}/contents/{path}',
      { owner, repo, path },
    );
    const { data } = response;

    //   @ts-ignore
    const buffer = Buffer.from(data.content, 'base64');
    return buffer.toString('utf8');
  } catch (error) {
    return '';
  }
};

const nestNavigation = (baseUrl: string, nav: object, level = 0): ReactNode => {
  if (Array.isArray(nav)) {
    return nav.map(item => nestNavigation(baseUrl, item, level + 1)).join('\n');
  }

  const [key, value] = Object.entries(nav)[0];
  if (Array.isArray(value)) {
    return `${'  '.repeat(level)}- ${key}\n${nestNavigation(
      baseUrl,
      value,
      level + 1,
    )}`;
  }
  return `${'  '.repeat(level)}- [${key}](${baseUrl}${value.split('.')[0]})`;
};

export const ToC = ({ toc, baseUrl }: { baseUrl: string; toc: object }) => (
  <MDX>{nestNavigation(baseUrl, toc)}</MDX>
);

export const TechDocsXPage = () => {
  const { namespace, kind, name } = useParams();

  const techdocsApi = useApi(techdocsApiRef);
  const { value: [markdown, navigation] = [] } = useAsync(async () => {
    const entity = await techdocsApi.getEntityMetadata({
      kind,
      namespace,
      name,
    });
    const target = entity.locationMetadata.target;
    const url = new URL(target);
    const [, owner, repo, ...subpaths] = url.pathname.split('/');
    const subpath =
      subpaths.length > 0 ? `${subpaths.slice(2).join('/')}/` : '';
    const path = location.pathname
      .split('/')
      .slice(5)
      .join('/');
    let contents;
    if (path) {
      contents = await getContents(owner, repo, `${subpath}docs/${path}.md`);
    } else {
      contents =
        (await getContents(owner, repo, `${subpath}docs/README.md`)) ||
        (await getContents(owner, repo, `${subpath}docs/index.md`));
    }

    const yamlFile = await getContents(owner, repo, 'mkdocs.yml');
    const parsed = yaml.load(yamlFile);
    const nav = parsed.nav;

    return [contents, nav];
  }, [kind, namespace, name, techdocsApi]);

  return (
    <Page themeId="documentation">
      <Header title="... some title ..." subtitle="... some description ...">
        <HeaderLabel label="Component" value={name} />
      </Header>
      <Content>
        {markdown && <MDX># hello {markdown}</MDX>}
        {navigation && (
          <ToC
            toc={navigation}
            baseUrl={`/techdocs-next/${generatePath(rootDocsRouteRef.path, {
              namespace,
              kind,
              name,
            })}/`}
          />
        )}
      </Content>
    </Page>
  );
};
