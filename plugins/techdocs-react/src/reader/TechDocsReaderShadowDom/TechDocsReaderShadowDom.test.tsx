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

import React, { useState, useEffect } from 'react';
import { render, waitFor, screen } from '@testing-library/react';
import {
  SHADOW_DOM_STYLE_LOAD_EVENT,
  TechDocsShadowDom,
  TechDocsShadowDomProps,
} from './TechDocsReaderShadowDom';

const createDom = (innerHTML: string) => {
  const newDom = document.createElement('html');
  newDom.innerHTML = innerHTML;
  return newDom;
};

describe('TechDocsShadowDom', () => {
  it('Should render children', () => {
    const dom = createDom('<body><h1>Title</h1></body>');
    const onAppend = jest.fn();
    render(
      <TechDocsShadowDom element={dom} onAppend={onAppend}>
        Children
      </TechDocsShadowDom>,
    );
    expect(screen.getByText('Children')).toBeInTheDocument();
  });

  it('Should re-render if props changes', async () => {
    const Component = ({
      onAppend,
    }: Pick<TechDocsShadowDomProps, 'onAppend'>) => {
      const [dom, setDom] = useState(createDom('<body><h1>Title1</h1></body>'));

      useEffect(() => {
        setDom(createDom('<body><h1>Title2</h1></body>'));
      }, []);

      return <TechDocsShadowDom element={dom} onAppend={onAppend} />;
    };

    const onAppend = jest.fn();
    render(<Component onAppend={onAppend} />);

    await waitFor(() => {
      const shadowHost = screen.getByTestId('techdocs-native-shadowroot');
      const h1 = shadowHost.shadowRoot?.querySelector('h1');
      expect(h1).toHaveTextContent('Title2');
    });
    expect(onAppend).toHaveBeenCalledTimes(2);
  });

  it('Should show progress bar while styles are being loaded', async () => {
    const dom = createDom(
      '<head><link rel="stylesheet" src="styles.css"/></head><body><h1>Title</h1></body>',
    );
    const onAppend = jest.fn();
    dom.querySelector('link[rel="stylesheet"]')!.addEventListener = () => {};

    render(
      <TechDocsShadowDom element={dom} onAppend={onAppend}>
        Children
      </TechDocsShadowDom>,
    );

    await await waitFor(() => {
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });
  });

  it('Should dispatch an event after all styles are loaded', async () => {
    const dom = createDom(
      '<head><link rel="stylesheet" src="styles.css"/></head><body><h1>Title</h1></body>',
    );
    let listener: EventListenerOrEventListenerObject = () => {};
    dom.querySelector('link')!.addEventListener = (
      _type: string,
      _listener: EventListenerOrEventListenerObject,
    ) => {
      listener = _listener;
    };
    const handleStylesLoad = jest.fn();
    dom.addEventListener(SHADOW_DOM_STYLE_LOAD_EVENT, handleStylesLoad);

    render(<TechDocsShadowDom element={dom}>Children</TechDocsShadowDom>);

    await await waitFor(() => {
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    listener({} as Event);

    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });

    expect(handleStylesLoad).toHaveBeenCalledTimes(1);
  });
});
