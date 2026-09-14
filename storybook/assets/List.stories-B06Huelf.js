import{bQ as e,c8 as w,c5 as T,w as f}from"./iframe-J3scbCK7.js";import{L as o,a as n}from"./List-KEE0nqWi.js";import{z as W,l as A,w as I,i as K,x as C,b as D,v,M as G}from"./index-dtgEZu1w.js";import{c as j,T as M}from"./TagGroup-DkjIeRUa.js";import{c as x}from"./Menu-B0kBJY-x.js";import"./preload-helper-PPVm8Dsz.js";import"./Button-BRjZSFG-.js";import"./utils-CXCc_oGJ.js";import"./useObjectRef-CYiyNzgW.js";import"./Label-CZdg3p-k.js";import"./Hidden-RMOzfft_.js";import"./useFocusRing-lNGJkQ5U.js";import"./openLink-BYbBBzFI.js";import"./useLabel-CdAWakw3.js";import"./useLabels-tuukLlho.js";import"./number-B1XZmGQH.js";import"./I18nProvider-BmKrAj2D.js";import"./useButton-Dz9TOBMM.js";import"./usePress-oQ0Te5kE.js";import"./textSelection-QyuURRcd.js";import"./useHover-CwRlhx06.js";import"./Checkbox-D3msLJdX.js";import"./FieldError-B0c2RKK0.js";import"./Text-DH7_sXsF.js";import"./useFormValidation-zrBOIZdf.js";import"./useField-CqTLy_Vm.js";import"./useToggle-CInpNnkM.js";import"./useFormReset-DtBlZ5rd.js";import"./useToggleState-C8TqZlYQ.js";import"./useControlledState-DShAbZI7.js";import"./VisuallyHidden-DDRaOimJ.js";import"./useCollection-CYZW3AoK.js";import"./keyboard-D2Y4eCz5.js";import"./FocusScope-CZ1AJ7eH.js";import"./useEvent-B3GM1Fij.js";import"./ListBox-UrDHST0o.js";import"./getItemCount-P9T_ZwX3.js";import"./Autocomplete--nAxv__n.js";import"./useLocalizedStringFormatter-Xrd7W-Po.js";import"./useListState-Dm4dYv4O.js";import"./useGridSelectionCheckbox-XvjPOX5j.js";import"./useHighlightSelectionDescription-CtgMay7P.js";import"./useUpdateEffect-BQj4EgDQ.js";import"./BUIRoutingProvider-jvw1N9sz.js";import"./useResolvedHref-D6E2eFAl.js";import"./ButtonIcon-DjGciNd5.js";import"./useHasTabbableChild-B7FaILbE.js";import"./getNodeText-D0CW-I5U.js";import"./Input-DPORZ8J4.js";import"./Dialog-CRe_krMo.js";import"./Heading-BmSTr2hW.js";import"./useOverlayTriggerState-Djk9kxal.js";import"./animation-CIWnDDLd.js";import"./SearchField-BMKtrOTg.js";import"./useTextField-B3ICUpsH.js";import"./Virtualizer-M75QQLvE.js";import"./useFilter-Ba4xXVuI.js";const a=T.meta({title:"Backstage UI/List",component:o,args:{style:{width:320},"aria-label":"List"},decorators:[i=>e.jsx(f,{children:e.jsx(i,{})})]}),c=[{id:"react",label:"React",description:"A JavaScript library for building user interfaces",icon:e.jsx(W,{}),tags:["frontend","ui"]},{id:"typescript",label:"TypeScript",description:"Typed superset of JavaScript",icon:e.jsx(A,{}),tags:["typed","js"]},{id:"javascript",label:"JavaScript",description:"The language of the web",icon:e.jsx(I,{}),tags:["web"]},{id:"rust",label:"Rust",description:"Systems programming with memory safety",icon:e.jsx(K,{}),tags:["systems","fast"]},{id:"go",label:"Go",description:"Simple, fast, and reliable",icon:e.jsx(C,{}),tags:["backend"]}],R=e.jsxs(e.Fragment,{children:[e.jsx(x,{iconStart:e.jsx(D,{}),children:"Edit"}),e.jsx(x,{iconStart:e.jsx(v,{}),children:"Share"}),e.jsx(x,{iconStart:e.jsx(G,{}),color:"danger",children:"Delete"})]}),l=a.story({render:i=>e.jsx(o,{...i,items:c,children:t=>e.jsx(n,{id:t.id,children:t.label})})}),d=a.story({render:i=>e.jsx(o,{...i,items:c,children:t=>e.jsx(n,{id:t.id,icon:t.icon,children:t.label})})}),p=a.story({args:{style:{width:340}},render:i=>e.jsx(o,{...i,items:c,children:t=>e.jsx(n,{id:t.id,icon:t.icon,description:t.description,children:t.label})})}),m=a.story({render:i=>{const[t,s]=w.useState(new Set(["react"]));return e.jsx(o,{...i,items:c,selectionMode:"single",selectedKeys:t,onSelectionChange:s,children:r=>e.jsx(n,{id:r.id,children:r.label})})}}),u=a.story({render:i=>{const[t,s]=w.useState(new Set(["react"]));return e.jsx(o,{...i,items:c,selectionMode:"single",selectedKeys:t,onSelectionChange:s,children:r=>e.jsx(n,{id:r.id,icon:r.icon,children:r.label})})}}),g=a.story({render:i=>{const[t,s]=w.useState(new Set(["react","typescript"]));return e.jsx(o,{...i,items:c,selectionMode:"multiple",selectedKeys:t,onSelectionChange:s,children:r=>e.jsx(n,{id:r.id,children:r.label})})}}),S=a.story({render:i=>{const[t,s]=w.useState(new Set(["react","typescript"]));return e.jsx(o,{...i,items:c,selectionMode:"multiple",selectedKeys:t,onSelectionChange:s,children:r=>e.jsx(n,{id:r.id,icon:r.icon,children:r.label})})}}),h=a.story({render:i=>e.jsx(o,{...i,items:c,disabledKeys:["typescript","rust"],children:t=>e.jsx(n,{id:t.id,children:t.label})})}),y=a.story({args:{style:{width:420}},render:i=>e.jsx(o,{...i,items:c,children:t=>e.jsx(n,{id:t.id,icon:t.icon,menuItems:R,children:t.label})})}),L=a.story({args:{style:{width:420}},render:i=>e.jsx(o,{...i,items:c,children:t=>e.jsx(n,{id:t.id,icon:t.icon,customActions:e.jsx(j,{"aria-label":`Tags for ${t.label}`,children:t.tags.map(s=>e.jsx(M,{children:s},s))}),children:t.label})})}),b=a.story({args:{style:{width:420}},render:i=>e.jsx(o,{...i,items:c,children:t=>e.jsx(n,{id:t.id,icon:t.icon,menuItems:R,customActions:e.jsx(j,{"aria-label":`Tags for ${t.label}`,children:t.tags.map(s=>e.jsx(M,{children:s},s))}),children:t.label})})});l.input.parameters={...l.input.parameters,docs:{...l.input.parameters?.docs,source:{originalSource:`meta.story({
  render: args => <List {...args} items={items}>
      {item => <ListRow id={item.id}>{item.label}</ListRow>}
    </List>
})`,...l.input.parameters?.docs?.source}}};d.input.parameters={...d.input.parameters,docs:{...d.input.parameters?.docs,source:{originalSource:`meta.story({
  render: args => <List {...args} items={items}>
      {item => <ListRow id={item.id} icon={item.icon}>
          {item.label}
        </ListRow>}
    </List>
})`,...d.input.parameters?.docs?.source}}};p.input.parameters={...p.input.parameters,docs:{...p.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    style: {
      width: 340
    }
  },
  render: args => <List {...args} items={items}>
      {item => <ListRow id={item.id} icon={item.icon} description={item.description}>
          {item.label}
        </ListRow>}
    </List>
})`,...p.input.parameters?.docs?.source}}};m.input.parameters={...m.input.parameters,docs:{...m.input.parameters?.docs,source:{originalSource:`meta.story({
  render: args => {
    const [selected, setSelected] = useState<Selection>(new Set(['react']));
    return <List {...args} items={items} selectionMode="single" selectedKeys={selected} onSelectionChange={setSelected}>
        {item => <ListRow id={item.id}>{item.label}</ListRow>}
      </List>;
  }
})`,...m.input.parameters?.docs?.source}}};u.input.parameters={...u.input.parameters,docs:{...u.input.parameters?.docs,source:{originalSource:`meta.story({
  render: args => {
    const [selected, setSelected] = useState<Selection>(new Set(['react']));
    return <List {...args} items={items} selectionMode="single" selectedKeys={selected} onSelectionChange={setSelected}>
        {item => <ListRow id={item.id} icon={item.icon}>
            {item.label}
          </ListRow>}
      </List>;
  }
})`,...u.input.parameters?.docs?.source}}};g.input.parameters={...g.input.parameters,docs:{...g.input.parameters?.docs,source:{originalSource:`meta.story({
  render: args => {
    const [selected, setSelected] = useState<Selection>(new Set(['react', 'typescript']));
    return <List {...args} items={items} selectionMode="multiple" selectedKeys={selected} onSelectionChange={setSelected}>
        {item => <ListRow id={item.id}>{item.label}</ListRow>}
      </List>;
  }
})`,...g.input.parameters?.docs?.source}}};S.input.parameters={...S.input.parameters,docs:{...S.input.parameters?.docs,source:{originalSource:`meta.story({
  render: args => {
    const [selected, setSelected] = useState<Selection>(new Set(['react', 'typescript']));
    return <List {...args} items={items} selectionMode="multiple" selectedKeys={selected} onSelectionChange={setSelected}>
        {item => <ListRow id={item.id} icon={item.icon}>
            {item.label}
          </ListRow>}
      </List>;
  }
})`,...S.input.parameters?.docs?.source}}};h.input.parameters={...h.input.parameters,docs:{...h.input.parameters?.docs,source:{originalSource:`meta.story({
  render: args => <List {...args} items={items} disabledKeys={['typescript', 'rust']}>
      {item => <ListRow id={item.id}>{item.label}</ListRow>}
    </List>
})`,...h.input.parameters?.docs?.source}}};y.input.parameters={...y.input.parameters,docs:{...y.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    style: {
      width: 420
    }
  },
  render: args => <List {...args} items={items}>
      {item => <ListRow id={item.id} icon={item.icon} menuItems={menuItems}>
          {item.label}
        </ListRow>}
    </List>
})`,...y.input.parameters?.docs?.source}}};L.input.parameters={...L.input.parameters,docs:{...L.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    style: {
      width: 420
    }
  },
  render: args => <List {...args} items={items}>
      {item => <ListRow id={item.id} icon={item.icon} customActions={<TagGroup aria-label={\`Tags for \${item.label}\`}>
              {item.tags.map(tag => <Tag key={tag}>{tag}</Tag>)}
            </TagGroup>}>
          {item.label}
        </ListRow>}
    </List>
})`,...L.input.parameters?.docs?.source}}};b.input.parameters={...b.input.parameters,docs:{...b.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    style: {
      width: 420
    }
  },
  render: args => <List {...args} items={items}>
      {item => <ListRow id={item.id} icon={item.icon} menuItems={menuItems} customActions={<TagGroup aria-label={\`Tags for \${item.label}\`}>
              {item.tags.map(tag => <Tag key={tag}>{tag}</Tag>)}
            </TagGroup>}>
          {item.label}
        </ListRow>}
    </List>
})`,...b.input.parameters?.docs?.source}}};const $e=["Default","WithIcons","WithDescription","SelectionModeSingle","SelectionModeSingleWithIcons","SelectionModeMultiple","SelectionModeMultipleWithIcons","Disabled","WithActionsMenu","WithActionsTags","WithActionsMenuAndTags"];export{l as Default,h as Disabled,g as SelectionModeMultiple,S as SelectionModeMultipleWithIcons,m as SelectionModeSingle,u as SelectionModeSingleWithIcons,y as WithActionsMenu,b as WithActionsMenuAndTags,L as WithActionsTags,p as WithDescription,d as WithIcons,$e as __namedExportsOrder};
