import{bR as t,ca as x,c7 as b,w as f}from"./iframe-Bm5ba6Eo.js";import{$ as L}from"./useListData-QaZbIzJE.js";import{Y as j,L as D,k as G,t as v}from"./index-CvgDpp5W.js";import{c as r,T as i}from"./TagGroup-hfYbpnLq.js";import{F as I}from"./Flex-CJJjo3o-.js";import{B as k}from"./BUIProvider-BToDF3TK.js";import"./preload-helper-PPVm8Dsz.js";import"./Button-DQNqlcud.js";import"./utils-6JHcszxz.js";import"./useObjectRef--OGAdRX4.js";import"./Label-DY58aZxy.js";import"./Hidden-BsS8bYU7.js";import"./useFocusRing-pVGFXoDo.js";import"./openLink-B3PKQziN.js";import"./useLabel-CioGoMcV.js";import"./useLabels-BjdHlKX9.js";import"./number-i5bTXygz.js";import"./I18nProvider-Bs_Dburj.js";import"./useButton-5MOeMbef.js";import"./usePress-CKNoHEcf.js";import"./textSelection-B3oHrBsf.js";import"./useHover-BTqfxkN_.js";import"./useCollection-HldmDXHz.js";import"./keyboard-CfEZ52uC.js";import"./FocusScope-CR1y382h.js";import"./useEvent-BsoZAZmF.js";import"./useControlledState-C1wfIORH.js";import"./ListBox-DK_quA4C.js";import"./getItemCount-DYn-VD-2.js";import"./Autocomplete-DLryka1G.js";import"./useLocalizedStringFormatter-LuBD_Ap4.js";import"./Text-B1aMhdj3.js";import"./useListState-Dhevo4OT.js";import"./useHighlightSelectionDescription-DoCdGwm7.js";import"./useUpdateEffect-DXN4abC-.js";import"./useHasTabbableChild-CYOVVKvA.js";import"./useField-4sm3jRhu.js";import"./getNodeText-CnYVy7Xh.js";import"./useResolvedHref-DYKBvNag.js";const c=b.meta({title:"Backstage UI/TagGroup",component:r,argTypes:{selectionMode:{control:{type:"inline-radio"},options:["single","multiple"]},"aria-label":{control:{type:"text"}}},decorators:[n=>t.jsx(f,{children:t.jsx(k,{children:t.jsx(n,{})})})]}),s=[{id:"banana",name:"Banana",icon:t.jsx(j,{})},{id:"apple",name:"Apple",icon:t.jsx(D,{}),isDisabled:!0},{id:"orange",name:"Orange",icon:t.jsx(G,{}),isDisabled:!0},{id:"pear",name:"Pear",icon:t.jsx(v,{})},{id:"grape",name:"Grape",icon:t.jsx(j,{})},{id:"pineapple",name:"Pineapple",icon:t.jsx(G,{})},{id:"strawberry",name:"Strawberry",icon:t.jsx(v,{})}],m=c.story({args:{"aria-label":"Tag Group"},render:n=>t.jsx(r,{...n,children:s.map(e=>t.jsx(i,{children:e.name},e.id))})}),l=c.story({args:{...m.input.args},render:n=>t.jsxs(I,{direction:"column",children:[t.jsx(r,{...n,children:s.map(e=>t.jsx(i,{size:"small",icon:e.icon,children:e.name},e.id))}),t.jsx(r,{...n,children:s.map(e=>t.jsx(i,{size:"medium",icon:e.icon,children:e.name},e.id))})]})}),d=c.story({args:{selectionMode:"single","aria-label":"Tag Group"},render:n=>{const[e,p]=x.useState(new Set(["travel"]));return t.jsx(r,{...n,items:s,selectedKeys:e,onSelectionChange:p,children:a=>t.jsx(i,{children:a.name})})}}),u=c.story({args:{selectionMode:"multiple","aria-label":"Tag Group"},render:n=>{const[e,p]=x.useState(new Set(["travel","shopping"]));return t.jsx(r,{...n,items:s,selectedKeys:e,onSelectionChange:p,children:a=>t.jsx(i,{children:a.name})})}}),g=c.story({args:{...m.input.args},render:n=>t.jsx(r,{...n,children:s.map(e=>t.jsx(i,{icon:e.icon?e.icon:void 0,children:e.name},e.id))})}),S=c.story({render:n=>t.jsx(r,{...n,children:s.map(e=>t.jsx(i,{href:`/items/${e.id}`,children:e.name},e.id))})}),T=c.story({render:n=>t.jsx(r,{...n,children:s.map(e=>t.jsx(i,{isDisabled:e.isDisabled,children:e.name},e.id))})}),y=c.story({args:{...m.input.args},render:n=>{const[e,p]=x.useState(new Set(["travel"])),a=L({initialItems:s});return t.jsx(r,{...n,items:a.items,onRemove:o=>a.remove(...o),selectedKeys:e,onSelectionChange:p,children:o=>t.jsx(i,{children:o.name})})}}),h=c.story({args:{...m.input.args},render:n=>{const[e,p]=x.useState(new Set(["travel"])),a=L({initialItems:s});return t.jsx(r,{...n,items:a.items,onRemove:o=>a.remove(...o),selectedKeys:e,onSelectionChange:p,children:o=>t.jsx(i,{icon:o.icon?o.icon:void 0,children:o.name})})}});m.input.parameters={...m.input.parameters,docs:{...m.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    'aria-label': 'Tag Group'
  },
  render: args => <TagGroup {...args}>
      {initialList.map(item => <Tag key={item.id}>{item.name}</Tag>)}
    </TagGroup>
})`,...m.input.parameters?.docs?.source}}};l.input.parameters={...l.input.parameters,docs:{...l.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...T.input.parameters?.docs?.source}}};y.input.parameters={...y.input.parameters,docs:{...y.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...y.input.parameters?.docs?.source}}};h.input.parameters={...h.input.parameters,docs:{...h.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...h.input.parameters?.docs?.source}}};const ge=["Default","Sizes","SelectionModeSingle","SelectionModeMultiple","WithIcon","WithLink","Disabled","RemovingTags","WithIconAndRemoveButton"];export{m as Default,T as Disabled,y as RemovingTags,u as SelectionModeMultiple,d as SelectionModeSingle,l as Sizes,g as WithIcon,h as WithIconAndRemoveButton,S as WithLink,ge as __namedExportsOrder};
