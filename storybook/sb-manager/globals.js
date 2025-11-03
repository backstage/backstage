import ESM_COMPAT_Module from "node:module";
import { fileURLToPath as ESM_COMPAT_fileURLToPath } from 'node:url';
import { dirname as ESM_COMPAT_dirname } from 'node:path';
const __filename = ESM_COMPAT_fileURLToPath(import.meta.url);
const __dirname = ESM_COMPAT_dirname(__filename);
const require = ESM_COMPAT_Module.createRequire(import.meta.url);

// src/manager/globals/globals.ts
var _ = {
  react: "__REACT__",
  "react-dom": "__REACT_DOM__",
  "react-dom/client": "__REACT_DOM_CLIENT__",
  "@storybook/icons": "__STORYBOOK_ICONS__",
  "storybook/manager-api": "__STORYBOOK_API__",
  "storybook/test": "__STORYBOOK_TEST__",
  "storybook/theming": "__STORYBOOK_THEMING__",
  "storybook/theming/create": "__STORYBOOK_THEMING_CREATE__",
  "storybook/internal/channels": "__STORYBOOK_CHANNELS__",
  "storybook/internal/client-logger": "__STORYBOOK_CLIENT_LOGGER__",
  "storybook/internal/components": "__STORYBOOK_COMPONENTS__",
  "storybook/internal/core-errors": "__STORYBOOK_CORE_EVENTS__",
  "storybook/internal/core-events": "__STORYBOOK_CORE_EVENTS__",
  "storybook/internal/manager-errors": "__STORYBOOK_CORE_EVENTS_MANAGER_ERRORS__",
  "storybook/internal/router": "__STORYBOOK_ROUTER__",
  "storybook/internal/types": "__STORYBOOK_TYPES__",
  // @deprecated TODO: delete in 9.1
  "storybook/internal/manager-api": "__STORYBOOK_API__",
  "storybook/internal/theming": "__STORYBOOK_THEMING__",
  "storybook/internal/theming/create": "__STORYBOOK_THEMING_CREATE__"
}, o = Object.keys(_);
export {
  o as globalPackages,
  _ as globalsNameReferenceMap
};
