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

import { Models } from './models';
import { WithPagination } from './pagination';

interface TestResultItem {
  url: string;
}

interface TestPage extends Models.Paginated<TestResultItem> {}

describe('WithPagination', () => {
  const createPagination = () =>
    new WithPagination<TestPage, TestResultItem>(
      opts =>
        new URL(
          `http://localhost/create-url?page=${opts.page}&pagelen=${opts.pagelen}`,
        ),
      async url => {
        const currentPage = Number.parseInt(url.searchParams.get('page')!, 10);
        const next = new URL(url.toString());
        next.searchParams.set('page', (currentPage + 1).toString());

        return {
          page: currentPage,
          ...(currentPage >= 2 ? {} : { next: next.toString() }),
          values: [
            {
              url: url.toString(),
            },
          ],
        };
      },
    );

  it('iterateResults', async () => {
    const pagination = createPagination();

    const urls = [];
    for await (const result of pagination.iterateResults()) {
      urls.push(result.url.toString());
    }

    expect(urls).toHaveLength(2);
    expect(urls).toEqual([
      'http://localhost/create-url?page=1&pagelen=100',
      'http://localhost/create-url?page=2&pagelen=100',
    ]);
  });

  it('iteratePages', async () => {
    const pagination = createPagination();

    const pages = [];
    for await (const page of pagination.iteratePages()) {
      pages.push(page);
    }

    expect(pages).toHaveLength(2);
    expect(pages).toEqual([
      {
        next: 'http://localhost/create-url?page=2&pagelen=100',
        page: 1,
        values: [
          {
            url: 'http://localhost/create-url?page=1&pagelen=100',
          },
        ],
      },
      {
        page: 2,
        values: [
          {
            url: 'http://localhost/create-url?page=2&pagelen=100',
          },
        ],
      },
    ]);
  });

  describe('getPage', () => {
    it('default opts', async () => {
      const pagination = createPagination();

      const page = await pagination.getPage();

      expect(page.page).toEqual(1);
      expect(page.next).toEqual(
        'http://localhost/create-url?page=2&pagelen=100',
      );
      expect(page.values).toHaveLength(1);
      expect((page.values! as TestResultItem[])[0].url).toEqual(
        'http://localhost/create-url?page=1&pagelen=100',
      );
    });

    it('custom opts', async () => {
      const pagination = createPagination();

      const page = await pagination.getPage({ page: 4 });

      expect(page.page).toEqual(4);
      expect(page.next).toBeUndefined();
      expect(page.values).toHaveLength(1);
      expect((page.values! as TestResultItem[])[0].url).toEqual(
        'http://localhost/create-url?page=4&pagelen=100',
      );
    });
  });
});
