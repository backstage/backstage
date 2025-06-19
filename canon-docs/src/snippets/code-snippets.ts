// Sometimes codes are not formatted correctly in the docs, so we need to use snippets

export const customTheme = `:root {
  --canon-font-regular: system-ui;
  --canon-font-weight-regular: 400;
  --canon-font-weight-bold: 600;
  --canon-bg: #f8f8f8;
  --canon-bg-surface-1: #fff;
  /* ... other CSS variables */

  /* Add your custom components styles here */
  .canon-Button {
    background-color: #000;
    color: #fff;
  }
}

[data-theme='dark'] {
  --canon-font-regular: system-ui;
  --canon-font-weight-regular: 400;
  --canon-font-weight-bold: 600;
  --canon-bg: #f8f8f8;
  --canon-bg-surface-1: #fff;
  /* ... other CSS variables */

  /* Add your custom components styles here */
  .canon-Button {
    background-color: #000;
    color: #fff;
  }
}
`;
