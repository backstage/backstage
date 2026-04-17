import{j as e,r as j,p as T,M as f}from"./iframe-BemVm3iW.js";import{L as n,a as o}from"./List-DhDF7vK0.js";import{n as W,Y as A,j as I,S as K,a as C,J as D,i as G,M as v}from"./index-CfKAs8sV.js";import{T as w,a as M}from"./TagGroup-CBwlJmio.js";import{b as x}from"./Menu-9qm8XDu5.js";import"./preload-helper-PPVm8Dsz.js";import"./Button-DUM7otWK.js";import"./utils-67UUfq9j.js";import"./useObjectRef-DNY1z9xy.js";import"./Label-CfLV2GEV.js";import"./Hidden-PdwGn6CK.js";import"./useGlobalListeners-DjNZsfXO.js";import"./openLink-DsdV9ckj.js";import"./useLabel-BKeoaEj8.js";import"./useLabels-Cns4Y3S6.js";import"./number-BY_G_BRf.js";import"./I18nProvider-KlzMPuIO.js";import"./useButton-CPe_l3Qv.js";import"./usePress-CoePygci.js";import"./textSelection-ctslQtv7.js";import"./useHover-qzmeHD-I.js";import"./Checkbox-Com7I3zj.js";import"./FieldError-Cm8-SYqK.js";import"./Text-D4cNg7sI.js";import"./useFormValidation-B11nhLHh.js";import"./useField-B3R_LXuf.js";import"./useToggle-CLwe21iO.js";import"./useFormReset-Bj_FEjdF.js";import"./useToggleState-Dr5Y2sLj.js";import"./useControlledState-65WJWsue.js";import"./VisuallyHidden-C5KQiBDM.js";import"./useCollection-ZwYVM1hp.js";import"./keyboard-hLGg7bG7.js";import"./FocusScope-BZlQ-oae.js";import"./useEvent-BrF9lIRf.js";import"./ListBox-CacS3SY5.js";import"./getItemCount-CZHdzlqw.js";import"./Autocomplete-D9aLX-8z.js";import"./useLocalizedStringFormatter-CJyK92B9.js";import"./useListState-C3hlwa42.js";import"./useGridSelectionCheckbox-DuMW0lnc.js";import"./useHighlightSelectionDescription-DoN4MRw1.js";import"./ButtonIcon-KY5U0EuZ.js";import"./useHasTabbableChild-CcrVWdXI.js";import"./getNodeText-BuqEr24H.js";import"./useTextField-FpHEC6MB.js";import"./Dialog-yHdRJ4XY.js";import"./Heading-BqekBLXw.js";import"./useOverlayTriggerState-zZRCXjnL.js";import"./animation-NzsbxN1_.js";import"./SearchField-DsIlANn3.js";import"./Virtualizer-ovgfTtFd.js";import"./useFilter-BUkeHZ4m.js";import"./linkUtils-tKDL5Jm1.js";const a=T.meta({title:"Backstage UI/List",component:n,args:{style:{width:320},"aria-label":"List"},decorators:[i=>e.jsx(f,{children:e.jsx(i,{})})]}),c=[{id:"react",label:"React",description:"A JavaScript library for building user interfaces",icon:e.jsx(W,{}),tags:["frontend","ui"]},{id:"typescript",label:"TypeScript",description:"Typed superset of JavaScript",icon:e.jsx(A,{}),tags:["typed","js"]},{id:"javascript",label:"JavaScript",description:"The language of the web",icon:e.jsx(I,{}),tags:["web"]},{id:"rust",label:"Rust",description:"Systems programming with memory safety",icon:e.jsx(K,{}),tags:["systems","fast"]},{id:"go",label:"Go",description:"Simple, fast, and reliable",icon:e.jsx(C,{}),tags:["backend"]}],R=e.jsxs(e.Fragment,{children:[e.jsx(x,{iconStart:e.jsx(D,{}),children:"Edit"}),e.jsx(x,{iconStart:e.jsx(G,{}),children:"Share"}),e.jsx(x,{iconStart:e.jsx(v,{}),color:"danger",children:"Delete"})]}),d=a.story({render:i=>e.jsx(n,{...i,items:c,children:t=>e.jsx(o,{id:t.id,children:t.label})})}),l=a.story({render:i=>e.jsx(n,{...i,items:c,children:t=>e.jsx(o,{id:t.id,icon:t.icon,children:t.label})})}),p=a.story({args:{style:{width:340}},render:i=>e.jsx(n,{...i,items:c,children:t=>e.jsx(o,{id:t.id,icon:t.icon,description:t.description,children:t.label})})}),m=a.story({render:i=>{const[t,s]=j.useState(new Set(["react"]));return e.jsx(n,{...i,items:c,selectionMode:"single",selectedKeys:t,onSelectionChange:s,children:r=>e.jsx(o,{id:r.id,children:r.label})})}}),u=a.story({render:i=>{const[t,s]=j.useState(new Set(["react"]));return e.jsx(n,{...i,items:c,selectionMode:"single",selectedKeys:t,onSelectionChange:s,children:r=>e.jsx(o,{id:r.id,icon:r.icon,children:r.label})})}}),g=a.story({render:i=>{const[t,s]=j.useState(new Set(["react","typescript"]));return e.jsx(n,{...i,items:c,selectionMode:"multiple",selectedKeys:t,onSelectionChange:s,children:r=>e.jsx(o,{id:r.id,children:r.label})})}}),S=a.story({render:i=>{const[t,s]=j.useState(new Set(["react","typescript"]));return e.jsx(n,{...i,items:c,selectionMode:"multiple",selectedKeys:t,onSelectionChange:s,children:r=>e.jsx(o,{id:r.id,icon:r.icon,children:r.label})})}}),h=a.story({render:i=>e.jsx(n,{...i,items:c,disabledKeys:["typescript","rust"],children:t=>e.jsx(o,{id:t.id,children:t.label})})}),y=a.story({args:{style:{width:420}},render:i=>e.jsx(n,{...i,items:c,children:t=>e.jsx(o,{id:t.id,icon:t.icon,menuItems:R,children:t.label})})}),L=a.story({args:{style:{width:420}},render:i=>e.jsx(n,{...i,items:c,children:t=>e.jsx(o,{id:t.id,icon:t.icon,customActions:e.jsx(w,{"aria-label":`Tags for ${t.label}`,children:t.tags.map(s=>e.jsx(M,{children:s},s))}),children:t.label})})}),b=a.story({args:{style:{width:420}},render:i=>e.jsx(n,{...i,items:c,children:t=>e.jsx(o,{id:t.id,icon:t.icon,menuItems:R,customActions:e.jsx(w,{"aria-label":`Tags for ${t.label}`,children:t.tags.map(s=>e.jsx(M,{children:s},s))}),children:t.label})})});d.input.parameters={...d.input.parameters,docs:{...d.input.parameters?.docs,source:{originalSource:`meta.story({
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
