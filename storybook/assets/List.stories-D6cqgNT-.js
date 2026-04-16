import{j as e,r as j,p as T,M as f}from"./iframe-B7ESvRaB.js";import{L as n,a as o}from"./List-CDmMzUJ5.js";import{n as W,Y as A,j as I,S as K,a as C,J as D,i as G,M as v}from"./index-DbP8Hxod.js";import{T as w,a as M}from"./TagGroup-B5EqQLFq.js";import{b as x}from"./Menu-DCUnT5Am.js";import"./preload-helper-PPVm8Dsz.js";import"./Button-CkPxspJE.js";import"./utils-Cr8yviUJ.js";import"./useObjectRef-Dd7TU9CZ.js";import"./Label-B06uCzgg.js";import"./Hidden-CK51uwW5.js";import"./useGlobalListeners-DQLyYZ9f.js";import"./openLink-BFNE09ao.js";import"./useLabel-4lo-IT0x.js";import"./useLabels-CZf5BL8e.js";import"./number-DKEC05wv.js";import"./I18nProvider-BeIWmuaR.js";import"./useButton-DtXFNKA5.js";import"./usePress-HRSvR9KN.js";import"./textSelection-XuXSjEvl.js";import"./useHover-ByBQ7Oss.js";import"./Checkbox-3NDDesP0.js";import"./FieldError-eB_pr8Wa.js";import"./Text-DRd6SIAI.js";import"./useFormValidation-b6a5_FZR.js";import"./useField-BUR4AR8N.js";import"./useToggle-BpGVg3vF.js";import"./useFormReset-Cx4bKIVX.js";import"./useToggleState-BiY6GoWV.js";import"./useControlledState-CAbD27ky.js";import"./VisuallyHidden-BCbZC_pS.js";import"./useCollection-BY8iat3j.js";import"./keyboard-D5YIFYbX.js";import"./FocusScope-BH80Flu8.js";import"./useEvent-DHH67uGj.js";import"./ListBox-Dy1BN8xK.js";import"./getItemCount-DH8ckQTJ.js";import"./Autocomplete-CNmEvmEM.js";import"./useLocalizedStringFormatter-DDwB1B3c.js";import"./useListState-Dp5LXYnH.js";import"./useGridSelectionCheckbox-CDaOBxLT.js";import"./useHighlightSelectionDescription-Wze_4Q3S.js";import"./ButtonIcon-Be6gXqqZ.js";import"./useHasTabbableChild-DGtOQdpC.js";import"./getNodeText-C-fdRcD6.js";import"./useTextField-Cr00JWXn.js";import"./Dialog-B8ZfYxUf.js";import"./Heading-CAK7K7Ei.js";import"./useOverlayTriggerState-BQI29lrc.js";import"./animation-Dck7a-0Y.js";import"./SearchField-CNcmfNuo.js";import"./Virtualizer-BuzZbCd_.js";import"./useFilter-BTettxGt.js";import"./linkUtils-tKDL5Jm1.js";const a=T.meta({title:"Backstage UI/List",component:n,args:{style:{width:320},"aria-label":"List"},decorators:[i=>e.jsx(f,{children:e.jsx(i,{})})]}),c=[{id:"react",label:"React",description:"A JavaScript library for building user interfaces",icon:e.jsx(W,{}),tags:["frontend","ui"]},{id:"typescript",label:"TypeScript",description:"Typed superset of JavaScript",icon:e.jsx(A,{}),tags:["typed","js"]},{id:"javascript",label:"JavaScript",description:"The language of the web",icon:e.jsx(I,{}),tags:["web"]},{id:"rust",label:"Rust",description:"Systems programming with memory safety",icon:e.jsx(K,{}),tags:["systems","fast"]},{id:"go",label:"Go",description:"Simple, fast, and reliable",icon:e.jsx(C,{}),tags:["backend"]}],R=e.jsxs(e.Fragment,{children:[e.jsx(x,{iconStart:e.jsx(D,{}),children:"Edit"}),e.jsx(x,{iconStart:e.jsx(G,{}),children:"Share"}),e.jsx(x,{iconStart:e.jsx(v,{}),color:"danger",children:"Delete"})]}),d=a.story({render:i=>e.jsx(n,{...i,items:c,children:t=>e.jsx(o,{id:t.id,children:t.label})})}),l=a.story({render:i=>e.jsx(n,{...i,items:c,children:t=>e.jsx(o,{id:t.id,icon:t.icon,children:t.label})})}),p=a.story({args:{style:{width:340}},render:i=>e.jsx(n,{...i,items:c,children:t=>e.jsx(o,{id:t.id,icon:t.icon,description:t.description,children:t.label})})}),m=a.story({render:i=>{const[t,s]=j.useState(new Set(["react"]));return e.jsx(n,{...i,items:c,selectionMode:"single",selectedKeys:t,onSelectionChange:s,children:r=>e.jsx(o,{id:r.id,children:r.label})})}}),u=a.story({render:i=>{const[t,s]=j.useState(new Set(["react"]));return e.jsx(n,{...i,items:c,selectionMode:"single",selectedKeys:t,onSelectionChange:s,children:r=>e.jsx(o,{id:r.id,icon:r.icon,children:r.label})})}}),g=a.story({render:i=>{const[t,s]=j.useState(new Set(["react","typescript"]));return e.jsx(n,{...i,items:c,selectionMode:"multiple",selectedKeys:t,onSelectionChange:s,children:r=>e.jsx(o,{id:r.id,children:r.label})})}}),S=a.story({render:i=>{const[t,s]=j.useState(new Set(["react","typescript"]));return e.jsx(n,{...i,items:c,selectionMode:"multiple",selectedKeys:t,onSelectionChange:s,children:r=>e.jsx(o,{id:r.id,icon:r.icon,children:r.label})})}}),h=a.story({render:i=>e.jsx(n,{...i,items:c,disabledKeys:["typescript","rust"],children:t=>e.jsx(o,{id:t.id,children:t.label})})}),y=a.story({args:{style:{width:420}},render:i=>e.jsx(n,{...i,items:c,children:t=>e.jsx(o,{id:t.id,icon:t.icon,menuItems:R,children:t.label})})}),L=a.story({args:{style:{width:420}},render:i=>e.jsx(n,{...i,items:c,children:t=>e.jsx(o,{id:t.id,icon:t.icon,customActions:e.jsx(w,{"aria-label":`Tags for ${t.label}`,children:t.tags.map(s=>e.jsx(M,{children:s},s))}),children:t.label})})}),b=a.story({args:{style:{width:420}},render:i=>e.jsx(n,{...i,items:c,children:t=>e.jsx(o,{id:t.id,icon:t.icon,menuItems:R,customActions:e.jsx(w,{"aria-label":`Tags for ${t.label}`,children:t.tags.map(s=>e.jsx(M,{children:s},s))}),children:t.label})})});d.input.parameters={...d.input.parameters,docs:{...d.input.parameters?.docs,source:{originalSource:`meta.story({
  render: args => <List {...args} items={items}>
      {item => <ListRow id={item.id}>{item.label}</ListRow>}
    </List>
})`,...d.input.parameters?.docs?.source}}};l.input.parameters={...l.input.parameters,docs:{...l.input.parameters?.docs,source:{originalSource:`meta.story({
  render: args => <List {...args} items={items}>
      {item => <ListRow id={item.id} icon={item.icon}>
          {item.label}
        </ListRow>}
    </List>
})`,...l.input.parameters?.docs?.source}}};p.input.parameters={...p.input.parameters,docs:{...p.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...b.input.parameters?.docs?.source}}};const Je=["Default","WithIcons","WithDescription","SelectionModeSingle","SelectionModeSingleWithIcons","SelectionModeMultiple","SelectionModeMultipleWithIcons","Disabled","WithActionsMenu","WithActionsTags","WithActionsMenuAndTags"];export{d as Default,h as Disabled,g as SelectionModeMultiple,S as SelectionModeMultipleWithIcons,m as SelectionModeSingle,u as SelectionModeSingleWithIcons,y as WithActionsMenu,b as WithActionsMenuAndTags,L as WithActionsTags,p as WithDescription,l as WithIcons,Je as __namedExportsOrder};
