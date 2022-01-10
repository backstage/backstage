/*
 * Copyright 2020 The Backstage Authors
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

import { ConfigReader } from '@backstage/config';
import { createTestShadowDom, FIXTURES } from '../../test-utils';
import { Transformer } from './index';
import { sanitizeDOM } from './sanitizeDOM';

const injectMaliciousLink = (): Transformer => dom => {
  const link = document.createElement('a');
  link.setAttribute('id', 'test-malicious-link');
  link.setAttribute('onclick', 'alert("Hello world");');
  dom.querySelector('body')?.appendChild(link);
  return dom;
};

describe('sanitizeDOM', () => {
  it('contains a script tag', async () => {
    const shadowDom = await createTestShadowDom(FIXTURES.FIXTURE_STANDARD_PAGE);

    expect(shadowDom.querySelectorAll('script').length).toBeGreaterThan(0);
  });

  it('does not contain a script tag', async () => {
    const shadowDom = await createTestShadowDom(
      FIXTURES.FIXTURE_STANDARD_PAGE,
      {
        preTransformers: [sanitizeDOM()],
        postTransformers: [],
      },
    );

    expect(shadowDom.querySelectorAll('script').length).toBe(0);
  });

  it('contains link with a onClick attribute', async () => {
    const shadowDom = await createTestShadowDom(
      FIXTURES.FIXTURE_STANDARD_PAGE,
      {
        preTransformers: [injectMaliciousLink()],
        postTransformers: [],
      },
    );

    expect(
      shadowDom.querySelector('#test-malicious-link')?.hasAttribute('onclick'),
    ).toBeTruthy();
  });

  it('does not contain link with a onClick attribute', async () => {
    const shadowDom = await createTestShadowDom(
      FIXTURES.FIXTURE_STANDARD_PAGE,
      {
        preTransformers: [sanitizeDOM()],
        postTransformers: [],
      },
    );

    expect(
      shadowDom.querySelector('#test-malicious-link')?.hasAttribute('onclick'),
    ).toBeFalsy();
  });

  it('removes style tags', async () => {
    const html = `
      <html>
        <head>
          <style>* {color: #f0f;}</style>
        </head>
        <body>
        </body>
      </html>
    `;

    const shadowDom = await createTestShadowDom(html, {
      preTransformers: [sanitizeDOM()],
      postTransformers: [],
    });

    expect(shadowDom.querySelectorAll('style').length).toEqual(0);
  });

  it('does not remove link tags', async () => {
    const html = `
      <html>
        <head>
          <link rel="stylesheet" href="style.css">
        </head>
        <body>
        </body>
      </html>
    `;

    const shadowDom = await createTestShadowDom(html, {
      preTransformers: [sanitizeDOM()],
      postTransformers: [],
    });

    expect(shadowDom.querySelectorAll('link').length).toEqual(1);
  });

  it('render iframe where src host is in allowedIframeHosts', async () => {
    const html = `
      <html>
        <head>
          <link rel="stylesheet" href="style.css">
        </head>
        <body>
          <iframe src="https://example.com?test=1"></iframe>
          <iframe src="https://forbidden.com?test=1"></iframe>
        </body>
      </html>
    `;
    const config = new ConfigReader({
      allowedIframeHosts: ['example.com'],
    });
    const shadowDom = await createTestShadowDom(html, {
      preTransformers: [sanitizeDOM(config)],
      postTransformers: [],
    });
    expect(shadowDom.querySelectorAll('link').length).toEqual(1);
    expect(shadowDom.querySelectorAll('iframe').length).toEqual(1);
    expect(shadowDom.querySelectorAll('iframe')[0].getAttribute('src')).toBe(
      'https://example.com?test=1',
    );
  });

  it('should remove all iframes without allowedIframeHosts', async () => {
    const html = `
      <html>
        <head>
          <link rel="stylesheet" href="style.css">
        </head>
        <body>
          <iframe src="https://example.com?test=1"></iframe>
          <iframe src="https://forbidden.com?test=1"></iframe>
        </body>
      </html>
    `;
    const config = new ConfigReader({});
    const shadowDom = await createTestShadowDom(html, {
      preTransformers: [sanitizeDOM(config)],
      postTransformers: [],
    });
    expect(shadowDom.querySelectorAll('link').length).toEqual(1);
    expect(shadowDom.querySelectorAll('iframe').length).toEqual(0);
  });

  it('should remove iframe with invalid url in src', async () => {
    const html = `
      <html>
        <head>
          <link rel="stylesheet" href="style.css">
        </head>
        <body>
          <iframe src="invalid.md"></iframe>
        </body>
      </html>
    `;
    const config = new ConfigReader({
      allowedIframeHosts: ['example.com'],
    });
    const shadowDom = await createTestShadowDom(html, {
      preTransformers: [sanitizeDOM(config)],
      postTransformers: [],
    });
    expect(shadowDom.querySelectorAll('link').length).toEqual(1);
    expect(shadowDom.querySelectorAll('iframe').length).toEqual(0);
  });

  test.each([
    { key: 'allow', value: '"camera \'none\'"', allowed: false },
    { key: 'allowfullscreen', value: true, allowed: false },
    { key: 'allowpaymentrequest', value: true, allowed: false },
    { key: 'height', value: true, allowed: true },
    { key: 'loading', value: "'lazy'", allowed: true },
    { key: 'name', value: "'example'", allowed: true },
    { key: 'referrerpolicy', value: "'no-referrer'", allowed: false },
    { key: 'sandbox', value: "'allow-forms'", allowed: false },
    { key: 'srcdoc', value: "'<p>Hello world!</p>'", allowed: false },
    { key: 'onload', value: "'alert(1)'", allowed: false },
  ])('check if the iframe has the attribute %p', async attr => {
    const html = `
      <html>
        <head>
          <link rel="stylesheet" href="style.css">
        </head>
        <body>
          <iframe src="https://example.com?test=1" ${attr.key}=${attr.value}></iframe>
        </body>
      </html>
    `;
    const config = new ConfigReader({
      allowedIframeHosts: ['example.com'],
    });
    const shadowDom = await createTestShadowDom(html, {
      preTransformers: [sanitizeDOM(config)],
      postTransformers: [],
    });
    expect(shadowDom.querySelectorAll('link').length).toEqual(1);
    expect(shadowDom.querySelectorAll('iframe').length).toEqual(1);
    expect(shadowDom.querySelectorAll('iframe')[0].hasAttribute(attr.key)).toBe(
      attr.allowed,
    );
  });

  describe('safe head links', () => {
    let shadowDom: ShadowRoot;

    beforeEach(async () => {
      shadowDom = await createTestShadowDom(FIXTURES.FIXTURE_STANDARD_PAGE, {
        preTransformers: [sanitizeDOM()],
        postTransformers: [],
      });
    });

    it('should not sanitize the techdocs css', async () => {
      const techdocsCss = shadowDom.querySelector(
        'link[href$="main.fe0cca5b.min.css"]',
      );
      const rel = techdocsCss!.getAttribute('rel');
      expect(rel).toBe('stylesheet');
    });

    it('should not sanitize google fonts', async () => {
      const googleFonts = shadowDom.querySelector(
        'link[href^="https://fonts.googleapis.com"]',
      );
      const rel = googleFonts!.getAttribute('rel');
      expect(rel).toBe('stylesheet');
    });

    it('should not sanitize gstatic fonts', async () => {
      const gstaticFonts = shadowDom.querySelector(
        'link[href^="https://fonts.gstatic.com"]',
      );
      const rel = gstaticFonts!.getAttribute('rel');
      expect(rel).toBe('preconnect');
    });
  });
});
