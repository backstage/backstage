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

import '@backstage/backend-common';
import { KubernetestClusterFilter } from './KubernetesClusterFilter';

describe('KubernetestClusterFilter', () => {
  it('empty filter is not valid', () => {
    expect(() => new KubernetestClusterFilter('')).toThrow(
      "Invalid filter: ''",
    );
  });

  it('filter with forbidden chars is not valid', () => {
    expect(() => new KubernetestClusterFilter('a?b')).toThrow(
      "Invalid filter: 'a?b'",
    );
  });

  it('simple text filter should match whole name', () => {
    const filter = new KubernetestClusterFilter('foo');
    expect(filter.isMatch('foo')).toBeTruthy();
    expect(filter.isMatch('foo2')).toBeFalsy();
    expect(filter.isMatch('2foo')).toBeFalsy();
    expect(filter.isMatch('2foo2')).toBeFalsy();
  });

  it('filter with special chars should match whole name', () => {
    const filter = new KubernetestClusterFilter('foo - Bar_v3');
    expect(filter.isMatch('foo - Bar_v3')).toBeTruthy();
    expect(filter.isMatch('foo - Bar_v32')).toBeFalsy();
    expect(filter.isMatch('2foo - Bar_v3')).toBeFalsy();
    expect(filter.isMatch('2foo - Bar_v32')).toBeFalsy();
  });

  it('filter should match partial expressions - one star - suffix', async () => {
    const filter = new KubernetestClusterFilter('corpo-*');
    expect(filter.isMatch('corpo-dev')).toBeTruthy();
    expect(filter.isMatch('corpo-Prod')).toBeTruthy();
    expect(filter.isMatch('bi-dev')).toBeFalsy();
    expect(filter.isMatch('bi-Prod')).toBeFalsy();
  });

  it('filter should match partial expressions - one star - prefix', async () => {
    const filter = new KubernetestClusterFilter('*-dev');
    expect(filter.isMatch('corpo-dev')).toBeTruthy();
    expect(filter.isMatch('bi-dev')).toBeTruthy();
    expect(filter.isMatch('corpo-prod')).toBeFalsy();
    expect(filter.isMatch('bi-prod')).toBeFalsy();
  });

  it('filter should match partial expressions - two stars', async () => {
    const filter = new KubernetestClusterFilter('*-dept1-*');
    expect(filter.isMatch('prefix-dept1-suffix')).toBeTruthy();
    expect(filter.isMatch('Prefix-dept1-Suffix')).toBeTruthy();
    expect(filter.isMatch('dept1')).toBeFalsy();
    expect(filter.isMatch('dept1-suffix')).toBeFalsy();
    expect(filter.isMatch('-dept1-suffix')).toBeFalsy();
    expect(filter.isMatch('prefix-dept1')).toBeFalsy();
    expect(filter.isMatch('prefix-dept1-')).toBeFalsy();
  });
});
