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
import React from 'react';
import { ErrorListTemplate } from './errorListTemplate';
import { renderInTestApp } from '@backstage/test-utils';
import { ErrorListProps } from '@rjsf/utils';

describe('Error List Template', () => {
  describe('should render the error messages', () => {
    it('no properties', async () => {
      const errorList = {
        errors: [
          {
            stack: 'Test error 1',
          },
          {
            stack: 'Test error 2',
          },
        ],
        errorSchema: {},
      } as Partial<ErrorListProps> as ErrorListProps;

      const { getByText } = await renderInTestApp(
        <ErrorListTemplate {...errorList} />,
      );

      for (const error of errorList.errors) {
        expect(getByText(error.stack)).toBeInTheDocument();
      }
    });

    it('properties no title', async () => {
      const errorList = {
        errors: [
          {
            property: '.foo',
            stack: 'Test error 1',
            message: 'Test error 1',
          },
          {
            property: '.anExampleTitle',
            stack: 'Test error 2',
            message: 'Test error 2',
          },
        ],
        errorSchema: {},
        schema: {},
      } as Partial<ErrorListProps> as ErrorListProps;

      const { getByText } = await renderInTestApp(
        <ErrorListTemplate {...errorList} />,
      );

      expect(getByText("'Foo' Test error 1")).toBeInTheDocument();
      expect(getByText("'An Example Title' Test error 2")).toBeInTheDocument();
    });

    it('properties with title', async () => {
      const errorList = {
        errors: [
          {
            property: '.foo',
            stack: 'Test error 1',
            message: 'Test error 1',
          },
          {
            property: '.bar',
            stack: 'Test error 2',
            message: 'Test error 2',
          },
        ],
        errorSchema: {},
        schema: {
          properties: {
            foo: {
              title: 'Hello',
            },
            bar: {
              title: 'Example Title',
            },
          },
        },
      } as Partial<ErrorListProps> as ErrorListProps;

      const { getByText } = await renderInTestApp(
        <ErrorListTemplate {...errorList} />,
      );

      expect(getByText("'Hello' Test error 1")).toBeInTheDocument();
      expect(getByText("'Example Title' Test error 2")).toBeInTheDocument();
    });

    it('looks up deeply nested properties', async () => {
      const errorList = {
        errors: [
          {
            property: '.foo',
            stack: 'Test error 1',
            message: 'Test error 1',
          },
        ],
        errorSchema: {},
        schema: {
          if: {
            properties: {},
          },
          else: {
            if: {},
            else: {
              properties: {
                foo: {
                  title: 'Hello',
                },
              },
            },
          },
          properties: {},
        },
      } as Partial<ErrorListProps> as ErrorListProps;

      const { getByText } = await renderInTestApp(
        <ErrorListTemplate {...errorList} />,
      );

      expect(getByText("'Hello' Test error 1")).toBeInTheDocument();
    });
  });
});
