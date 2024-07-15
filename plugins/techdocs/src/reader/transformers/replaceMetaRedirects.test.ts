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
import { createTestShadowDom } from '../../test-utils';
import { replaceMetaRedirects } from './replaceMetaRedirects';

describe('replaceMetaRedirects', () => {
  it('should not do anything', async () => {
    const shadowDom = await createTestShadowDom(
      `<meta http-equiv="refresh" content="0; url=https://example.com">`,
    );
    expect(shadowDom.querySelector('meta')).toBeTruthy();
  });

  it('replaces meta redirects', async () => {
    const shadowDom = await createTestShadowDom(
      `<meta http-equiv="refresh" content="0; url=../sub-page/">`,
      { preTransformers: [replaceMetaRedirects()], postTransformers: [] },
    );

    expect(shadowDom.querySelector('meta')).toBeFalsy();
    const redirectLink = shadowDom.querySelector('a');
    expect(redirectLink).toBeTruthy();
    expect(redirectLink?.textContent).toBe('techdocs_redirect');
    expect(redirectLink?.getAttribute('href')).toBe('../sub-page/');
  });

  it('does not replace informational meta tags', async () => {
    const shadowDom = await createTestShadowDom(
      `<meta name="keywords" content="TechDocs, Example">`,
      { preTransformers: [replaceMetaRedirects()], postTransformers: [] },
    );

    expect(shadowDom.querySelector('meta')).toBeTruthy();
  });
});
