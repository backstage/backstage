import type {
  Meta as StorybookMeta,
  StoryObj as StorybookStoryObj,
} from '@storybook/react';

declare module 'backstage-storybook' {
  export type Meta<T> = StorybookMeta<T>;
  export type StoryObj<T> = StorybookStoryObj<T>;
}
