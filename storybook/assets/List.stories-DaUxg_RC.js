import{bQ as e,c8 as w,c5 as T,w as f}from"./iframe-Zd-YI-2K.js";import{L as o,a as n}from"./List-B3898JSQ.js";import{z as W,l as A,w as I,i as K,x as C,b as D,v,M as G}from"./index-CirsuCpW.js";import{c as j,T as M}from"./TagGroup-NOhiW5Ep.js";import{c as x}from"./Menu-BiINBgIh.js";import"./preload-helper-PPVm8Dsz.js";import"./Button-BPK5A0ph.js";import"./utils-B9HGNt0C.js";import"./useObjectRef-CSGev21E.js";import"./Label-YhzAN0Eo.js";import"./Hidden-5-RKz3aG.js";import"./useFocusRing-B2ToGNzb.js";import"./openLink-Bn8ArFiV.js";import"./useLabel-CKKQW7cE.js";import"./useLabels-Qd-JAFm0.js";import"./number-DiAqIE8i.js";import"./I18nProvider-BhAOc9Ga.js";import"./useButton-BzU-QnhQ.js";import"./usePress-B_YcD4zB.js";import"./textSelection-P_IOG6mD.js";import"./useHover-BUmLyoKK.js";import"./Checkbox-2YaOgX3E.js";import"./FieldError-5PqzcpId.js";import"./Text-BJ1H8aMC.js";import"./useFormValidation-DCAqIXhc.js";import"./useField-Cx2viaGD.js";import"./useToggle-EUIkpi2-.js";import"./useFormReset-CiFp_S2j.js";import"./useToggleState-DHf1BqLL.js";import"./useControlledState-DInYdsj6.js";import"./VisuallyHidden-Do0nVhed.js";import"./useCollection-56kX9o5o.js";import"./keyboard-D9WPU0OD.js";import"./FocusScope-D-eoOKQj.js";import"./useEvent-Bvwyi-gT.js";import"./ListBox-CwRQCJrJ.js";import"./getItemCount-DPCKm2BS.js";import"./Autocomplete-DTC98uk5.js";import"./useLocalizedStringFormatter-1rTSaIVc.js";import"./useListState-Ba_x5rtm.js";import"./useGridSelectionCheckbox-jvP_FCRV.js";import"./useHighlightSelectionDescription-DvAQBghl.js";import"./useUpdateEffect-BJDOdxIV.js";import"./BUIRoutingProvider-C6YoxI9h.js";import"./useResolvedHref-DdfPjt6A.js";import"./ButtonIcon-8KnJDrRQ.js";import"./useHasTabbableChild-EPF6yVuS.js";import"./getNodeText-Cl4qhgiQ.js";import"./Input-DNefN7x7.js";import"./Dialog-6paZnkzR.js";import"./Heading-BJB_7RPS.js";import"./useOverlayTriggerState-B-jymaAe.js";import"./animation-BuTCjKPk.js";import"./SearchField-DHbszZZe.js";import"./useTextField-BK-HcGoi.js";import"./Virtualizer-BDEY7Q3f.js";import"./useFilter-B360iIVa.js";const a=T.meta({title:"Backstage UI/List",component:o,args:{style:{width:320},"aria-label":"List"},decorators:[i=>e.jsx(f,{children:e.jsx(i,{})})]}),c=[{id:"react",label:"React",description:"A JavaScript library for building user interfaces",icon:e.jsx(W,{}),tags:["frontend","ui"]},{id:"typescript",label:"TypeScript",description:"Typed superset of JavaScript",icon:e.jsx(A,{}),tags:["typed","js"]},{id:"javascript",label:"JavaScript",description:"The language of the web",icon:e.jsx(I,{}),tags:["web"]},{id:"rust",label:"Rust",description:"Systems programming with memory safety",icon:e.jsx(K,{}),tags:["systems","fast"]},{id:"go",label:"Go",description:"Simple, fast, and reliable",icon:e.jsx(C,{}),tags:["backend"]}],R=e.jsxs(e.Fragment,{children:[e.jsx(x,{iconStart:e.jsx(D,{}),children:"Edit"}),e.jsx(x,{iconStart:e.jsx(v,{}),children:"Share"}),e.jsx(x,{iconStart:e.jsx(G,{}),color:"danger",children:"Delete"})]}),l=a.story({render:i=>e.jsx(o,{...i,items:c,children:t=>e.jsx(n,{id:t.id,children:t.label})})}),d=a.story({render:i=>e.jsx(o,{...i,items:c,children:t=>e.jsx(n,{id:t.id,icon:t.icon,children:t.label})})}),p=a.story({args:{style:{width:340}},render:i=>e.jsx(o,{...i,items:c,children:t=>e.jsx(n,{id:t.id,icon:t.icon,description:t.description,children:t.label})})}),m=a.story({render:i=>{const[t,s]=w.useState(new Set(["react"]));return e.jsx(o,{...i,items:c,selectionMode:"single",selectedKeys:t,onSelectionChange:s,children:r=>e.jsx(n,{id:r.id,children:r.label})})}}),u=a.story({render:i=>{const[t,s]=w.useState(new Set(["react"]));return e.jsx(o,{...i,items:c,selectionMode:"single",selectedKeys:t,onSelectionChange:s,children:r=>e.jsx(n,{id:r.id,icon:r.icon,children:r.label})})}}),g=a.story({render:i=>{const[t,s]=w.useState(new Set(["react","typescript"]));return e.jsx(o,{...i,items:c,selectionMode:"multiple",selectedKeys:t,onSelectionChange:s,children:r=>e.jsx(n,{id:r.id,children:r.label})})}}),S=a.story({render:i=>{const[t,s]=w.useState(new Set(["react","typescript"]));return e.jsx(o,{...i,items:c,selectionMode:"multiple",selectedKeys:t,onSelectionChange:s,children:r=>e.jsx(n,{id:r.id,icon:r.icon,children:r.label})})}}),h=a.story({render:i=>e.jsx(o,{...i,items:c,disabledKeys:["typescript","rust"],children:t=>e.jsx(n,{id:t.id,children:t.label})})}),y=a.story({args:{style:{width:420}},render:i=>e.jsx(o,{...i,items:c,children:t=>e.jsx(n,{id:t.id,icon:t.icon,menuItems:R,children:t.label})})}),L=a.story({args:{style:{width:420}},render:i=>e.jsx(o,{...i,items:c,children:t=>e.jsx(n,{id:t.id,icon:t.icon,customActions:e.jsx(j,{"aria-label":`Tags for ${t.label}`,children:t.tags.map(s=>e.jsx(M,{children:s},s))}),children:t.label})})}),b=a.story({args:{style:{width:420}},render:i=>e.jsx(o,{...i,items:c,children:t=>e.jsx(n,{id:t.id,icon:t.icon,menuItems:R,customActions:e.jsx(j,{"aria-label":`Tags for ${t.label}`,children:t.tags.map(s=>e.jsx(M,{children:s},s))}),children:t.label})})});l.input.parameters={...l.input.parameters,docs:{...l.input.parameters?.docs,source:{originalSource:`meta.story({
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
