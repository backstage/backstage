import{j as t,r as y,p as L}from"./iframe-CEdcshkh.js";import{T as b}from"./TestRouter-BPsjLese.js";import{a as f}from"./useListData-B0EUuoYT.js";import{e as j,f as D,h as G,g as v}from"./index-Bowgs7Nu.js";import{T as r,a as i}from"./TagGroup-D5NtLxgq.js";import{F as I}from"./Flex-STDf9iYN.js";import{B as k}from"./BUIProvider-BnOYjhiQ.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BMdILVLE.js";import"./Button-Cztc6Ql0.js";import"./utils-B3z3rPQ3.js";import"./useObjectRef-Cea8mF9S.js";import"./Label-9Olhdt6S.js";import"./Hidden-nn8Lz43U.js";import"./useFocusRing-CKR_B2iC.js";import"./useLabel-BWFl0EGX.js";import"./useLabels-B11tK9ex.js";import"./number-tjQdiso3.js";import"./I18nProvider-GWcSS_jn.js";import"./useButton-DltJ2Eig.js";import"./usePress-CLU-UWu1.js";import"./textSelection-WSwNKXEc.js";import"./getMetaValue-BMvIIQYf.js";import"./useHover-C0ptGV0J.js";import"./useCollection-BY8b1dc1.js";import"./keyboard-CcJmHJZu.js";import"./FocusScope-BMlOaqzR.js";import"./useEvent-CrCFiZpU.js";import"./useControlledState-CY36eiiU.js";import"./ListBox-CWJPYUhe.js";import"./useLoadMoreSentinel-DhzACs8q.js";import"./Autocomplete-0kwx_A17.js";import"./useLocalizedStringFormatter-Bt4wlDEw.js";import"./SelectionIndicator-A8NT-hkw.js";import"./Text-CBxuRi-e.js";import"./useListState-Bk9MfIWW.js";import"./useHighlightSelectionDescription-CBnDeNSz.js";import"./useUpdateEffect-DY7ruGe1.js";import"./useHasTabbableChild-DOyBKN9F.js";import"./useField-qlQhlPsk.js";import"./getNodeText-CxpOAKrb.js";import"./BUIRoutingProvider-C_K9tmxr.js";const m=L.meta({title:"Backstage UI/TagGroup",component:r,argTypes:{selectionMode:{control:{type:"inline-radio"},options:["single","multiple"]},"aria-label":{control:{type:"text"}}},decorators:[n=>t.jsx(b,{children:t.jsx(k,{children:t.jsx(n,{})})})]}),s=[{id:"banana",name:"Banana",icon:t.jsx(j,{})},{id:"apple",name:"Apple",icon:t.jsx(D,{}),isDisabled:!0},{id:"orange",name:"Orange",icon:t.jsx(G,{}),isDisabled:!0},{id:"pear",name:"Pear",icon:t.jsx(v,{})},{id:"grape",name:"Grape",icon:t.jsx(j,{})},{id:"pineapple",name:"Pineapple",icon:t.jsx(G,{})},{id:"strawberry",name:"Strawberry",icon:t.jsx(v,{})}],c=m.story({args:{"aria-label":"Tag Group"},render:n=>t.jsx(r,{...n,children:s.map(e=>t.jsx(i,{children:e.name},e.id))})}),l=m.story({args:{...c.input.args},render:n=>t.jsxs(I,{direction:"column",children:[t.jsx(r,{...n,children:s.map(e=>t.jsx(i,{size:"small",icon:e.icon,children:e.name},e.id))}),t.jsx(r,{...n,children:s.map(e=>t.jsx(i,{size:"medium",icon:e.icon,children:e.name},e.id))})]})}),d=m.story({args:{selectionMode:"single","aria-label":"Tag Group"},render:n=>{const[e,p]=y.useState(new Set(["travel"]));return t.jsx(r,{...n,items:s,selectedKeys:e,onSelectionChange:p,children:a=>t.jsx(i,{children:a.name})})}}),u=m.story({args:{selectionMode:"multiple","aria-label":"Tag Group"},render:n=>{const[e,p]=y.useState(new Set(["travel","shopping"]));return t.jsx(r,{...n,items:s,selectedKeys:e,onSelectionChange:p,children:a=>t.jsx(i,{children:a.name})})}}),g=m.story({args:{...c.input.args},render:n=>t.jsx(r,{...n,children:s.map(e=>t.jsx(i,{icon:e.icon?e.icon:void 0,children:e.name},e.id))})}),S=m.story({render:n=>t.jsx(r,{...n,children:s.map(e=>t.jsx(i,{href:`/items/${e.id}`,children:e.name},e.id))})}),T=m.story({render:n=>t.jsx(r,{...n,children:s.map(e=>t.jsx(i,{isDisabled:e.isDisabled,children:e.name},e.id))})}),h=m.story({args:{...c.input.args},render:n=>{const[e,p]=y.useState(new Set(["travel"])),a=f({initialItems:s});return t.jsx(r,{...n,items:a.items,onRemove:o=>a.remove(...o),selectedKeys:e,onSelectionChange:p,children:o=>t.jsx(i,{children:o.name})})}}),x=m.story({args:{...c.input.args},render:n=>{const[e,p]=y.useState(new Set(["travel"])),a=f({initialItems:s});return t.jsx(r,{...n,items:a.items,onRemove:o=>a.remove(...o),selectedKeys:e,onSelectionChange:p,children:o=>t.jsx(i,{icon:o.icon?o.icon:void 0,children:o.name})})}});c.input.parameters={...c.input.parameters,docs:{...c.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...h.input.parameters?.docs?.source}}};x.input.parameters={...x.input.parameters,docs:{...x.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...x.input.parameters?.docs?.source}}};const he=["Default","Sizes","SelectionModeSingle","SelectionModeMultiple","WithIcon","WithLink","Disabled","RemovingTags","WithIconAndRemoveButton"];export{c as Default,T as Disabled,h as RemovingTags,u as SelectionModeMultiple,d as SelectionModeSingle,l as Sizes,g as WithIcon,x as WithIconAndRemoveButton,S as WithLink,he as __namedExportsOrder};
