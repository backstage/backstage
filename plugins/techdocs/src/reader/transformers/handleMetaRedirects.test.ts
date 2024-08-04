/*
 * Copyright 2024 The Backstage Authors
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

import { handleMetaRedirects } from './handleMetaRedirects';
import { createTestShadowDom } from '../../test-utils';

describe('handleMetaRedirects', () => {
  const navigate = jest.fn();

  const setUpNewTestShadowDom = async (
    html: string,
    rootHref: string,
    rootPath: string,
  ) => {
    const entityName = 'testEntity';
    // Mock window.location.href for each test
    Object.defineProperty(window, 'location', {
      value: {
        href: rootHref,
        pathname: rootPath,
        hostname: 'localhost',
      },
      writable: true,
    });

    return await createTestShadowDom(html, {
      preTransformers: [],
      postTransformers: [handleMetaRedirects(navigate, entityName)],
    });
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should navigate to relative URL if meta redirect tag is present', async () => {
    await setUpNewTestShadowDom(
      `<meta http-equiv="refresh" content="0; url=../anotherPage">`,
      'http://localhost/docs/default/component/testEntity/subpath',
      '/docs/default/component/testEntity/subpath',
    );
    expect(navigate).toHaveBeenCalledWith(
      'http://localhost/docs/default/component/testEntity/anotherPage',
    );
  });

  it('should navigate to site home if meta redirect tag is present and external', async () => {
    await setUpNewTestShadowDom(
      `<meta http-equiv="refresh" content="0; url=http://external.com/test">`,
      'http://localhost/docs/default/component/testEntity/subpath',
      '/docs/default/component/testEntity/subpath',
    );
    expect(navigate).toHaveBeenCalledWith('/docs/default/component/testEntity');
  });

  it('should navigate to absolute URL if meta redirect tag is present and not external', async () => {
    await setUpNewTestShadowDom(
      `<meta http-equiv="refresh" content="0; url=http://localhost/test">`,
      'http://localhost/docs/default/component/testEntity/subpath',
      '/docs/default/component/testEntity/subpath',
    );
    expect(navigate).toHaveBeenCalledWith('http://localhost/test');
  });

  it('should not navigate if meta redirect tag is not present', async () => {
    await setUpNewTestShadowDom(
      `<meta name="keywords" content="TechDocs, Example">`,
      'http://localhost/docs/default/component/testEntity/subpath',
      '/docs/default/component/testEntity/subpath',
    );
    expect(navigate).not.toHaveBeenCalled();
  });
});
