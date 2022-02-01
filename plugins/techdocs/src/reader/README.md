# TechDocs Reader

The TechDocs reader is a component that fetches a remote page, runs transformers on it and renders it into a shadow dom.

Currently there's no easy way to customize which transformers to run or add new ones. If that is needed you would have to fork the techdocs plugin and make your changes in that fork.

Transformers are functions that optionally takes in parameters from the Reader.tsx component and returns a function which gets passed the DOM of the fetched page. A very simple transformer can look like this.

```typescript
export const updateH1Text = (): Transformer => {
  return dom => {
    // Change the first occurance of H1 to say "TechDocs!"
    dom.querySelector('h1')?.innerHTML = 'TechDocs!';

    return dom;
  };
};
```

The transformers are then registered in the Reader.tsx file. They are registered in two places, one place that runs before it's attached to the actual browser DOM (preTransformers) and once after (postTransfomers). Doing modifications is faster before it's attached, but doesn't allow us to do some things, such as attaching event listeners.
