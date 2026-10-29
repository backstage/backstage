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

import { createElement } from 'react';
import { extensionFragmentsApiRef } from '@backstage/frontend-plugin-api/alpha';
import { mockApis } from './alpha';
import { mockApis as stableMockApis } from './apis/mockApis';
import { getMockApiFactory } from './apis/MockWithApiFactory';

it('provides an empty-by-default fragment registry with named and unnamed elements', () => {
  const empty = mockApis.extensionFragments();
  expect(empty.getFragment('fragment:deployments')).toBeUndefined();

  const summary = createElement('div', {}, 'Summary');
  const owner = createElement('div', {}, 'Owner');
  const fragments = mockApis.extensionFragments({
    fragments: { 'deployments/summary': summary, ownership: owner },
  });
  expect(fragments.getFragment('fragment:deployments/summary')).toBe(summary);
  expect(fragments.getFragment('fragment:ownership')).toBe(owner);
  expect(fragments.getFragment('fragment:missing')).toBeUndefined();
  expect(empty.getFragment('fragment:ownership')).toBeUndefined();
  const factory = getMockApiFactory(fragments)!;
  expect(factory.api).toBe(extensionFragmentsApiRef);
  expect(factory.factory({})).toBe(fragments);
  expect(stableMockApis).not.toHaveProperty('extensionFragments');
});

it('provides registered jest mocks with optional method implementations', () => {
  const empty = mockApis.extensionFragments.mock();
  expect(empty.getFragment('fragment:missing')).toBeUndefined();
  expect(empty.getFragment.getMockImplementation()).toBeUndefined();
  expect(empty.getFragment).toHaveBeenCalledWith('fragment:missing');

  const element = createElement('div', {}, 'Summary');
  const fragments = mockApis.extensionFragments.mock({
    getFragment: () => element,
  });
  expect(fragments.getFragment('fragment:deployments/summary')).toBe(element);
  expect(fragments.getFragment).toHaveBeenCalledWith(
    'fragment:deployments/summary',
  );
  expect(getMockApiFactory(fragments)?.api).toBe(extensionFragmentsApiRef);
});
