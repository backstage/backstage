/*
 * Copyright 2020 The Backstage Authors
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
import { EmptyState } from './EmptyState';
import Button from '@material-ui/core/Button';
import { MissingAnnotationEmptyState } from './MissingAnnotationEmptyState';

export default {
  title: 'Feedback/EmptyState',
  component: EmptyState,
};

const containerStyle = { width: '100%', height: '100vh' };

export const MissingAnnotation = () => (
  <div style={containerStyle}>
    <MissingAnnotationEmptyState
      annotation={['backstage.io/foo', 'backstage.io/bar']}
    />
  </div>
);

export const Info = () => (
  <div style={containerStyle}>
    <EmptyState
      missing="info"
      title="No information to display"
      description="Add a description here."
    />
  </div>
);

export const Content = () => (
  <div style={containerStyle}>
    <EmptyState
      missing="content"
      title="Create a component"
      description="Add a description here."
    />
  </div>
);

export const Data = () => (
  <div style={containerStyle}>
    <EmptyState
      missing="data"
      title="No builds to show"
      description="Add a description here."
    />
  </div>
);

export const WithAction = () => (
  <div style={containerStyle}>
    <EmptyState
      missing="field"
      title="Your plugin is missing an annotation"
      description="Click the docs to learn more."
      action={
        <Button color="primary" href="#" onClick={() => {}} variant="contained">
          DOCS
        </Button>
      }
    />
  </div>
);

export const CustomImage = () => (
  <div style={containerStyle}>
    <EmptyState
      title="Custom image example"
      missing={{
        customImage: (
          <img
            src="https://backstage.io/animations/backstage-software-catalog-icon-1.gif"
            alt="Backstage example"
          />
        ),
      }}
    />
  </div>
);
