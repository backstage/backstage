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
import { createComponentRef } from '../components';
import { ComponentImplementationBlueprint } from './ComponentImplementationBlueprint';

describe('ComponentImplementationBlueprint', () => {
  it('should allow defining a component override for sync component ref', () => {
    const componentRef = createComponentRef({
      id: 'test.component',
      loader: () => (props: { hello: string }) => <div>{props.hello}</div>,
    });

    const extension = ComponentImplementationBlueprint.make({
      params: define =>
        define({
          ref: componentRef,
          loader: () => props => {
            // @ts-expect-error
            const t: number = props.hello;

            return <div>Override {props.hello}</div>;
          },
        }),
    });

    expect(extension).toBeDefined();
  });
});
