/*
 * Copyright 2023 The Backstage Authors
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
import { makeStyles } from '@material-ui/core';

export const cardStyles = makeStyles({
  card: { padding: '20px' },
  reason: { fontSize: '1.5em' },
  tagline: {
    font: "800 0.75rem/0.75rem SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
    marginBottom: '1em',
    color: '#FFF',
    textTransform: 'uppercase',
    padding: '14px 0 13px 0',
  },
  text: {
    font: "800 1.5rem -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen-Sans, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif",
    color: '#111',
    textTransform: 'uppercase',
    hyphens: 'auto',
  },
  reload: {
    display: 'inline-block',
    font: "350 0.75rem/0.75rem SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
    background: 'transparent',
    textDecoration: 'none',
    color: 'gray',
    marginTop: '1rem',
    outline: 'none',
    cursor: 'pointer',
    width: '4rem',
    padding: '0.25em 1em',
    border: '1px solid',
    borderRadius: '4px',
    borderColor: 'gray',
  },
  container: {
    textAlign: 'center',
    alignItems: 'center',
  },
});
