import '@testing-library/jest-dom';

// Do not remove, patching jsdom environment to support TextEncoder, refer to https://github.com/jsdom/jsdom/issues/2524
// eslint-disable-next-line no-restricted-imports
import { TextEncoder } from 'util';

global.TextEncoder = TextEncoder;
