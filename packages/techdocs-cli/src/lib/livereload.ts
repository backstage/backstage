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

import http from 'node:http';
import httpProxy from 'http-proxy';

/**
 * Livereload support for techdocs-cli.
 *
 * Context:
 * - MkDocs implements autoreload using a long-poll endpoint `/livereload` and a script that injects
 *   a call like: `livereload(epoch, request_id)`, where `epoch` is derived from Python's
 *   `time.monotonic()`.
 * - Node.js monotonic clocks (`process.hrtime`/`performance.now`) are not compatible with Python's
 *   value across processes and platforms. We therefore CANNOT reliably re-create the same epoch on
 *   the frontend or in this CLI, and must read the values produced by MkDocs itself.
 * - The MkDocs script tag is removed by DOM sanitization (DomPurify) in TechDocs, so we can't rely
 *   on the script being present in the embedded app. To bridge this, we extract the parameters on
 *   the server side while proxying HTML and inject them as a safe custom element that survives
 *   sanitization: `<live-reload live-reload-epoch="…" live-reload-request-id="…"/>`.
 * - The frontend addon reads that element and polls `/.livereload` (served by techdocs-cli), which
 *   this module maps to MkDocs `/livereload` with permissive CORS headers.
 * - Quality-of-life: if extraction fails or the endpoint is unavailable, normal docs still work.
 *
 * See issue for background and rationale: https://github.com/backstage/backstage/issues/30514
 */

const LIVE_RELOAD_ELEMENT = 'live-reload';
const LIVE_RELOAD_ATTR_EPOCH = 'live-reload-epoch';
const LIVE_RELOAD_ATTR_REQUEST_ID = 'live-reload-request-id';
const CLI_LIVERELOAD_PATH = '/.livereload';
const MKDOCS_LIVERELOAD_PATH = '/livereload';
const CONTENT_TYPE_HTML = 'text/html';
const HEADER_CONTENT_LENGTH = 'content-length';

const BODY_START_RE = /<body\b[^>]*>/;
// Matches mkdocs injected call livereload(epoch, requestId)
const MKDOCS_LIVERELOAD_CALL_RE = /livereload\(\s*(\d+)\s*,\s*(\d+)\s*\)\s*;?/;

/**
 * Extract livereload parameters from mkdocs HTML and inject them as a custom element.
 * The injected element will later be read by the frontend addon even after DOM sanitization.
 *
 * Note:
 * - we don't add to <head> because of DomPurify sanitization.
 * - we add close to the body opening to avoid reading too far into the body.
 * - we should use streamed injection to improve performance.
 */
export function injectLivereloadParameters(html: string): string {
  const livereloadMatch = html.match(MKDOCS_LIVERELOAD_CALL_RE);

  // If we couldn't find livereload parameters, return original HTML untouched.
  if (!livereloadMatch) {
    return html;
  }

  const [, epoch, requestId] = livereloadMatch;
  // Insert a minimal custom element that the frontend addon can discover post-sanitization.
  // Note: embedded app needs a custom config to allow the element to survive sanitization.
  const liveReloadTag = `<${LIVE_RELOAD_ELEMENT} ${LIVE_RELOAD_ATTR_EPOCH}="${epoch}" ${LIVE_RELOAD_ATTR_REQUEST_ID}="${requestId}"></${LIVE_RELOAD_ELEMENT}>`;

  // Naively find where to insert the livereload tag.
  const bodyStart = html.match(BODY_START_RE);
  const bodyStartIndex = bodyStart?.index ?? 0;
  const bodyStartLength = bodyStart?.[0]?.length ?? 0;
  if (bodyStartIndex === 0 || bodyStartLength === 0) {
    return html;
  }
  const bodyEndIndex = bodyStartIndex + bodyStartLength;

  return html.slice(0, bodyEndIndex) + liveReloadTag + html.slice(bodyEndIndex);
}

function setCorsHeaders(response: http.ServerResponse) {
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
}

/**
 * Proxies a mkdocs HTML response, injecting livereload parameters into the HTML body.
 */
export function proxyHtmlWithLivereloadInjection(options: {
  request: http.IncomingMessage;
  response: http.ServerResponse;
  mkdocsTargetAddress: string;
  proxyEndpoint: string;
  onError: (error: Error) => void;
}): void {
  const { request, response, mkdocsTargetAddress, proxyEndpoint, onError } =
    options;

  const htmlProxy = httpProxy.createProxyServer({
    target: mkdocsTargetAddress,
    selfHandleResponse: true,
  });

  htmlProxy.on('error', onError);

  // Intercept HTML responses to inject `<live-reload …>`
  htmlProxy.on('proxyRes', (proxyRes, _req, res) => {
    const contentType = proxyRes.headers['content-type'];
    const contentEncoding = proxyRes.headers['content-encoding'];
    const isHtml =
      contentType &&
      typeof contentType === 'string' &&
      contentType.startsWith(CONTENT_TYPE_HTML);
    if (isHtml && !contentEncoding) {
      const chunks: Buffer[] = [];
      proxyRes.on('data', (chunk: Buffer | string) => {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
      });
      proxyRes.on('end', () => {
        const body = Buffer.concat(chunks).toString('utf8');
        const modifiedHtml = injectLivereloadParameters(body);
        res.statusCode = (proxyRes.statusCode as number | undefined) ?? 200;
        Object.keys(proxyRes.headers).forEach(key => {
          if (key.toLowerCase() !== HEADER_CONTENT_LENGTH) {
            res.setHeader(key, proxyRes.headers[key]!);
          }
        });
        setCorsHeaders(res);
        res.end(modifiedHtml);
      });
    } else {
      res.statusCode = (proxyRes.statusCode as number | undefined) ?? 200;
      Object.keys(proxyRes.headers).forEach(key => {
        res.setHeader(key, proxyRes.headers[key]!);
      });
      setCorsHeaders(res);
      proxyRes.pipe(res);
    }
  });

  const forwardPath =
    (
      request.url?.replace(new RegExp(`^${proxyEndpoint}`, 'i'), '') || ''
    ).replace(/^static\/docs\/default\/component\/local\//, '/') || '/';
  request.url = forwardPath;
  htmlProxy.web(request, response);
}

/**
 * Proxies mkdocs livereload long-polling requests, mapping the CLI path to mkdocs path.
 */
export function proxyMkdocsLivereload(options: {
  request: http.IncomingMessage;
  response: http.ServerResponse;
  mkdocsTargetAddress: string;
  onError: (error: Error) => void;
}): void {
  const { request, response, mkdocsTargetAddress, onError } = options;

  const proxy = httpProxy.createProxyServer({ target: mkdocsTargetAddress });
  proxy.on('error', onError);

  setCorsHeaders(response);
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  request.url = request.url?.replace(
    CLI_LIVERELOAD_PATH,
    MKDOCS_LIVERELOAD_PATH,
  );
  proxy.web(request, response);
}
