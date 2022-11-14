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

import React, { createRef } from 'react';

import { renderWithEffects } from '@backstage/test-utils';

import { AdaptationProvider } from './AdaptationProvider';
import { adaptComponent } from './adaptations';
import {
  createAdaptableComponent,
  createAdaptableComponentRef,
  createAdaptableForwardableComponent,
  createAdaptableForwardableComponentRef,
  implementAdaptableComponent,
} from './create';
import {
  AdaptableComponentExtraProps,
  AdaptableComponentProps,
  AdaptableComponentRef,
  ComponentAdaptation,
} from './types';

interface TestProps {
  foo?: string;
  bar?: number;
  children?: React.ReactNode | undefined;
  safe?: string;
}
type AdaptableTestProps = 'foo' | 'bar' | 'children';

function makeTestAdaptation(
  componentRef: AdaptableComponentRef<TestProps, AdaptableTestProps, {}>,
) {
  return adaptComponent(componentRef, {
    id: 'adaptation',
    Adaptation({ props, Component }) {
      return <Component set={{ foo: `${props.foo ?? ''}adapted` }} />;
    },
  });
}

function makeInterceptPropsAdaptation(
  componentRef: AdaptableComponentRef<TestProps, AdaptableTestProps, {}>,
) {
  return adaptComponent(componentRef, {
    id: 'adaptation',
    interceptProps: props => ({
      foo: `${props.foo ?? ''}intercepted`,
    }),
  });
}

async function renderAdaptableComponent(
  Component: React.ComponentType<TestProps>,
  adaptations: ComponentAdaptation<TestProps, AdaptableTestProps>[],
  props: TestProps,
) {
  const tree = (
    <AdaptationProvider adaptations={adaptations}>
      <Component {...props}>inside</Component>
    </AdaptationProvider>
  );

  const { getByTestId } = await renderWithEffects(tree);
  return JSON.parse(getByTestId('test-elem').innerHTML);
}

async function renderAdaptableClassComponent(
  Component: React.ComponentClass<TestProps>,
  adaptations: ComponentAdaptation<TestProps, AdaptableTestProps>[],
  props: TestProps,
) {
  const ref = createRef<InnerTestClassComponent>();

  const tree = (
    <AdaptationProvider adaptations={adaptations}>
      <Component ref={ref as React.RefObject<any>} {...props}>
        inside
      </Component>
    </AdaptationProvider>
  );

  const { getByTestId } = await renderWithEffects(tree);
  return {
    data: JSON.parse(getByTestId('test-elem').innerHTML),
    ref,
  };
}

function InnerTestComponent({
  props,
}: AdaptableComponentProps<TestProps> & AdaptableComponentExtraProps<{}>) {
  const textual = JSON.stringify({
    foo: props.foo,
    bar: props.bar,
    children: props.children,
    safe: props.safe,
  });

  return (
    <div id="inner" data-testid="test-elem">
      {textual}
    </div>
  );
}

class InnerTestClassComponent extends React.Component<
  AdaptableComponentProps<TestProps> & AdaptableComponentExtraProps<{}>
> {
  public testHandle = 'handle';

  render() {
    // Piggyback on the functional component implementation
    // eslint-disable-next-line new-cap
    return InnerTestComponent(this.props);
  }
}

describe('create adaptable components', () => {
  it('should handle no Prepare component', async () => {
    const adaptable = createAdaptableComponent<TestProps, AdaptableTestProps>({
      id: 'comp',
      Component: InnerTestComponent,
    });

    const data = await renderAdaptableComponent(
      adaptable.Component,
      [makeTestAdaptation(adaptable.componentRef)],
      {
        foo: 'foo',
        bar: 42,
      },
    );

    expect(data).toStrictEqual({
      foo: 'fooadapted',
      bar: 42,
      children: 'inside',
    });
  });

  it('should handle and render Prepare component', async () => {
    const adaptable = createAdaptableComponent<TestProps, AdaptableTestProps>({
      id: 'comp',
      Prepare({ Component }) {
        return <Component set={{ bar: 42 }} />;
      },
      Component: InnerTestComponent,
    });

    const data = await renderAdaptableComponent(
      adaptable.Component,
      [makeTestAdaptation(adaptable.componentRef)],
      {
        foo: 'foo',
        // Not specifying bar will default to what's set in <Prepare>
        // bar: 17,
      },
    );

    expect(data).toStrictEqual({
      foo: 'fooadapted',
      bar: 42,
      children: 'inside',
    });
  });

  it('should handle and render Prepare component, and override props', async () => {
    const adaptable = createAdaptableComponent<TestProps, AdaptableTestProps>({
      id: 'comp',
      Prepare({ Component }) {
        return <Component set={{ bar: 42 }} unset="foo" />;
      },
      Component: InnerTestComponent,
    });

    const data = await renderAdaptableComponent(
      adaptable.Component,
      [makeTestAdaptation(adaptable.componentRef)],
      {
        bar: 17, // Will be overwritten by <Prepare> to 42
        foo: 'foo', // Will be unset by <Prepare>
        safe: 'stuff',
      },
    );

    expect(data).toStrictEqual({
      foo: 'adapted',
      bar: 42,
      children: 'inside',
      safe: 'stuff',
    });
  });

  it('createAdaptableComponentRef (and implement separately)', async () => {
    const componentRef = createAdaptableComponentRef({ id: 'comp' });
    const Component = implementAdaptableComponent(componentRef, {
      Component: InnerTestComponent,
    });

    const data = await renderAdaptableComponent(
      Component,
      [makeTestAdaptation(componentRef)],
      {
        foo: 'foo',
        bar: 42,
        safe: 'stuff',
      },
    );

    expect(data).toStrictEqual({
      foo: 'fooadapted',
      bar: 42,
      children: 'inside',
      safe: 'stuff',
    });
  });

  it('intercept props', async () => {
    const adaptable = createAdaptableComponent<TestProps, AdaptableTestProps>({
      id: 'comp',
      Component: InnerTestComponent,
    });

    const data = await renderAdaptableComponent(
      adaptable.Component,
      [makeInterceptPropsAdaptation(adaptable.componentRef)],
      {
        foo: 'foo',
        bar: 42,
      },
    );

    expect(data).toStrictEqual({
      foo: 'foointercepted',
      bar: 42,
      children: 'inside',
    });
  });

  it('both intercept props and component-based adaptation', async () => {
    const adaptable = createAdaptableComponent<TestProps, AdaptableTestProps>({
      id: 'comp',
      Component: InnerTestComponent,
    });

    const data = await renderAdaptableComponent(
      adaptable.Component,
      [
        makeTestAdaptation(adaptable.componentRef),
        makeInterceptPropsAdaptation(adaptable.componentRef),
      ],
      {
        foo: 'foo',
        bar: 42,
      },
    );

    expect(data).toStrictEqual({
      // intercepted goes first, then component-based adatations
      foo: 'foointerceptedadapted',
      bar: 42,
      children: 'inside',
    });
  });

  it('createAdaptableForwardableComponent', async () => {
    const adaptable = createAdaptableForwardableComponent<
      TestProps,
      AdaptableTestProps
    >({
      id: 'comp',
      Component: InnerTestClassComponent,
    });

    const { data, ref } = await renderAdaptableClassComponent(
      adaptable.Component,
      [makeTestAdaptation(adaptable.componentRef)],
      {
        foo: 'foo',
        bar: 42,
      },
    );

    expect(ref.current?.testHandle).toBe('handle');
    expect(data).toStrictEqual({
      foo: 'fooadapted',
      bar: 42,
      children: 'inside',
    });
  });

  it('createAdaptableForwardableComponentRef (and implement separately)', async () => {
    const componentRef = createAdaptableForwardableComponentRef({ id: 'comp' });
    const Component = implementAdaptableComponent(componentRef, {
      Component: InnerTestClassComponent,
    });

    const { data, ref } = await renderAdaptableClassComponent(
      Component,
      [makeTestAdaptation(componentRef)],
      {
        foo: 'foo',
        bar: 42,
        safe: 'stuff',
      },
    );

    expect(ref.current?.testHandle).toBe('handle');
    expect(data).toStrictEqual({
      foo: 'fooadapted',
      bar: 42,
      children: 'inside',
      safe: 'stuff',
    });
  });
});
