import{j as e,r as j,p as T,M as f}from"./iframe-K1-r__6v.js";import{L as n,a as o}from"./List-0N0fQOn9.js";import{n as W,Y as A,j as I,S as K,a as C,J as D,i as G,M as v}from"./index-qh46O5KH.js";import{T as w,a as M}from"./TagGroup-Dzk1BjXx.js";import{b as x}from"./Menu-DJTfBRiW.js";import"./preload-helper-PPVm8Dsz.js";import"./Button-i1ES9tsK.js";import"./utils-CmXvhRmv.js";import"./useObjectRef-B6g01Sss.js";import"./Label-DB_fk5tK.js";import"./Hidden-Bruv6eby.js";import"./useGlobalListeners-hYY01nOS.js";import"./openLink-Buy5e0wx.js";import"./useLabel-DIPqeGbV.js";import"./useLabels-WOLYX76B.js";import"./number-CqVwgbk4.js";import"./I18nProvider-BOTPuHRS.js";import"./useButton-C_LWOP2v.js";import"./usePress-DFgFgQIS.js";import"./textSelection-DEpXXoD2.js";import"./useHover-BjUJEgQT.js";import"./Checkbox-CJyB13tu.js";import"./FieldError-CnXsXmD3.js";import"./Text-NxcU8Wst.js";import"./useFormValidation-DCdCyMkZ.js";import"./useField-DPkfUDN-.js";import"./useToggle-BEf7ENWW.js";import"./useFormReset-Cvno6jO2.js";import"./useToggleState-Dy2cvaSc.js";import"./useControlledState-Dy4k5Q4V.js";import"./VisuallyHidden-BRIhty-1.js";import"./useCollection-B-lXaARj.js";import"./keyboard-DxL8AXMs.js";import"./FocusScope-M2Rr-K_Q.js";import"./useEvent-CIbwz_kM.js";import"./ListBox-X8o-QJQt.js";import"./getItemCount-D3Pj2Gkt.js";import"./Autocomplete-CvG3U5A4.js";import"./useLocalizedStringFormatter-CfiXUqON.js";import"./useListState-TvB53Ymu.js";import"./useGridSelectionCheckbox-CrnPGA7n.js";import"./useHighlightSelectionDescription-cS3R6cA5.js";import"./ButtonIcon-DWm1pVea.js";import"./useHasTabbableChild-DszQujlm.js";import"./getNodeText-CULtpH0y.js";import"./useTextField-AN4s7yIJ.js";import"./Dialog-D04XGRIc.js";import"./Heading-DJVWOyt3.js";import"./useOverlayTriggerState-t3pADMOa.js";import"./animation-d11LJbXp.js";import"./SearchField-e_6EFV3S.js";import"./Virtualizer-DVvYxoxv.js";import"./useFilter-921X9CTX.js";import"./linkUtils-tKDL5Jm1.js";const a=T.meta({title:"Backstage UI/List",component:n,args:{style:{width:320},"aria-label":"List"},decorators:[i=>e.jsx(f,{children:e.jsx(i,{})})]}),c=[{id:"react",label:"React",description:"A JavaScript library for building user interfaces",icon:e.jsx(W,{}),tags:["frontend","ui"]},{id:"typescript",label:"TypeScript",description:"Typed superset of JavaScript",icon:e.jsx(A,{}),tags:["typed","js"]},{id:"javascript",label:"JavaScript",description:"The language of the web",icon:e.jsx(I,{}),tags:["web"]},{id:"rust",label:"Rust",description:"Systems programming with memory safety",icon:e.jsx(K,{}),tags:["systems","fast"]},{id:"go",label:"Go",description:"Simple, fast, and reliable",icon:e.jsx(C,{}),tags:["backend"]}],R=e.jsxs(e.Fragment,{children:[e.jsx(x,{iconStart:e.jsx(D,{}),children:"Edit"}),e.jsx(x,{iconStart:e.jsx(G,{}),children:"Share"}),e.jsx(x,{iconStart:e.jsx(v,{}),color:"danger",children:"Delete"})]}),d=a.story({render:i=>e.jsx(n,{...i,items:c,children:t=>e.jsx(o,{id:t.id,children:t.label})})}),l=a.story({render:i=>e.jsx(n,{...i,items:c,children:t=>e.jsx(o,{id:t.id,icon:t.icon,children:t.label})})}),p=a.story({args:{style:{width:340}},render:i=>e.jsx(n,{...i,items:c,children:t=>e.jsx(o,{id:t.id,icon:t.icon,description:t.description,children:t.label})})}),m=a.story({render:i=>{const[t,s]=j.useState(new Set(["react"]));return e.jsx(n,{...i,items:c,selectionMode:"single",selectedKeys:t,onSelectionChange:s,children:r=>e.jsx(o,{id:r.id,children:r.label})})}}),u=a.story({render:i=>{const[t,s]=j.useState(new Set(["react"]));return e.jsx(n,{...i,items:c,selectionMode:"single",selectedKeys:t,onSelectionChange:s,children:r=>e.jsx(o,{id:r.id,icon:r.icon,children:r.label})})}}),g=a.story({render:i=>{const[t,s]=j.useState(new Set(["react","typescript"]));return e.jsx(n,{...i,items:c,selectionMode:"multiple",selectedKeys:t,onSelectionChange:s,children:r=>e.jsx(o,{id:r.id,children:r.label})})}}),S=a.story({render:i=>{const[t,s]=j.useState(new Set(["react","typescript"]));return e.jsx(n,{...i,items:c,selectionMode:"multiple",selectedKeys:t,onSelectionChange:s,children:r=>e.jsx(o,{id:r.id,icon:r.icon,children:r.label})})}}),h=a.story({render:i=>e.jsx(n,{...i,items:c,disabledKeys:["typescript","rust"],children:t=>e.jsx(o,{id:t.id,children:t.label})})}),y=a.story({args:{style:{width:420}},render:i=>e.jsx(n,{...i,items:c,children:t=>e.jsx(o,{id:t.id,icon:t.icon,menuItems:R,children:t.label})})}),L=a.story({args:{style:{width:420}},render:i=>e.jsx(n,{...i,items:c,children:t=>e.jsx(o,{id:t.id,icon:t.icon,customActions:e.jsx(w,{"aria-label":`Tags for ${t.label}`,children:t.tags.map(s=>e.jsx(M,{children:s},s))}),children:t.label})})}),b=a.story({args:{style:{width:420}},render:i=>e.jsx(n,{...i,items:c,children:t=>e.jsx(o,{id:t.id,icon:t.icon,menuItems:R,customActions:e.jsx(w,{"aria-label":`Tags for ${t.label}`,children:t.tags.map(s=>e.jsx(M,{children:s},s))}),children:t.label})})});d.input.parameters={...d.input.parameters,docs:{...d.input.parameters?.docs,source:{originalSource:`meta.story({
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
