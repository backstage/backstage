/*
 * Copyright 2026 The Backstage Authors
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

import preview from '../../../../../.storybook/preview';
import { Autocomplete } from './Autocomplete';
import {
  RiSearchLine,
  RiCodeLine,
  RiDatabase2Line,
  RiServerLine,
  RiGlobalLine,
} from '@remixicon/react';

const meta = preview.meta({
  title: 'Backstage UI/Autocomplete',
  component: Autocomplete,
  args: {
    style: { width: 300 },
  },
});

const countries = [
  { value: 'us', label: 'United States' },
  { value: 'ca', label: 'Canada' },
  { value: 'mx', label: 'Mexico' },
  { value: 'uk', label: 'United Kingdom' },
  { value: 'fr', label: 'France' },
  { value: 'de', label: 'Germany' },
  { value: 'it', label: 'Italy' },
  { value: 'es', label: 'Spain' },
  { value: 'jp', label: 'Japan' },
  { value: 'cn', label: 'China' },
  { value: 'in', label: 'India' },
  { value: 'br', label: 'Brazil' },
  { value: 'au', label: 'Australia' },
];

const programmingLanguages = [
  {
    value: 'javascript',
    label: 'JavaScript',
    icon: <RiCodeLine />,
    description: 'Dynamic scripting',
  },
  {
    value: 'typescript',
    label: 'TypeScript',
    icon: <RiCodeLine />,
    description: 'Typed superset of JS',
  },
  {
    value: 'python',
    label: 'Python',
    icon: <RiCodeLine />,
    description: 'General purpose',
  },
  {
    value: 'java',
    label: 'Java',
    icon: <RiCodeLine />,
    description: 'Enterprise ready',
  },
  {
    value: 'csharp',
    label: 'C#',
    icon: <RiCodeLine />,
    description: '.NET framework',
  },
  {
    value: 'go',
    label: 'Go',
    icon: <RiCodeLine />,
    description: 'Compiled, concurrent',
  },
  {
    value: 'rust',
    label: 'Rust',
    icon: <RiCodeLine />,
    description: 'Memory safe',
  },
  {
    value: 'kotlin',
    label: 'Kotlin',
    icon: <RiCodeLine />,
    description: 'Modern JVM',
  },
  {
    value: 'swift',
    label: 'Swift',
    icon: <RiCodeLine />,
    description: 'iOS development',
  },
  {
    value: 'ruby',
    label: 'Ruby',
    icon: <RiCodeLine />,
    description: 'Web frameworks',
  },
];

const services = [
  {
    value: 'api',
    label: 'API Service',
    icon: <RiServerLine />,
    type: 'Backend',
    status: 'Running',
    uptime: '99.9%',
  },
  {
    value: 'web',
    label: 'Web Frontend',
    icon: <RiGlobalLine />,
    type: 'Frontend',
    status: 'Running',
    uptime: '99.8%',
  },
  {
    value: 'database',
    label: 'Database',
    icon: <RiDatabase2Line />,
    type: 'Storage',
    status: 'Healthy',
    uptime: '100%',
  },
];

export const Default = meta.story({
  args: {
    options: programmingLanguages,
    name: 'language',
    label: 'Programming Language',
  },
});

export const WithIcon = meta.story({
  args: {
    options: programmingLanguages,
    name: 'language',
    label: 'Programming Language',
    icon: <RiSearchLine />,
  },
});

export const WithDescription = meta.story({
  args: {
    label: 'Country',
    description: 'Select your country of residence',
    options: countries,
    placeholder: 'Type to search...',
    name: 'country',
  },
});

export const Sizes = meta.story({
  render: () => (
    <>
      <Autocomplete
        label="Small"
        size="small"
        options={programmingLanguages}
        style={{ marginBottom: 16 }}
      />
      <Autocomplete
        label="Medium"
        size="medium"
        options={programmingLanguages}
      />
    </>
  ),
});

export const CustomValue = meta.story({
  args: {
    label: 'Custom Value',
    description: 'Type your own value or select from list',
    options: programmingLanguages,
    allowsCustomValue: true,
    placeholder: 'Type to search or enter custom...',
  },
});

export const Disabled = meta.story({
  args: {
    label: 'Disabled',
    options: programmingLanguages,
    isDisabled: true,
  },
});

export const Required = meta.story({
  args: {
    label: 'Required Field',
    options: countries,
    isRequired: true,
  },
});

export const MenuDisplay = meta.story({
  args: {
    label: 'Menu Style',
    displayMode: 'menu',
    options: programmingLanguages,
    placeholder: 'Select a language...',
  },
});

export const GridDisplay = meta.story({
  args: {
    label: 'Grid Layout',
    displayMode: 'grid',
    options: programmingLanguages.slice(0, 6),
    gridConfig: { columns: 3, gap: 'var(--bui-space-2)' },
    placeholder: 'Choose...',
    style: { width: 500 },
  },
});

export const TagsDisplay = meta.story({
  args: {
    label: 'Tags Style',
    displayMode: 'tags',
    options: countries.slice(0, 8),
    placeholder: 'Select country...',
    style: { width: 400 },
  },
});

export const TableDisplay = meta.story({
  args: {
    label: 'Table View',
    displayMode: 'table',
    options: services,
    tableColumns: [
      { key: 'label', label: 'Service', width: '2fr' },
      { key: 'type', label: 'Type', width: '1fr' },
      { key: 'status', label: 'Status', width: '1fr' },
      { key: 'uptime', label: 'Uptime', width: '1fr' },
    ],
    placeholder: 'Search services...',
    style: { width: 600 },
  },
});

export default meta;
