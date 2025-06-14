---
'@backstage/plugin-catalog-react': minor
---

Introduces a new `EntityIconLinkBlueprint` that customizes the `About` card icon links on the `Catalog` entity page.

The blueprint currently accepts a `useProps` hook as `param` and this function returns the following props that will be passed to the icon link component:

| Name       | Description                                         | Type          | Default Value |
| ---------- | --------------------------------------------------- | ------------- | ------------- |
| `icon`     | The icon to display.                                | `JSX.Element` | N/A           |
| `label`    | The label for the element.                          | `string`      | N/A           |
| `title`    | The title for the element.                          | `string`      | N/A           |
| `disabled` | Whether the element is disabled.                    | `boolean`     | `false`       |
| `href`     | The URL to navigate to when the element is clicked. | `string`      | N/A           |
| `onClick`  | A function to call when the element is clicked.     | `() => void`  | N/A           |

Here is an usage example:

```tsx
import { EntityIconLinkBlueprint } from '@backstage/plugin-catalog-react/alpha';
//...

EntityIconLinkBlueprint.make({
  name: 'my-icon-link',
  params: {
    useProps() {
      const { t } = useTranslationRef(myIconLinkTranslationRef);
      return {
        label: t('myIconLink.label'),
        icon: <MyIconLinkIcon />,
        href: '/my-plugin',
      };
    },
  },
});
```

Additionally, the `app-config.yaml` file allows you to override some of the default icon link parameters, including `label` and `title` values. Here's how to set them:

```yaml
app:
  extensions:
    - entity-icon-link:my-plugin/my-icon-link:
        config:
          label: 'My Custom Icon Link label'
```

Finally, you can disable all links if you want to hide the About card header completely (useful, for example, when links are displayed on separate cards). The header is hidden when no icon links extensions are enabled.
