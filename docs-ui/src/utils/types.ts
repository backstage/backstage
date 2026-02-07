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
  | 'header'
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

export type Version = `${number}.${number}.${number}`;

export interface ChangelogProps {
  components: Component[];
  description: string;
  version: Version;
  prs: string[];
  breaking?: boolean;
  commitSha?: string;
  migration?: string;
}
