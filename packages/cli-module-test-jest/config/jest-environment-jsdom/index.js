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

const JSDOMEnvironment = require('@jest/environment-jsdom-abstract').default;
const jsdom = require('jsdom');

/**
 * A custom JSDOM environment that extends the abstract base and applies
 * fixes for Web API globals that are missing or incorrectly implemented
 * in JSDOM.
 *
 * Based on https://github.com/mswjs/jest-fixed-jsdom
 */
class FixedJSDOMEnvironment extends JSDOMEnvironment {
  constructor(config, context) {
    super(config, context, jsdom);

    // Fix Web API globals that JSDOM doesn't properly expose
    this.global.TextDecoder = TextDecoder;
    this.global.TextEncoder = TextEncoder;
    this.global.TextDecoderStream = TextDecoderStream;
    this.global.TextEncoderStream = TextEncoderStream;
    this.global.ReadableStream = ReadableStream;

    this.global.Blob = Blob;
    this.global.Headers = Headers;
    this.global.FormData = FormData;
    this.global.Request = Request;
    this.global.Response = Response;
    this.global.fetch = fetch;
    this.global.AbortController = AbortController;
    this.global.AbortSignal = AbortSignal;
    this.global.structuredClone = structuredClone;
    this.global.URL = URL;
    this.global.URLSearchParams = URLSearchParams;

    this.global.BroadcastChannel = BroadcastChannel;
    this.global.TransformStream = TransformStream;
    this.global.WritableStream = WritableStream;

    // Needed to ensure `e instanceof Error` works as expected with errors thrown from
    // any of the native APIs above. Without this, the JSDOM `Error` is what the test
    // code will use for comparison with `e`, which fails the instanceof check.
    this.global.Error = Error;
  }
}

module.exports = FixedJSDOMEnvironment;
