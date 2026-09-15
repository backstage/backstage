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
import '@testing-library/jest-dom';
import { configure } from '@testing-library/react';

// Every test in this package renders a whole test app and then waits on page
// content that only arrives through an async `PageBlueprint` loader — a render,
// a microtask flush, and a second render before anything is in the document. On
// an idle machine that is far inside React Testing Library's default 1000 ms
// `waitFor` budget, and under enough concurrent load it is occasionally outside
// it. CI runs the whole monorepo in parallel, so that showed up as a rare red
// build with no other symptom and nothing to reproduce locally.
//
// The wait is lengthened rather than the assertions relaxed: a test that is
// genuinely wrong still fails on exactly the same assertion, it just takes
// longer to say so.
configure({ asyncUtilTimeout: 5_000 });

// Jest's own per-test budget defaults to 5000 ms, which is the same order as the
// wait above, so it is raised past it. Left alone it would kill the test
// mid-wait and report a bare test timeout instead of the assertion that never
// settled — the extra room would be unusable and the failure less legible.
jest.setTimeout(15_000);
