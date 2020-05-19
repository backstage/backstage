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
import CodeSnippet from './CodeSnippet';

export default {
  title: 'CodeSnippet',
  component: CodeSnippet,
};

const containerStyle = { width: 300 };

const JAVASCRIPT = `const greeting = "Hello";
const world = "World";

const greet = person => greeting + " " + person + "!";

greet(world);
`;

const TYPESCRIPT = `const greeting: string = "Hello";
const world: string = "World";

const greet = (person: string): string => greeting + " " + person + "!";

greet(world);
`;

const PYTHON = `greeting = "Hello"
world = "World"

def greet(person):
    return f"{greeting} {person}!"

greet(world)
`;

export const Default = () => (
  <CodeSnippet text={"const hello = 'World';"} language="javascript" />
);

export const MultipleLines = () => (
  <CodeSnippet text={JAVASCRIPT} language="javascript" />
);

export const LineNumbers = () => (
  <CodeSnippet text={JAVASCRIPT} language="javascript" showLineNumbers />
);

export const Overflow = () => (
  <>
    <div style={containerStyle}>
      <CodeSnippet text={JAVASCRIPT} language="javascript" />
    </div>
    <div style={containerStyle}>
      <CodeSnippet text={JAVASCRIPT} language="javascript" showLineNumbers />
    </div>
  </>
);

export const Languages = () => (
  <>
    <CodeSnippet text={JAVASCRIPT} language="javascript" showLineNumbers />
    <CodeSnippet text={TYPESCRIPT} language="typescript" showLineNumbers />
    <CodeSnippet text={PYTHON} language="python" showLineNumbers />
  </>
);
