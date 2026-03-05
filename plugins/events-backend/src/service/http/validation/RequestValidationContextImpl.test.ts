/*
 * Copyright 2022 The Backstage Authors
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

import { RequestValidationContextImpl } from './RequestValidationContextImpl';

describe('RequestValidationContextImpl', () => {
  it('not rejected', () => {
    const context = new RequestValidationContextImpl();

    expect(context.wasRejected()).toBe(false);
    expect(context.rejectionDetails).toBeUndefined();
  });

  it('reject without details', () => {
    const context = new RequestValidationContextImpl();

    context.reject();

    expect(context.wasRejected()).toBe(true);
    expect(context.rejectionDetails).not.toBeUndefined();
    expect(context.rejectionDetails!.status).toBe(403);
    expect(context.rejectionDetails!.payload).toEqual({});
  });

  it('reject with partial details', () => {
    const context = new RequestValidationContextImpl();

    context.reject({ status: 404 });

    expect(context.wasRejected()).toBe(true);
    expect(context.rejectionDetails).not.toBeUndefined();
    expect(context.rejectionDetails!.status).toBe(404);
    expect(context.rejectionDetails!.payload).toEqual({});
  });

  it('reject with details', () => {
    const context = new RequestValidationContextImpl();

    context.reject({
      status: 403,
      payload: { message: 'invalid signature' },
    });

    expect(context.wasRejected()).toBe(true);
    expect(context.rejectionDetails).not.toBeUndefined();
    expect(context.rejectionDetails!.status).toBe(403);
    expect(context.rejectionDetails!.payload).toEqual({
      message: 'invalid signature',
    });
  });
});
