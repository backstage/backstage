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

import { renderInTestApp } from '@backstage/test-utils';
import React from 'react';
import { JsonSchemaDefinitionWidget } from './JsonSchemaDefinitionWidget';

describe('<JsonSchemaDefinitionWidget />', () => {
  it('renders json schema', async () => {
    // From https://json-schema.org/learn/miscellaneous-examples.html
    const definition = `
{
  "$id": "https://example.com/person.schema.json",
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "Person",
  "type": "object",
  "properties": {
    "firstName": {
      "type": "string",
      "description": "The person's first name."
    },
    "lastName": {
      "type": "string",
      "description": "The person's last name."
    },
    "age": {
      "description": "Age in years which must be equal to or greater than zero.",
      "type": "integer",
      "minimum": 0
    }
  }
}
    `;
    const { getByText } = await renderInTestApp(
      <JsonSchemaDefinitionWidget definition={definition} />,
    );

    expect(getByText(/lastName/i)).toBeInTheDocument();
    expect(getByText(/The person's last name./i)).toBeInTheDocument();
  });

  it('renders error if definition is missing', async () => {
    const { getByText } = await renderInTestApp(
      <JsonSchemaDefinitionWidget definition="{}" />,
    );
    expect(getByText(/No schema defined/i)).toBeInTheDocument();
  });
});
