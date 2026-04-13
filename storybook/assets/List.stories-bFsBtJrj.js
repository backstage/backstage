import{j as e,r as j,p as T,M as f}from"./iframe-v7Qh39PS.js";import{L as n,a as o}from"./List-BWOkK0ql.js";import{n as W,Y as A,j as I,S as K,a as C,J as D,i as G,M as v}from"./index-C2rRWsJF.js";import{T as w,a as M}from"./TagGroup-DTxpZE5s.js";import{b as x}from"./Menu-c0Yk7-R2.js";import"./preload-helper-PPVm8Dsz.js";import"./Button-CvJRoXrp.js";import"./utils-BTRkaVxP.js";import"./useObjectRef-D2k9dnBA.js";import"./Label-dqhcKEKx.js";import"./Hidden-DQKoMRUH.js";import"./useNumberFormatter-CujVYdJO.js";import"./context-DBZ4_gav.js";import"./useFocusable-RTAK5qqG.js";import"./openLink-DhJYPLui.js";import"./useLabel-EzumQXQv.js";import"./useLabels-BlAwLbEW.js";import"./useButton-DoRhoXC9.js";import"./usePress-d5tNe03t.js";import"./textSelection-BeaNrXk5.js";import"./useFocusRing-BTKZdzbY.js";import"./RSPContexts-DguNZy1G.js";import"./SelectionManager-B9ty4xJI.js";import"./useEvent-DftEYdn-.js";import"./SelectionIndicator-BecY6qs8.js";import"./useControlledState-uHAu_Mun.js";import"./ListBox-C_lUht65.js";import"./Separator-CWjVLqSf.js";import"./Text-BTRORdui.js";import"./useListState-C6C3NGo2.js";import"./useGridSelectionCheckbox-DwEDkg79.js";import"./useHighlightSelectionDescription-Dqk1M9xP.js";import"./useLocalizedStringFormatter-CDTBWl6c.js";import"./VisuallyHidden-IWS9gFxu.js";import"./ButtonIcon-C3c64jj-.js";import"./useHasTabbableChild-DFMQfWsb.js";import"./useField-C9kn4VsB.js";import"./getNodeText-BxA00fNY.js";import"./Autocomplete-DCIu0TcL.js";import"./Input-BfU2WQIl.js";import"./useFormReset-BVXhgu2X.js";import"./Form-DVx58Gd8.js";import"./Dialog-CBNZkOrD.js";import"./OverlayArrow-CIIPbG6M.js";import"./animation-bTj1KSLO.js";import"./SearchField-D_JUXTWb.js";import"./FieldError-BZSNwmfj.js";import"./Virtualizer-Np8_-FTg.js";import"./linkUtils-tKDL5Jm1.js";import"./useFilter-DWxqpTyu.js";const a=T.meta({title:"Backstage UI/List",component:n,args:{style:{width:320},"aria-label":"List"},decorators:[s=>e.jsx(f,{children:e.jsx(s,{})})]}),c=[{id:"react",label:"React",description:"A JavaScript library for building user interfaces",icon:e.jsx(W,{}),tags:["frontend","ui"]},{id:"typescript",label:"TypeScript",description:"Typed superset of JavaScript",icon:e.jsx(A,{}),tags:["typed","js"]},{id:"javascript",label:"JavaScript",description:"The language of the web",icon:e.jsx(I,{}),tags:["web"]},{id:"rust",label:"Rust",description:"Systems programming with memory safety",icon:e.jsx(K,{}),tags:["systems","fast"]},{id:"go",label:"Go",description:"Simple, fast, and reliable",icon:e.jsx(C,{}),tags:["backend"]}],R=e.jsxs(e.Fragment,{children:[e.jsx(x,{iconStart:e.jsx(D,{}),children:"Edit"}),e.jsx(x,{iconStart:e.jsx(G,{}),children:"Share"}),e.jsx(x,{iconStart:e.jsx(v,{}),color:"danger",children:"Delete"})]}),d=a.story({render:s=>e.jsx(n,{...s,items:c,children:t=>e.jsx(o,{id:t.id,children:t.label})})}),l=a.story({render:s=>e.jsx(n,{...s,items:c,children:t=>e.jsx(o,{id:t.id,icon:t.icon,children:t.label})})}),p=a.story({args:{style:{width:340}},render:s=>e.jsx(n,{...s,items:c,children:t=>e.jsx(o,{id:t.id,icon:t.icon,description:t.description,children:t.label})})}),m=a.story({render:s=>{const[t,i]=j.useState(new Set(["react"]));return e.jsx(n,{...s,items:c,selectionMode:"single",selectedKeys:t,onSelectionChange:i,children:r=>e.jsx(o,{id:r.id,children:r.label})})}}),u=a.story({render:s=>{const[t,i]=j.useState(new Set(["react"]));return e.jsx(n,{...s,items:c,selectionMode:"single",selectedKeys:t,onSelectionChange:i,children:r=>e.jsx(o,{id:r.id,icon:r.icon,children:r.label})})}}),g=a.story({render:s=>{const[t,i]=j.useState(new Set(["react","typescript"]));return e.jsx(n,{...s,items:c,selectionMode:"multiple",selectedKeys:t,onSelectionChange:i,children:r=>e.jsx(o,{id:r.id,children:r.label})})}}),S=a.story({render:s=>{const[t,i]=j.useState(new Set(["react","typescript"]));return e.jsx(n,{...s,items:c,selectionMode:"multiple",selectedKeys:t,onSelectionChange:i,children:r=>e.jsx(o,{id:r.id,icon:r.icon,children:r.label})})}}),h=a.story({render:s=>e.jsx(n,{...s,items:c,disabledKeys:["typescript","rust"],children:t=>e.jsx(o,{id:t.id,children:t.label})})}),y=a.story({args:{style:{width:420}},render:s=>e.jsx(n,{...s,items:c,children:t=>e.jsx(o,{id:t.id,icon:t.icon,menuItems:R,children:t.label})})}),L=a.story({args:{style:{width:420}},render:s=>e.jsx(n,{...s,items:c,children:t=>e.jsx(o,{id:t.id,icon:t.icon,customActions:e.jsx(w,{"aria-label":`Tags for ${t.label}`,children:t.tags.map(i=>e.jsx(M,{children:i},i))}),children:t.label})})}),b=a.story({args:{style:{width:420}},render:s=>e.jsx(n,{...s,items:c,children:t=>e.jsx(o,{id:t.id,icon:t.icon,menuItems:R,customActions:e.jsx(w,{"aria-label":`Tags for ${t.label}`,children:t.tags.map(i=>e.jsx(M,{children:i},i))}),children:t.label})})});d.input.parameters={...d.input.parameters,docs:{...d.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...b.input.parameters?.docs?.source}}};const Ce=["Default","WithIcons","WithDescription","SelectionModeSingle","SelectionModeSingleWithIcons","SelectionModeMultiple","SelectionModeMultipleWithIcons","Disabled","WithActionsMenu","WithActionsTags","WithActionsMenuAndTags"];export{d as Default,h as Disabled,g as SelectionModeMultiple,S as SelectionModeMultipleWithIcons,m as SelectionModeSingle,u as SelectionModeSingleWithIcons,y as WithActionsMenu,b as WithActionsMenuAndTags,L as WithActionsTags,p as WithDescription,l as WithIcons,Ce as __namedExportsOrder};
