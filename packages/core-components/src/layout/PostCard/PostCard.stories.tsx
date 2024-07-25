/*
 * Copyright 2024 The Backstage Authors
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
import { PostCard } from './PostCard';
import React from 'react';
import { Link, MemoryRouter } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';

export default {
  title: 'Layout/PostCard',
};

const text =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua Ut enim ad minim';

export const Default = () => (
  <MemoryRouter>
    <Grid container spacing={3}>
      {[...Array(10).keys()].map(index => (
        <Grid key={index} item xs={12} sm={6} md={4} lg={2}>
          <PostCard>
            <PostCard.Media>
              <img
                src={`https://picsum.photos/seed/${index + 1}/200/300`}
                alt="card"
              />
            </PostCard.Media>
            <PostCard.Title>Card #{index}</PostCard.Title>
            <PostCard.Description>
              {text
                .split(' ')
                .slice(0, 5 + Math.floor(Math.random() * 30))
                .join(' ')}
            </PostCard.Description>
            <PostCard.Actions
              cta={{
                label: 'Open',
                action: '#cta',
              }}
            />
          </PostCard>
        </Grid>
      ))}
    </Grid>
  </MemoryRouter>
);

export const WithSize = () => (
  <MemoryRouter>
    <Grid container spacing={3}>
      {[...Array(10).keys()].map(index => (
        <Grid key={index} item xs={12} sm={6} md={4} lg={2}>
          <PostCard size="small">
            <PostCard.Title>Card #{index}</PostCard.Title>
            <PostCard.Description>
              {text
                .split(' ')
                .slice(0, 5 + Math.floor(Math.random() * 30))
                .join(' ')}
            </PostCard.Description>
            <PostCard.Actions
              cta={{
                label: 'Open',
                action: '#cta',
              }}
            />
          </PostCard>
        </Grid>
      ))}
    </Grid>
  </MemoryRouter>
);

export const WithSecondaryCTA = () => (
  <MemoryRouter>
    <Grid container spacing={3}>
      {[...Array(10).keys()].map(index => (
        <Grid key={index} item xs={12} sm={6} md={4} lg={2}>
          <PostCard>
            <PostCard.Title>Card #{index}</PostCard.Title>
            <PostCard.Description>
              {text
                .split(' ')
                .slice(0, 5 + Math.floor(Math.random() * 30))
                .join(' ')}
            </PostCard.Description>
            <PostCard.Actions
              cta={{
                label: 'Open',
                action: '#cta',
              }}
              secondaryCta={{
                label: 'Search',
                action: '#search',
              }}
            />
          </PostCard>
        </Grid>
      ))}
    </Grid>
  </MemoryRouter>
);

export const WithInteractiveMedia = () => (
  <MemoryRouter>
    <Grid container spacing={3}>
      {[...Array(10).keys()].map(index => (
        <Grid key={index} item xs={12} sm={6} md={4} lg={2}>
          <PostCard>
            <PostCard.Media interactive>
              <Link to="#media">
                <img
                  src={`https://picsum.photos/seed/${index + 1}/200/300`}
                  alt="card"
                />
              </Link>
            </PostCard.Media>
            <PostCard.Title>Card #{index}</PostCard.Title>
            <PostCard.Description>
              {text
                .split(' ')
                .slice(0, 5 + Math.floor(Math.random() * 30))
                .join(' ')}
            </PostCard.Description>
            <PostCard.Actions
              cta={{
                label: 'Open',
                action: '#cta',
              }}
            />
          </PostCard>
        </Grid>
      ))}
    </Grid>
  </MemoryRouter>
);
