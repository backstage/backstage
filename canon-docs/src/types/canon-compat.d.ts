// Type compatibility fixes for Canon (React 18) components used in React 19 environment

declare module 'csstype' {
  interface Properties {
    // Make appearance property compatible between React 18 and 19
    appearance?:
      | 'none'
      | 'auto'
      | 'textfield'
      | 'menulist-button'
      | 'revert-layer' // React 19 addition
      | string; // Allow any string for forward compatibility
  }
}
