/*
 * Copyright 2020 Spotify AB
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

/**
 * For any type T, generate a new type that is identical but also has the
 * jest.fn signature on all member functions.
 *
 * When writing tests against a type, you sometimes end up in a situation where
 * you need to write expect(x.y as jest.Mock).toHaveBeenCalled... because the
 * x.y member was considered to be the actual function type. You could also
 * change your test to instead create a "raw" object { y: jest.fn() } but then
 * you lose type safety when doing x.y.mockReturnValue(...). So you start
 * trying to do { y: jest.fn() as X['y'] } as X or similar trickery.
 *
 * This type lets you say const x: MockedMemberFunctions<X> = { y: jest.fn() }
 * and keep all the type safety at every step.
 */
export type MockedMemberFunctions<T> = {
  [K in keyof T]: T[K] extends (...args: infer A) => infer B
    ? T[K] & jest.Mock<B, A>
    : T[K];
};
