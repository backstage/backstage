---
'@backstage/theme': patch
---

Removed the following unused properties from BackstagePaletteAdditions under the `bursts` property:

```ts
slackChannelText: string;
backgroundColor: {
    default: string;
};
```

If these were being used you can add them back to your custom theme, for example like this:

```diff
 bursts: {
     fontColor: '#FEFEFE',
+    slackChannelText: '#ddd',
+    backgroundColor: {
+       default: '#7C3699',
+    },
     gradient: {
        linear: 'linear-gradient(-137deg, #4BB8A5 0%, #187656 100%)',
     },
},
```

The [Customize the look-and-feel of your App](https://backstage.io/docs/getting-started/app-custom-theme) documentation has more details on creating and using a custom theme.
