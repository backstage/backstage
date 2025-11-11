export * from './types';
import { changelog_0_6_0 } from './changelogs/v0.6.0';
import { changelog_0_5_0 } from './changelogs/v0.5.0';
import { changelog_0_4_0 } from './changelogs/v0.4.0';
import { changelog_0_3_0 } from './changelogs/v0.3.0';
import { changelog_0_2_0 } from './changelogs/v0.2.0';

export const changelog = [
  ...changelog_0_6_0,
  ...changelog_0_5_0,
  ...changelog_0_4_0,
  ...changelog_0_3_0,
  ...changelog_0_2_0,
];
