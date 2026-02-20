export type Component =
  | 'accordion'
  | 'alert'
  | 'avatar'
  | 'box'
  | 'button'
  | 'button-icon'
  | 'button-link'
  | 'card'
  | 'checkbox'
  | 'collapsible'
  | 'container'
  | 'datatable'
  | 'dialog'
  | 'flex'
  | 'grid'
  | 'plugin-header'
  | 'header-page'
  | 'heading'
  | 'icon'
  | 'link'
  | 'menu'
  | 'password-field'
  | 'radio-group'
  | 'scrollarea'
  | 'searchfield'
  | 'select'
  | 'skeleton'
  | 'switch'
  | 'table'
  | 'tabs'
  | 'tag-group'
  | 'text'
  | 'textfield'
  | 'tooltip'
  | 'visually-hidden';

export type Hook = 'use-breakpoint';

export type Version = `${number}.${number}.${number}`;

export type AtLeastOne<T, K extends keyof T = keyof T> = K extends string
  ? Pick<T, K> & Partial<Omit<T, K>>
  : never;

export type ChangelogProps = {
  description: string;
  version: Version;
  prs: string[];
  breaking?: boolean;
  commitSha?: string;
  migration?: string;
} & AtLeastOne<{
  components: Component[];
  hooks: Hook[];
}>;
