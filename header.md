## TODO

- [ ] Shipping https://www.figma.com/design/zJxHainw6yO7L9oEsStAh7/Header?node- [ ]id=103- [ ]5709&t=HNkpc2MqdUbaN8Jz- [ ]1
- [ ] TopBarActionBlueprint?
- [ ] PageBlueprint additions or ContentBlueprint?
- [ ] Should we add titles to all plugins?
- [ ] Should we add icons to all plugins?

- [ ] Add `icon` and `title` to the plugin info

## Notes

- HeaderActionBlueprint is a bit wonky, too specific?

## Requirements

- Consistency of headers across all plugins in NFS
- Possibility to put breadcrumbs in the top bar
- Two levels of navigation for plugins - page + sub pages

## Technical Requirements

- Sub pages must be represented in some form as extensions
- Sub pages must have a title and path relative to the parent page
- Plugins must have titles and icons
- Sub pages must be attachments of the parent page

## Potential Solutions

### Make all(\*) pages navigable, get rid of nav items

## Implementation Plan

- Add support for plugin-relative attachment points, i.e. `attachTo: { id: 'page:{pluginId}', input: 'pages' }`
  - Alternative: typescript-based attachment points, i.e. `attachTo: appVisualizerPage` or `attachTo: appVisualizerPage.inputs.pages`
- Add a `SubPageBlueprint` that attaches to the `pages` of `PageBlueprint`, using plugin-relative attachment
- Add a swappable component for the `PageBlueprint` React element
- Add `title` param and output to `PageBlueprint`

To consider:

- Add `display` options for plugins
- Add `coreExtensionData.navTarget`, either marker or with actual data
