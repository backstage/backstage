---
'@backstage/plugin-catalog-react': minor
---

Introduces a new `EntityIconLinkBlueprint` that customizes the `About` card icon links on the `Catalog` entity page.

The blueprint currently accepts the following `params`:

| Name       | Description                                         | Type                       | Default Value |
| ---------- | --------------------------------------------------- | -------------------------- | ------------- |
| `icon`     | The icon to display.                                | `JSX.Element`              | N/A           |
| `label`    | The label for the element.                          | `string`                   | N/A           |
| `title`    | The title for the element.                          | `string`                   | N/A           |
| `color`    | The color of the element.                           | `'primary' \| 'secondary'` | `primary`     |
| `disabled` | Whether the element is disabled.                    | `boolean`                  | `false`       |
| `href`     | The URL to navigate to when the element is clicked. | `string`                   | N/A           |
| `onClick`  | A function to call when the element is clicked.     | `() => void`               | N/A           |
| `hidden`   | Whether the element is hidden.                      | `boolean`                  | `false`       |

Here is an usage example:

```tsx
import { EntityIconLinkBlueprint } from '@backstage/plugin-catalog-react/alpha';
//...

// Defining the icon link properties using an object
EntityIconLinkBlueprint.make({
  name: 'my-icon-link',
  params: {
    props: {
      label: 'My Icon Link Label',
      icon: <MyIconLinkIcon />,
      href: '/my-plugin',
    },
  },
});
```

or

```tsx
import { EntityIconLinkBlueprint } from '@backstage/plugin-catalog-react/alpha';
//...

// Defining the icon link properties using a function
EntityIconLinkBlueprint.make({
  name: 'my-icon-link',
  params: {
    props: function useMyIconLinkProps() {
      // Use a function when you would like use a hook for defining the
      // icon link props on runtime
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

Additionally, the `app-config.yaml` file allows you to override some of the default icon link parameters, including `label`, `title`, `color`, `href`, `disabled`, and `hidden` values. Here's how to set them:

```yaml
app:
  extensions:
    - entity-icon-link:my-plugin/my-icon-link:
        config:
          label: 'My Custom Icon Link label'
```
