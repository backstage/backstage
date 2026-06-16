import{bR as e,ca as w,c7 as T,w as f}from"./iframe-A5q7KvPV.js";import{L as o,a as n}from"./List-C4XxxZoJ.js";import{z as W,l as A,w as I,i as K,x as C,b as D,v,M as G}from"./index-CmJXbCwW.js";import{c as j,T as M}from"./TagGroup-Mr6Hzsfj.js";import{c as x}from"./Menu-CbFlGWHA.js";import"./preload-helper-PPVm8Dsz.js";import"./Button-XHM23BEd.js";import"./utils-Bd1To_cp.js";import"./useObjectRef-DI-R3VBW.js";import"./Label-DE0NX8eg.js";import"./Hidden-CskdN9Ng.js";import"./useFocusRing-CPnrIyn1.js";import"./openLink-Cwj0uu6r.js";import"./useLabel-Dsw_IjC-.js";import"./useLabels-CVaxSMYD.js";import"./number-D5A5VP1m.js";import"./I18nProvider-BQn_nrLl.js";import"./useButton-CnerOY6g.js";import"./usePress-eozoWKZn.js";import"./textSelection-DBqj4_Js.js";import"./useHover-BuQfyXDT.js";import"./Checkbox-ZJ4fBz7Y.js";import"./FieldError-CarArOa-.js";import"./Text-S0QT30oh.js";import"./useFormValidation-DEJ9EEyE.js";import"./useField-CE3-IKhf.js";import"./useToggle-vcAdBQOO.js";import"./useFormReset-YQ3CTLA4.js";import"./useToggleState-U8oMDeaD.js";import"./useControlledState-DL5QOA5t.js";import"./VisuallyHidden-CrRt6UY6.js";import"./useCollection-d4liYNuA.js";import"./keyboard-owTSdexX.js";import"./FocusScope-DQc1fB9P.js";import"./useEvent-gKV9J6XA.js";import"./ListBox-LHcXGeE0.js";import"./getItemCount-DSkr3rUA.js";import"./Autocomplete-Ot2MDEsQ.js";import"./useLocalizedStringFormatter-CJ3uu6qK.js";import"./useListState-C1r74yqQ.js";import"./useGridSelectionCheckbox-C9F-5aIS.js";import"./useHighlightSelectionDescription-BuRhcD60.js";import"./useUpdateEffect-DEvLpgrt.js";import"./ButtonIcon-D9MJLpnb.js";import"./useHasTabbableChild-D9oWLoTs.js";import"./getNodeText-B1prwWJV.js";import"./Input-Dx-TcgvS.js";import"./Dialog-CZGKeKw-.js";import"./Heading-RIf1nfLa.js";import"./useOverlayTriggerState-RZwt8MjL.js";import"./animation-Dikt5ULv.js";import"./SearchField-C078_e1N.js";import"./useTextField-CBLcHat9.js";import"./Virtualizer-tp4bwYfx.js";import"./useFilter-ibFzBqBC.js";const a=T.meta({title:"Backstage UI/List",component:o,args:{style:{width:320},"aria-label":"List"},decorators:[i=>e.jsx(f,{children:e.jsx(i,{})})]}),c=[{id:"react",label:"React",description:"A JavaScript library for building user interfaces",icon:e.jsx(W,{}),tags:["frontend","ui"]},{id:"typescript",label:"TypeScript",description:"Typed superset of JavaScript",icon:e.jsx(A,{}),tags:["typed","js"]},{id:"javascript",label:"JavaScript",description:"The language of the web",icon:e.jsx(I,{}),tags:["web"]},{id:"rust",label:"Rust",description:"Systems programming with memory safety",icon:e.jsx(K,{}),tags:["systems","fast"]},{id:"go",label:"Go",description:"Simple, fast, and reliable",icon:e.jsx(C,{}),tags:["backend"]}],R=e.jsxs(e.Fragment,{children:[e.jsx(x,{iconStart:e.jsx(D,{}),children:"Edit"}),e.jsx(x,{iconStart:e.jsx(v,{}),children:"Share"}),e.jsx(x,{iconStart:e.jsx(G,{}),color:"danger",children:"Delete"})]}),l=a.story({render:i=>e.jsx(o,{...i,items:c,children:t=>e.jsx(n,{id:t.id,children:t.label})})}),d=a.story({render:i=>e.jsx(o,{...i,items:c,children:t=>e.jsx(n,{id:t.id,icon:t.icon,children:t.label})})}),p=a.story({args:{style:{width:340}},render:i=>e.jsx(o,{...i,items:c,children:t=>e.jsx(n,{id:t.id,icon:t.icon,description:t.description,children:t.label})})}),m=a.story({render:i=>{const[t,s]=w.useState(new Set(["react"]));return e.jsx(o,{...i,items:c,selectionMode:"single",selectedKeys:t,onSelectionChange:s,children:r=>e.jsx(n,{id:r.id,children:r.label})})}}),u=a.story({render:i=>{const[t,s]=w.useState(new Set(["react"]));return e.jsx(o,{...i,items:c,selectionMode:"single",selectedKeys:t,onSelectionChange:s,children:r=>e.jsx(n,{id:r.id,icon:r.icon,children:r.label})})}}),g=a.story({render:i=>{const[t,s]=w.useState(new Set(["react","typescript"]));return e.jsx(o,{...i,items:c,selectionMode:"multiple",selectedKeys:t,onSelectionChange:s,children:r=>e.jsx(n,{id:r.id,children:r.label})})}}),S=a.story({render:i=>{const[t,s]=w.useState(new Set(["react","typescript"]));return e.jsx(o,{...i,items:c,selectionMode:"multiple",selectedKeys:t,onSelectionChange:s,children:r=>e.jsx(n,{id:r.id,icon:r.icon,children:r.label})})}}),h=a.story({render:i=>e.jsx(o,{...i,items:c,disabledKeys:["typescript","rust"],children:t=>e.jsx(n,{id:t.id,children:t.label})})}),y=a.story({args:{style:{width:420}},render:i=>e.jsx(o,{...i,items:c,children:t=>e.jsx(n,{id:t.id,icon:t.icon,menuItems:R,children:t.label})})}),L=a.story({args:{style:{width:420}},render:i=>e.jsx(o,{...i,items:c,children:t=>e.jsx(n,{id:t.id,icon:t.icon,customActions:e.jsx(j,{"aria-label":`Tags for ${t.label}`,children:t.tags.map(s=>e.jsx(M,{children:s},s))}),children:t.label})})}),b=a.story({args:{style:{width:420}},render:i=>e.jsx(o,{...i,items:c,children:t=>e.jsx(n,{id:t.id,icon:t.icon,menuItems:R,customActions:e.jsx(j,{"aria-label":`Tags for ${t.label}`,children:t.tags.map(s=>e.jsx(M,{children:s},s))}),children:t.label})})});l.input.parameters={...l.input.parameters,docs:{...l.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...b.input.parameters?.docs?.source}}};const Ee=["Default","WithIcons","WithDescription","SelectionModeSingle","SelectionModeSingleWithIcons","SelectionModeMultiple","SelectionModeMultipleWithIcons","Disabled","WithActionsMenu","WithActionsTags","WithActionsMenuAndTags"];export{l as Default,h as Disabled,g as SelectionModeMultiple,S as SelectionModeMultipleWithIcons,m as SelectionModeSingle,u as SelectionModeSingleWithIcons,y as WithActionsMenu,b as WithActionsMenuAndTags,L as WithActionsTags,p as WithDescription,d as WithIcons,Ee as __namedExportsOrder};
