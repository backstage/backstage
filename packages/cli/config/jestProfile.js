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
const fs = require('fs-extra');
const v8Profiler = require('v8-profiler-next');

v8Profiler.setGenerateType(1);

beforeEach(() => {
  const title = expect.getState().currentTestName;
  v8Profiler.startProfiling(title, true);
  v8Profiler.startSamplingHeapProfiling();
  fs.mkdirSync('./profiles', { recursive: true });
});

afterEach(() => {
  const title = expect.getState().currentTestName;
  const profile = v8Profiler.stopProfiling(title);
  const heapProfile = v8Profiler.stopSamplingHeapProfiling();
  heapProfile.export((error, result) => {
    const fileName = `${title
      .replaceAll(' ', '-')
      .replaceAll('"', '')}.heapprofile`;
    console.log(`writing heap profile to ${fileName}`);
    fs.writeFileSync(`./profiles/${fileName}`, result);
  });
  profile.export((error, result) => {
    const fileName = `${title
      .replaceAll(' ', '-')
      .replaceAll('"', '')}.cpuprofile`;
    console.log(`writing CPU profile to ${fileName}`);
    fs.writeFileSync(`./profiles/${fileName}`, result);
    profile.delete();
  });
});
