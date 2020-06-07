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
import {
  Lifecycle,
  Content,
  ContentHeader,
  InfoCard,
  Header,
  Page,
  pageTheme,
} from '@backstage/core';
import { Typography, Link, Button } from '@material-ui/core';
import { Link as RouterLink } from 'react-router-dom';
import { withTheme } from '@rjsf/core';
import { Theme as MuiTheme } from '@rjsf/material-ui';

const Form = withTheme(MuiTheme);
// TODO(blam): Connect to backend
const STATIC_DATA = {
  id: 'react-ssr-template',
  name: 'SSR React Website',
  description:
    'Next.js application skeleton for creating isomorphic web applications.',
  ownerId: 'something',
  parameters: {
    $schema: 'http://json-schema.org/draft-07/schema#',
    required: ['some_value'],
    properties: {
      some_value: {
        type: 'string',
        description: 'somethibg',
      },
      not_required: {
        type: 'string',
        description: 'somethibg',
      },
    },
  },
};

const ScaffoldFormPage: React.FC<{}> = () => {
  return (
    <Page theme={pageTheme.home}>
      <Header
        pageTitleOverride="Create a new component"
        title={
          <>
            Create a new component <Lifecycle alpha shorthand />{' '}
          </>
        }
        subtitle="Create new software components using standard templates"
      />
      <Content>
        <ContentHeader title="React SSR Template" />
        <Form schema={STATIC_DATA.parameters} onSubmit={() => {}}>
          <Button variant="contained" color="primary" type="submit">
            Submit
          </Button>
        </Form>
      </Content>
    </Page>
  );
};

export default ScaffoldFormPage;
