// Sometimes codes are not formatted correctly in the docs, so we need to use snippets

export const customTheme = `:root {
  --bui-font-regular: system-ui;
  --bui-font-weight-regular: 400;
  --bui-font-weight-bold: 600;
  --bui-bg-surface-0: #f8f8f8;
  --bui-bg-surface-1: #fff;
  /* ... other CSS variables */

  /* Add your custom components styles here */
  .bui-Button {
    background-color: #000;
    color: #fff;
  }
}

[data-theme-mode='dark'] {
  --bui-font-regular: system-ui;
  --bui-font-weight-regular: 400;
  --bui-font-weight-bold: 600;
  --bui-bg-surface-0: #f8f8f8;
  --bui-bg-surface-1: #fff;
  /* ... other CSS variables */

  /* Add your custom components styles here */
  .bui-Button {
    background-color: #000;
    color: #fff;
  }
}
`;
