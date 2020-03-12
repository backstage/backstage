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

import React from 'react';
import { render } from '@testing-library/react';
import OwnerHeaderLabel from './OwnerHeaderLabel';
import { wrapInThemedTestApp } from '../../testUtils';

const properOwner = { id: 'tools', name: 'tools', type: 'squad' };
const badOwner = { id: 'tools-xxx', name: 'tools-xxx' };

describe('<OwnerHeaderLabel />', () => {
  it('should have a label', () => {
    const rendered = render(
      wrapInThemedTestApp(<OwnerHeaderLabel owner={properOwner} />),
    );
    expect(rendered.getByText('Owner')).toBeInTheDocument();
    expect(rendered.getByText('tools')).toBeInTheDocument();
    expect(rendered.queryByText('Squad not verified!')).not.toBeInTheDocument();
  });

  it('should have an org link', () => {
    const rendered = render(
      wrapInThemedTestApp(<OwnerHeaderLabel owner={properOwner} />),
    );
    const anchor = rendered.container.querySelector('a');
    expect(anchor.href).toBe('http://localhost/org/tools');
  });

  it('should have WARNING label', () => {
    const rendered = render(
      wrapInThemedTestApp(<OwnerHeaderLabel owner={badOwner} />),
    );
    expect(rendered.getByText('Squad not verified!')).toBeInTheDocument();
  });

  it('should have status error label', () => {
    const rendered = render(
      wrapInThemedTestApp(<OwnerHeaderLabel owner={badOwner} />),
    );
    expect(rendered.getByLabelText('Status error')).toBeInTheDocument();
  });

  it('should handle empty input', () => {
    const rendered = render(
      wrapInThemedTestApp(<OwnerHeaderLabel owner={{}} />),
    );
    expect(rendered.getByLabelText('Status error')).toBeInTheDocument();
  });
});
