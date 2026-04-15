import{j as e,r as j,p as T,M as f}from"./iframe-BZbCHoUM.js";import{L as n,a as o}from"./List-dFjUxvJu.js";import{n as W,Y as A,j as I,S as K,a as C,J as D,i as G,M as v}from"./index-BtTsKq3m.js";import{T as w,a as M}from"./TagGroup-Pue7Bw7I.js";import{b as x}from"./Menu-SltsdBeN.js";import"./preload-helper-PPVm8Dsz.js";import"./Button-BO5hAs7f.js";import"./utils-CfGZ4Clr.js";import"./useObjectRef-FeXUk1rj.js";import"./Label-CwnVjHYj.js";import"./Hidden-DEC4QRIi.js";import"./useNumberFormatter-BSOGOm9v.js";import"./context-Binh1Hb9.js";import"./useFocusable-DMHJR1Ta.js";import"./openLink-DkamvTea.js";import"./useLabel-BQGxIH3x.js";import"./useLabels-6Oae5x4h.js";import"./useButton-CjOAcXK_.js";import"./usePress-CX5VBNce.js";import"./textSelection-D1bI-xuP.js";import"./useFocusRing-CMSP-eLx.js";import"./RSPContexts-CQVxt2S3.js";import"./SelectionManager-BlWR_tcl.js";import"./useEvent-CsVv3YvT.js";import"./SelectionIndicator-BBNLkP1K.js";import"./useControlledState-_Te7eGF7.js";import"./ListBox-CoONP0uy.js";import"./Separator-DurFeesT.js";import"./Text-CsQJ0nka.js";import"./useListState-BJxHwcbF.js";import"./useGridSelectionCheckbox-dzHvckEF.js";import"./useHighlightSelectionDescription-Cs8iLFur.js";import"./useLocalizedStringFormatter-B-68ChVz.js";import"./VisuallyHidden-B7i-zuNG.js";import"./ButtonIcon-CjAUSuem.js";import"./useHasTabbableChild-C7o8pIgt.js";import"./useField-1di9YIwZ.js";import"./getNodeText-BIXcWHu3.js";import"./Autocomplete-C9FvD_89.js";import"./Input-ahUdMgyR.js";import"./useFormReset-B9RadbxB.js";import"./Form-C0o4Wn_y.js";import"./Dialog-93stkdky.js";import"./OverlayArrow-DLeedSyG.js";import"./animation-q4YgknDg.js";import"./SearchField-BZCyNE88.js";import"./FieldError-Z5lKC_c2.js";import"./Virtualizer-BipDhgJY.js";import"./linkUtils-tKDL5Jm1.js";import"./useFilter-DgtG9Zy0.js";const a=T.meta({title:"Backstage UI/List",component:n,args:{style:{width:320},"aria-label":"List"},decorators:[s=>e.jsx(f,{children:e.jsx(s,{})})]}),c=[{id:"react",label:"React",description:"A JavaScript library for building user interfaces",icon:e.jsx(W,{}),tags:["frontend","ui"]},{id:"typescript",label:"TypeScript",description:"Typed superset of JavaScript",icon:e.jsx(A,{}),tags:["typed","js"]},{id:"javascript",label:"JavaScript",description:"The language of the web",icon:e.jsx(I,{}),tags:["web"]},{id:"rust",label:"Rust",description:"Systems programming with memory safety",icon:e.jsx(K,{}),tags:["systems","fast"]},{id:"go",label:"Go",description:"Simple, fast, and reliable",icon:e.jsx(C,{}),tags:["backend"]}],R=e.jsxs(e.Fragment,{children:[e.jsx(x,{iconStart:e.jsx(D,{}),children:"Edit"}),e.jsx(x,{iconStart:e.jsx(G,{}),children:"Share"}),e.jsx(x,{iconStart:e.jsx(v,{}),color:"danger",children:"Delete"})]}),d=a.story({render:s=>e.jsx(n,{...s,items:c,children:t=>e.jsx(o,{id:t.id,children:t.label})})}),l=a.story({render:s=>e.jsx(n,{...s,items:c,children:t=>e.jsx(o,{id:t.id,icon:t.icon,children:t.label})})}),p=a.story({args:{style:{width:340}},render:s=>e.jsx(n,{...s,items:c,children:t=>e.jsx(o,{id:t.id,icon:t.icon,description:t.description,children:t.label})})}),m=a.story({render:s=>{const[t,i]=j.useState(new Set(["react"]));return e.jsx(n,{...s,items:c,selectionMode:"single",selectedKeys:t,onSelectionChange:i,children:r=>e.jsx(o,{id:r.id,children:r.label})})}}),u=a.story({render:s=>{const[t,i]=j.useState(new Set(["react"]));return e.jsx(n,{...s,items:c,selectionMode:"single",selectedKeys:t,onSelectionChange:i,children:r=>e.jsx(o,{id:r.id,icon:r.icon,children:r.label})})}}),g=a.story({render:s=>{const[t,i]=j.useState(new Set(["react","typescript"]));return e.jsx(n,{...s,items:c,selectionMode:"multiple",selectedKeys:t,onSelectionChange:i,children:r=>e.jsx(o,{id:r.id,children:r.label})})}}),S=a.story({render:s=>{const[t,i]=j.useState(new Set(["react","typescript"]));return e.jsx(n,{...s,items:c,selectionMode:"multiple",selectedKeys:t,onSelectionChange:i,children:r=>e.jsx(o,{id:r.id,icon:r.icon,children:r.label})})}}),h=a.story({render:s=>e.jsx(n,{...s,items:c,disabledKeys:["typescript","rust"],children:t=>e.jsx(o,{id:t.id,children:t.label})})}),y=a.story({args:{style:{width:420}},render:s=>e.jsx(n,{...s,items:c,children:t=>e.jsx(o,{id:t.id,icon:t.icon,menuItems:R,children:t.label})})}),L=a.story({args:{style:{width:420}},render:s=>e.jsx(n,{...s,items:c,children:t=>e.jsx(o,{id:t.id,icon:t.icon,customActions:e.jsx(w,{"aria-label":`Tags for ${t.label}`,children:t.tags.map(i=>e.jsx(M,{children:i},i))}),children:t.label})})}),b=a.story({args:{style:{width:420}},render:s=>e.jsx(n,{...s,items:c,children:t=>e.jsx(o,{id:t.id,icon:t.icon,menuItems:R,customActions:e.jsx(w,{"aria-label":`Tags for ${t.label}`,children:t.tags.map(i=>e.jsx(M,{children:i},i))}),children:t.label})})});d.input.parameters={...d.input.parameters,docs:{...d.input.parameters?.docs,source:{originalSource:`meta.story({
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
