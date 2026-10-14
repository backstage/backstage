import{j as e,r as b,p as T,M as f}from"./iframe-osqb7I7f.js";import{L as o,a as n}from"./List-5hPVeWqP.js";import{n as W,Y as A,j as I,S as K,a as C,J as D,i as G,M as v}from"./index-DwIBA9cq.js";import{T as w,a as M}from"./TagGroup-upL3LCG8.js";import{M as x}from"./Menu-49fRqpFV.js";import"./preload-helper-PPVm8Dsz.js";import"./Button-BIQxkz6R.js";import"./utils-C6BeXBHQ.js";import"./useObjectRef-BZCAlVk9.js";import"./Label-Dc6bt0j8.js";import"./Hidden-BoP2pNUM.js";import"./useFocusRing-CQWExipe.js";import"./openLink-Dy9KSOrl.js";import"./useLabel-CwKyruxE.js";import"./useLabels-U9TV3Uv2.js";import"./number-RCfGZXCh.js";import"./I18nProvider-CsDtc1Vo.js";import"./useButton-BK3KpZgP.js";import"./usePress-Dn790MAk.js";import"./textSelection-jaE6bIEi.js";import"./getMetaValue-4uTB8c1-.js";import"./useHover-C6cSG5OI.js";import"./Checkbox-xzmyZHJe.js";import"./FieldError-s1w9dgOY.js";import"./Text-BtxPcA8W.js";import"./Form-4MSHWhmU.js";import"./useFormValidation-BDG5TrNG.js";import"./useField-D5QoDmxq.js";import"./useToggle-DWX1pLyE.js";import"./useFormReset-BLi1GwHW.js";import"./useSlot-TfhCDaWK.js";import"./useToggleState-BppBwgWD.js";import"./useControlledState-DMCdQE-I.js";import"./VisuallyHidden-DaXqQ9Ff.js";import"./useCollection-40RUHW7U.js";import"./keyboard-Uhp3bD4I.js";import"./FocusScope-CKCM-yJa.js";import"./useEvent-CE4CgK68.js";import"./ListBox-Bxol7Xe6.js";import"./useLoadMoreSentinel-C8XxAFFz.js";import"./Autocomplete-Cl89j45E.js";import"./useLocalizedStringFormatter-D8oGcEPo.js";import"./SelectionIndicator-DU8v45nn.js";import"./useListState-yOfcTRaq.js";import"./useGridSelectionCheckbox-D0Ldx6U0.js";import"./useHighlightSelectionDescription-DXN0pznQ.js";import"./useUpdateEffect-CW6vs1_k.js";import"./BUIRoutingProvider-ByqLAZ_I.js";import"./useResolvedHref-BAQDC_wh.js";import"./ButtonIcon-CB0cn2Eb.js";import"./useHasTabbableChild-CVosybuq.js";import"./getNodeText-CEF3bHVP.js";import"./Input-CXF4SC00.js";import"./Dialog-CMeLZcWJ.js";import"./Heading-UwJ90HiN.js";import"./useOverlayTriggerState-dYbDbyry.js";import"./animation-BsqcNdGe.js";import"./SearchField-C7ECccKL.js";import"./useTextField-nejwz2I7.js";import"./Virtualizer-D40gzUmB.js";import"./useFilter-DtlDZTx0.js";const a=T.meta({title:"Backstage UI/List",component:o,args:{style:{width:320},"aria-label":"List"},decorators:[i=>e.jsx(f,{children:e.jsx(i,{})})]}),c=[{id:"react",label:"React",description:"A JavaScript library for building user interfaces",icon:e.jsx(W,{}),tags:["frontend","ui"]},{id:"typescript",label:"TypeScript",description:"Typed superset of JavaScript",icon:e.jsx(A,{}),tags:["typed","js"]},{id:"javascript",label:"JavaScript",description:"The language of the web",icon:e.jsx(I,{}),tags:["web"]},{id:"rust",label:"Rust",description:"Systems programming with memory safety",icon:e.jsx(K,{}),tags:["systems","fast"]},{id:"go",label:"Go",description:"Simple, fast, and reliable",icon:e.jsx(C,{}),tags:["backend"]}],R=e.jsxs(e.Fragment,{children:[e.jsx(x,{iconStart:e.jsx(D,{}),children:"Edit"}),e.jsx(x,{iconStart:e.jsx(G,{}),children:"Share"}),e.jsx(x,{iconStart:e.jsx(v,{}),color:"danger",children:"Delete"})]}),d=a.story({render:i=>e.jsx(o,{...i,items:c,children:t=>e.jsx(n,{id:t.id,children:t.label})})}),l=a.story({render:i=>e.jsx(o,{...i,items:c,children:t=>e.jsx(n,{id:t.id,icon:t.icon,children:t.label})})}),p=a.story({args:{style:{width:340}},render:i=>e.jsx(o,{...i,items:c,children:t=>e.jsx(n,{id:t.id,icon:t.icon,description:t.description,children:t.label})})}),m=a.story({render:i=>{const[t,s]=b.useState(new Set(["react"]));return e.jsx(o,{...i,items:c,selectionMode:"single",selectedKeys:t,onSelectionChange:s,children:r=>e.jsx(n,{id:r.id,children:r.label})})}}),u=a.story({render:i=>{const[t,s]=b.useState(new Set(["react"]));return e.jsx(o,{...i,items:c,selectionMode:"single",selectedKeys:t,onSelectionChange:s,children:r=>e.jsx(n,{id:r.id,icon:r.icon,children:r.label})})}}),g=a.story({render:i=>{const[t,s]=b.useState(new Set(["react","typescript"]));return e.jsx(o,{...i,items:c,selectionMode:"multiple",selectedKeys:t,onSelectionChange:s,children:r=>e.jsx(n,{id:r.id,children:r.label})})}}),S=a.story({render:i=>{const[t,s]=b.useState(new Set(["react","typescript"]));return e.jsx(o,{...i,items:c,selectionMode:"multiple",selectedKeys:t,onSelectionChange:s,children:r=>e.jsx(n,{id:r.id,icon:r.icon,children:r.label})})}}),h=a.story({render:i=>e.jsx(o,{...i,items:c,disabledKeys:["typescript","rust"],children:t=>e.jsx(n,{id:t.id,children:t.label})})}),y=a.story({args:{style:{width:420}},render:i=>e.jsx(o,{...i,items:c,children:t=>e.jsx(n,{id:t.id,icon:t.icon,menuItems:R,children:t.label})})}),L=a.story({args:{style:{width:420}},render:i=>e.jsx(o,{...i,items:c,children:t=>e.jsx(n,{id:t.id,icon:t.icon,customActions:e.jsx(w,{"aria-label":`Tags for ${t.label}`,children:t.tags.map(s=>e.jsx(M,{children:s},s))}),children:t.label})})}),j=a.story({args:{style:{width:420}},render:i=>e.jsx(o,{...i,items:c,children:t=>e.jsx(n,{id:t.id,icon:t.icon,menuItems:R,customActions:e.jsx(w,{"aria-label":`Tags for ${t.label}`,children:t.tags.map(s=>e.jsx(M,{children:s},s))}),children:t.label})})});d.input.parameters={...d.input.parameters,docs:{...d.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...L.input.parameters?.docs?.source}}};j.input.parameters={...j.input.parameters,docs:{...j.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...j.input.parameters?.docs?.source}}};const Fe=["Default","WithIcons","WithDescription","SelectionModeSingle","SelectionModeSingleWithIcons","SelectionModeMultiple","SelectionModeMultipleWithIcons","Disabled","WithActionsMenu","WithActionsTags","WithActionsMenuAndTags"];export{d as Default,h as Disabled,g as SelectionModeMultiple,S as SelectionModeMultipleWithIcons,m as SelectionModeSingle,u as SelectionModeSingleWithIcons,y as WithActionsMenu,j as WithActionsMenuAndTags,L as WithActionsTags,p as WithDescription,l as WithIcons,Fe as __namedExportsOrder};
