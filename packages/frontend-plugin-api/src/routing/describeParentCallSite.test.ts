/*
 * Copyright 2023 The Backstage Authors
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

import { describeParentCallSite } from './describeParentCallSite';

class ChromeError {
  name = 'Error';
  message = 'eHgtF5hmbrXyiEvo';
  get stack() {
    return `Error: eHgtF5hmbrXyiEvo
    at describeParentCallSite (describeParentCallSite.js:1:11)
    at parent (parent.js:2:22)
    at caller (parent-caller.js:3:33)
    at other.js:3:33`;
  }
}

class SafariError {
  name = 'Error';
  message = 'eHgtF5hmbrXyiEvo';
  get stack() {
    return `describeParentCallSite@describeParentCallSite.js:1:11
parent@parent.js:2:22
caller@parent-caller.js:3:33
code@other.js:3:33`;
  }
}

class FirefoxError {
  name = 'Error';
  message = 'eHgtF5hmbrXyiEvo';
  get stack() {
    return `describeParentCallSite@describeParentCallSite.js:1:11
parent@parent.js:2:22
caller@parent-caller.js:3:33
@other.js:3:33
`;
  }
}

describe('describeParentCallSite', () => {
  it('should work in Chrome', () => {
    function myFactory() {
      return describeParentCallSite(ChromeError);
    }
    function myCaller() {
      return myFactory();
    }
    expect(myCaller()).toBe('parent-caller.js:3:33');
  });

  it('should work in Safari', () => {
    function myFactory() {
      return describeParentCallSite(SafariError);
    }
    function myCaller() {
      return myFactory();
    }
    expect(myCaller()).toBe('parent-caller.js:3:33');
  });

  it('should work in Firefox', () => {
    function myFactory() {
      return describeParentCallSite(FirefoxError);
    }
    function myCaller() {
      return myFactory();
    }
    expect(myCaller()).toBe('parent-caller.js:3:33');
  });
});
