import{j as t,r as x,p as f,M as b}from"./iframe-GY9q4FO8.js";import{a as L}from"./useListData-LAFW_3t4.js";import{e as j,f as D,h as G,g as v}from"./index-CbkTlW2S.js";import{T as r,a as i}from"./TagGroup-CM1L_Itd.js";import{F as I}from"./Flex-BELegxjd.js";import{B as k}from"./BUIProvider-CuGVHqZV.js";import"./preload-helper-PPVm8Dsz.js";import"./Button-gV3JsRfd.js";import"./utils-UG8wIxPz.js";import"./useObjectRef-DlPyeYly.js";import"./Label-Bc_GMvnu.js";import"./Hidden-nquVvtJw.js";import"./useFocusRing-BlRt_wPT.js";import"./openLink-CFz-JK3Y.js";import"./useLabel-uMVcdOMo.js";import"./useLabels-DnIs0d0f.js";import"./number-B5JXBwAu.js";import"./I18nProvider-BhiwSHej.js";import"./useButton-CUs3xyC6.js";import"./usePress-CTng4HyG.js";import"./textSelection-DeC98-eF.js";import"./getMetaValue-XB_wrXKe.js";import"./useHover-BHwy1G7-.js";import"./useCollection-DtPONGaC.js";import"./keyboard-BCJcwUXR.js";import"./FocusScope-DHVX7U6d.js";import"./useEvent-aycS7oPM.js";import"./useControlledState-BK9RR_T7.js";import"./ListBox-CXOtftYI.js";import"./useLoadMoreSentinel-Dss4yWwT.js";import"./Autocomplete-CrQwLSiz.js";import"./useLocalizedStringFormatter-BqaF7StP.js";import"./SelectionIndicator-ClprgyfK.js";import"./Text-CCPuhEw_.js";import"./useListState-C4X4wGMp.js";import"./useHighlightSelectionDescription-BjE5tOHk.js";import"./useUpdateEffect-Bj0xlUNw.js";import"./useHasTabbableChild-BswjRWa9.js";import"./useField-B4kUn8PC.js";import"./getNodeText-D1xzCoTU.js";import"./BUIRoutingProvider-Jw2VtAIF.js";import"./useResolvedHref-DHULiug-.js";const m=f.meta({title:"Backstage UI/TagGroup",component:r,argTypes:{selectionMode:{control:{type:"inline-radio"},options:["single","multiple"]},"aria-label":{control:{type:"text"}}},decorators:[n=>t.jsx(b,{children:t.jsx(k,{children:t.jsx(n,{})})})]}),s=[{id:"banana",name:"Banana",icon:t.jsx(j,{})},{id:"apple",name:"Apple",icon:t.jsx(D,{}),isDisabled:!0},{id:"orange",name:"Orange",icon:t.jsx(G,{}),isDisabled:!0},{id:"pear",name:"Pear",icon:t.jsx(v,{})},{id:"grape",name:"Grape",icon:t.jsx(j,{})},{id:"pineapple",name:"Pineapple",icon:t.jsx(G,{})},{id:"strawberry",name:"Strawberry",icon:t.jsx(v,{})}],c=m.story({args:{"aria-label":"Tag Group"},render:n=>t.jsx(r,{...n,children:s.map(e=>t.jsx(i,{children:e.name},e.id))})}),l=m.story({args:{...c.input.args},render:n=>t.jsxs(I,{direction:"column",children:[t.jsx(r,{...n,children:s.map(e=>t.jsx(i,{size:"small",icon:e.icon,children:e.name},e.id))}),t.jsx(r,{...n,children:s.map(e=>t.jsx(i,{size:"medium",icon:e.icon,children:e.name},e.id))})]})}),d=m.story({args:{selectionMode:"single","aria-label":"Tag Group"},render:n=>{const[e,p]=x.useState(new Set(["travel"]));return t.jsx(r,{...n,items:s,selectedKeys:e,onSelectionChange:p,children:a=>t.jsx(i,{children:a.name})})}}),u=m.story({args:{selectionMode:"multiple","aria-label":"Tag Group"},render:n=>{const[e,p]=x.useState(new Set(["travel","shopping"]));return t.jsx(r,{...n,items:s,selectedKeys:e,onSelectionChange:p,children:a=>t.jsx(i,{children:a.name})})}}),g=m.story({args:{...c.input.args},render:n=>t.jsx(r,{...n,children:s.map(e=>t.jsx(i,{icon:e.icon?e.icon:void 0,children:e.name},e.id))})}),S=m.story({render:n=>t.jsx(r,{...n,children:s.map(e=>t.jsx(i,{href:`/items/${e.id}`,children:e.name},e.id))})}),T=m.story({render:n=>t.jsx(r,{...n,children:s.map(e=>t.jsx(i,{isDisabled:e.isDisabled,children:e.name},e.id))})}),h=m.story({args:{...c.input.args},render:n=>{const[e,p]=x.useState(new Set(["travel"])),a=L({initialItems:s});return t.jsx(r,{...n,items:a.items,onRemove:o=>a.remove(...o),selectedKeys:e,onSelectionChange:p,children:o=>t.jsx(i,{children:o.name})})}}),y=m.story({args:{...c.input.args},render:n=>{const[e,p]=x.useState(new Set(["travel"])),a=L({initialItems:s});return t.jsx(r,{...n,items:a.items,onRemove:o=>a.remove(...o),selectedKeys:e,onSelectionChange:p,children:o=>t.jsx(i,{icon:o.icon?o.icon:void 0,children:o.name})})}});c.input.parameters={...c.input.parameters,docs:{...c.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    'aria-label': 'Tag Group'
  },
  render: args => <TagGroup {...args}>
      {initialList.map(item => <Tag key={item.id}>{item.name}</Tag>)}
    </TagGroup>
})`,...c.input.parameters?.docs?.source}}};l.input.parameters={...l.input.parameters,docs:{...l.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Default.input.args
  },
  render: args => <Flex direction="column">
      <TagGroup {...args}>
        {initialList.map(item => <Tag key={item.id} size="small" icon={item.icon}>
            {item.name}
          </Tag>)}
      </TagGroup>
      <TagGroup {...args}>
        {initialList.map(item => <Tag key={item.id} size="medium" icon={item.icon}>
            {item.name}
          </Tag>)}
      </TagGroup>
    </Flex>
})`,...l.input.parameters?.docs?.source}}};d.input.parameters={...d.input.parameters,docs:{...d.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    selectionMode: 'single',
    'aria-label': 'Tag Group'
  },
  render: args => {
    const [selected, setSelected] = useState<Selection>(new Set(['travel']));
    return <TagGroup<ListItem> {...args} items={initialList} selectedKeys={selected} onSelectionChange={setSelected}>
        {item => <Tag>{item.name}</Tag>}
      </TagGroup>;
  }
})`,...d.input.parameters?.docs?.source}}};u.input.parameters={...u.input.parameters,docs:{...u.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    selectionMode: 'multiple',
    'aria-label': 'Tag Group'
  },
  render: args => {
    const [selected, setSelected] = useState<Selection>(new Set(['travel', 'shopping']));
    return <TagGroup<ListItem> {...args} items={initialList} selectedKeys={selected} onSelectionChange={setSelected}>
        {item => <Tag>{item.name}</Tag>}
      </TagGroup>;
  }
})`,...u.input.parameters?.docs?.source}}};g.input.parameters={...g.input.parameters,docs:{...g.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Default.input.args
  },
  render: args => <TagGroup {...args}>
      {initialList.map(item => <Tag key={item.id} icon={item.icon ? item.icon : undefined}>
          {item.name}
        </Tag>)}
    </TagGroup>
})`,...g.input.parameters?.docs?.source}}};S.input.parameters={...S.input.parameters,docs:{...S.input.parameters?.docs,source:{originalSource:`meta.story({
  render: args => <TagGroup {...args}>
      {initialList.map(item => <Tag key={item.id} href={\`/items/\${item.id}\`}>
          {item.name}
        </Tag>)}
    </TagGroup>
})`,...S.input.parameters?.docs?.source}}};T.input.parameters={...T.input.parameters,docs:{...T.input.parameters?.docs,source:{originalSource:`meta.story({
  render: args => <TagGroup {...args}>
      {initialList.map(item => <Tag key={item.id} isDisabled={item.isDisabled}>
          {item.name}
        </Tag>)}
    </TagGroup>
})`,...T.input.parameters?.docs?.source}}};h.input.parameters={...h.input.parameters,docs:{...h.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Default.input.args
  },
  render: args => {
    const [selected, setSelected] = useState<Selection>(new Set(['travel']));
    const list = useListData<ListItem>({
      initialItems: initialList
    });
    return <TagGroup<ListItem> {...args} items={list.items} onRemove={keys => list.remove(...keys)} selectedKeys={selected} onSelectionChange={setSelected}>
        {item => <Tag>{item.name}</Tag>}
      </TagGroup>;
  }
})`,...h.input.parameters?.docs?.source}}};y.input.parameters={...y.input.parameters,docs:{...y.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Default.input.args
  },
  render: args => {
    const [selected, setSelected] = useState<Selection>(new Set(['travel']));
    const list = useListData<ListItem>({
      initialItems: initialList
    });
    return <TagGroup<ListItem> {...args} items={list.items} onRemove={keys => list.remove(...keys)} selectedKeys={selected} onSelectionChange={setSelected}>
        {item => <Tag icon={item.icon ? item.icon : undefined}>{item.name}</Tag>}
      </TagGroup>;
  }
})`,...y.input.parameters?.docs?.source}}};const he=["Default","Sizes","SelectionModeSingle","SelectionModeMultiple","WithIcon","WithLink","Disabled","RemovingTags","WithIconAndRemoveButton"];export{c as Default,T as Disabled,h as RemovingTags,u as SelectionModeMultiple,d as SelectionModeSingle,l as Sizes,g as WithIcon,y as WithIconAndRemoveButton,S as WithLink,he as __namedExportsOrder};
