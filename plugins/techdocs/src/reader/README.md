# TechDocs Reader

The TechDocs reader is a component that fetches a remote page, runs transformers on it and renders it into a shadow dom.

## Custom Transformers

You can now easily add custom transformers to TechDocs using the new frontend system's extension API. Transformers are functions that modify the DOM of documentation pages.

### Creating a Custom Transformer

Use the `TransformerBlueprint` from `@backstage/plugin-techdocs-react/alpha` to create custom transformers:

```typescript
import { createFrontendPlugin } from '@backstage/frontend-plugin-api';
import { TransformerBlueprint } from '@backstage/plugin-techdocs-react/alpha';

export default createFrontendPlugin({
  id: 'my-techdocs-customizations',
  extensions: [
    TransformerBlueprint.make({
      name: 'highlight-notes',
      params: {
        phase: 'pre', // 'pre' or 'post'
        priority: 45, // Lower numbers run first (default: 50)
        transformer: async dom => {
          // Find all elements with class "note" and highlight them
          const notes = dom.querySelectorAll('.note');
          notes.forEach(note => {
            note.style.backgroundColor = '#fff3cd';
            note.style.padding = '1rem';
            note.style.borderLeft = '4px solid #ffc107';
          });
          return dom;
        },
      },
    }),
  ],
});
```

### Transformer Phases

Transformers run in two phases:

- **`pre`**: Runs before the DOM is attached to the browser (faster, no event listeners)
- **`post`**: Runs after the DOM is attached (can attach event listeners and interact with real DOM)

### Transformer Priority

Transformers are executed in order of priority (lowest to highest). Default transformers use priorities 10-80:

- **Pre-render** (10-80): sanitizer, addBaseUrl, rewriteDocLinks, addSidebarToggle, removeMkdocsHeader, simplifyMkdocsFooter, addGitFeedbackLink, styles
- **Post-render** (10-60): handleMetaRedirects, scrollIntoNavigation, copyToClipboard, addLinkClickListener, onCssReady, addNavLinkKeyboardToggle

Set custom priorities to control execution order relative to built-in transformers.

### Example: Custom Syntax Highlighting

```typescript
TransformerBlueprint.make({
  name: 'custom-syntax-highlight',
  params: {
    phase: 'post',
    priority: 35, // Run after copyToClipboard (30)
    transformer: async dom => {
      const codeBlocks = dom.querySelectorAll('pre code');
      codeBlocks.forEach(block => {
        // Apply custom syntax highlighting
        hljs.highlightElement(block);
      });
      return dom;
    },
  },
});
```

### Example: Add Custom Link Icons

```typescript
TransformerBlueprint.make({
  name: 'external-link-icons',
  params: {
    phase: 'pre',
    priority: 35, // Run after rewriteDocLinks (30)
    transformer: async dom => {
      const externalLinks = dom.querySelectorAll('a[target="_blank"]');
      externalLinks.forEach(link => {
        const icon = document.createElement('span');
        icon.innerHTML = ' 🔗';
        link.appendChild(icon);
      });
      return dom;
    },
  },
});
```

## Writing Transformers (Legacy Info)

Transformers are functions that optionally take in parameters and return a function which gets passed the DOM of the fetched page. A very simple transformer can look like this:

```typescript
export const updateH1Text = (): Transformer => {
  return dom => {
    // Change the first occurrence of H1 to say "TechDocs!"
    dom.querySelector('h1')?.innerHTML = 'TechDocs!';

    return dom;
  };
};
```
