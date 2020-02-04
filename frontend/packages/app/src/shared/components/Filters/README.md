# Filters

_A simple composable side bar filter._

## Example

```jsx
<Filters id="dataEndpoints" onChange={this.onFilterChange} title="Filter title">
  <FilterSet title="SOME LABEL">
    <FilterField id="sample" type="checkbox" label="some field" />
    <FilterField id="sample2" type="checkbox" label="some field 2" />
    <FilterField id="sample2" type="checkbox" label="some field 3">
      {({ handleChildUpdate, ...parentAttributes }) => (
        <FilterSet isNested>
          <FilterField
            id="nested1"
            type="checkbox"
            label="some nested field"
            onChange={handleChildUpdate}
            {...parentAttributes}
          />
          <FilterField
            id="nested2"
            type="checkbox"
            label="some nested field 2"
            onChange={handleChildUpdate}
            {...parentAttributes}
          />
        </FilterSet>
      )}
    </FilterField>
  </FilterSet>
  <FilterSet>
    <SearchableSet
      id="owner"
      values={[
        { label: 'jump-cannon', value: 'jumpcannon' },
        { label: 'the-who', value: 'thewho' },
        { label: '202', value: '202' },
      ]}
    />
  </FilterSet>
</Filters>
```

<br><br>

## Components

### `<Filters />`

_Top level component_

#### Props

---

`id` (**required**) - Used as the namespace of your filter in redux.

---

`onChange` (**required**) - Handler for any filter selection changes. <br>The funciton is called with a flattened object containing the field id as the keys.

---

`title` (optional) - Title at the top of the filter
<br><br><br>

### `<FilterSet />`

_Group of filter fields_

#### Props

---

`isCollapsible` (optional) - Allows the filterset to collapse its contents

---

`title` (optional) - Title at the top of the filter set

---

`type` (optional) - enum(`checkbox`, `search` )

<br><br><br>

### `<SearchableSet />`

_Multi select search bar for a list of values_

#### Props

---

`id` (required) - Filter id that this set belongs to

---

`values` (required) - Array of object values that you can search and select. Each value object has a `value` and `label` key.

<br><br><br>

### `<FilterField />`

_Individual filter field (Currently checkbox is the only supported type)_

#### Props

---

`label` (optional) - Label for the field.

---

`description` (optional) - Description of the field.

---

`onChange` (optional) - Callback function when called when filter is updated

---

#### Props passed through render props

_This only applies if field is nested within another FilterField_

---

`children` (optional) - Function that passes child onChange handler, parent value, and parent clicked.

---

`parentValue` (optional) - Parent value if the filter field is nested.

---

`parentClicked` (optional) - Parent attribute specifying if the parent update was from a click event.
