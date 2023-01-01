/*
 * Copyright 2022 The Backstage Authors
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

import { Theme } from '@mui/material';
import { transformV5ComponentThemesToV4 } from './overrides';

describe('transformV5ComponentThemesToV4', () => {
  const mockTheme = {
    palette: {
      primary: {
        main: 'red',
      },
    },
  } as unknown as Theme;
  it('transforms empty component themes', () => {
    expect(transformV5ComponentThemesToV4(mockTheme)).toEqual({
      overrides: {},
      props: {},
    });
    expect(transformV5ComponentThemesToV4(mockTheme, {})).toEqual({
      overrides: {},
      props: {},
    });
    expect(
      transformV5ComponentThemesToV4(mockTheme, {
        MuiButton: {
          styleOverrides: undefined,
          defaultProps: undefined,
        },
      }),
    ).toEqual({ overrides: {}, props: {} });
    expect(
      transformV5ComponentThemesToV4(mockTheme, {
        MuiButton: {
          styleOverrides: {},
          defaultProps: {},
        },
      }),
    ).toEqual({ overrides: { MuiButton: {} }, props: { MuiButton: {} } });
  });

  it('transforms component themes', () => {
    expect(
      transformV5ComponentThemesToV4(mockTheme, {
        MuiButton: {
          styleOverrides: {
            root: {
              color: 'green',
            },
          },
          defaultProps: {
            disableRipple: true,
          },
        },
      }),
    ).toEqual({
      overrides: {
        MuiButton: {
          root: {
            color: 'green',
          },
        },
      },
      props: {
        MuiButton: {
          disableRipple: true,
        },
      },
    });
    expect(
      transformV5ComponentThemesToV4(mockTheme, {
        MuiButton: {
          styleOverrides: {
            root: ({ theme }) => ({
              color: theme.palette.primary.main,
            }),
          },
        },
      }),
    ).toEqual({
      overrides: {
        MuiButton: {
          root: {
            color: 'red',
          },
        },
      },
      props: {},
    });
  });

  it('transforms CSSBaseline theme', () => {
    expect(
      transformV5ComponentThemesToV4(mockTheme, {
        MuiCssBaseline: {
          styleOverrides: theme => ({
            html: {
              color: theme.palette.primary.main,
            },
          }),
          defaultProps: {
            enableColorScheme: true,
          },
        },
      }),
    ).toEqual({
      overrides: {
        MuiCssBaseline: {
          '@global': {
            html: {
              color: 'red',
            },
          },
        },
      },
      props: {
        MuiCssBaseline: {
          enableColorScheme: true,
        },
      },
    });
  });

  it('transform state styles', () => {
    expect(
      transformV5ComponentThemesToV4(mockTheme, {
        MuiButton: {
          styleOverrides: {
            root: {
              color: 'green',
              '&.Mui-disabled': {
                color: 'red',
              },
            },
          },
        },
      }),
    ).toEqual({
      overrides: {
        MuiButton: {
          root: {
            color: 'green',
          },
          disabled: {
            color: 'red',
          },
        },
      },
      props: {},
    });
  });
});
