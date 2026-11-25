import{j as e,r as b,p as T}from"./iframe-T196ztmH.js";import{T as f}from"./TestRouter-BJWBQVfh.js";import{L as o,a as n}from"./List-BLB6T9tm.js";import{n as W,Y as A,j as I,S as K,a as C,J as D,i as G,M as v}from"./index-WrKC2aIj.js";import{T as w,a as M}from"./TagGroup-Dqzbo3T2.js";import{M as x}from"./Menu-DPLt9iBP.js";import"./preload-helper-PPVm8Dsz.js";import"./index-DQMgTQ6t.js";import"./BUIProvider-B84iVJlz.js";import"./Button-CrpaGjWm.js";import"./utils-zm3gdQCr.js";import"./useObjectRef-_dSsW1Fk.js";import"./Label-sNbExByb.js";import"./Hidden-BBV6Ld8l.js";import"./useFocusRing-DNtHiErB.js";import"./useLabel-BnuV1o8f.js";import"./useLabels-Cvihbbwm.js";import"./number-0emrtaiX.js";import"./I18nProvider-DNS4_F5r.js";import"./useButton-vSodW6MB.js";import"./usePress-C69aPbO8.js";import"./textSelection-BG3cATkn.js";import"./getMetaValue-DwQluMyN.js";import"./useHover-7-pgp0Ky.js";import"./Checkbox-BWfdb244.js";import"./FieldError-ihzqASzL.js";import"./Text-BOLLLJ4X.js";import"./Form-DCKRbBhQ.js";import"./useFormValidation-DmvJMR95.js";import"./useField-BOxSzQUy.js";import"./useToggle-B_wLNrep.js";import"./useFormReset-CwpxsAfX.js";import"./useSlot-Ca8h8w_r.js";import"./useToggleState-7HnmSsX7.js";import"./useControlledState-DuQaVgle.js";import"./VisuallyHidden-Bk28NlY7.js";import"./useCollection-CgXGU2_i.js";import"./keyboard-CJkcO-3v.js";import"./FocusScope-BHBZvOQT.js";import"./useEvent-Cke3Ncps.js";import"./ListBox-D80kzMkL.js";import"./useLoadMoreSentinel-BYi8Wya9.js";import"./Autocomplete-CjJ_F5TB.js";import"./useLocalizedStringFormatter-DlzBfcjg.js";import"./SelectionIndicator-C6tjeRgq.js";import"./useListState-B1UqO2Kz.js";import"./useGridSelectionCheckbox-CazG2a56.js";import"./useHighlightSelectionDescription-C7lnyDBS.js";import"./useUpdateEffect-wdAIFofN.js";import"./BUIRoutingProvider-DeUR7dS3.js";import"./ButtonIcon-r0XYIMXr.js";import"./useHasTabbableChild-b-jx-_89.js";import"./getNodeText-xmo2Bn7f.js";import"./Input-C-xGK98H.js";import"./Dialog-B8P1eJ4A.js";import"./Heading-VKMd5v1x.js";import"./useOverlayTriggerState-D9Xb0gJN.js";import"./animation-CpmNWIfH.js";import"./SearchField-Ydy9J2Qd.js";import"./useTextField-CB7RKCz2.js";import"./Virtualizer-D_5GC5DF.js";import"./useFilter-DzpaBCLk.js";const a=T.meta({title:"Backstage UI/List",component:o,args:{style:{width:320},"aria-label":"List"},decorators:[i=>e.jsx(f,{children:e.jsx(i,{})})]}),c=[{id:"react",label:"React",description:"A JavaScript library for building user interfaces",icon:e.jsx(W,{}),tags:["frontend","ui"]},{id:"typescript",label:"TypeScript",description:"Typed superset of JavaScript",icon:e.jsx(A,{}),tags:["typed","js"]},{id:"javascript",label:"JavaScript",description:"The language of the web",icon:e.jsx(I,{}),tags:["web"]},{id:"rust",label:"Rust",description:"Systems programming with memory safety",icon:e.jsx(K,{}),tags:["systems","fast"]},{id:"go",label:"Go",description:"Simple, fast, and reliable",icon:e.jsx(C,{}),tags:["backend"]}],R=e.jsxs(e.Fragment,{children:[e.jsx(x,{iconStart:e.jsx(D,{}),children:"Edit"}),e.jsx(x,{iconStart:e.jsx(G,{}),children:"Share"}),e.jsx(x,{iconStart:e.jsx(v,{}),color:"danger",children:"Delete"})]}),d=a.story({render:i=>e.jsx(o,{...i,items:c,children:t=>e.jsx(n,{id:t.id,children:t.label})})}),l=a.story({render:i=>e.jsx(o,{...i,items:c,children:t=>e.jsx(n,{id:t.id,icon:t.icon,children:t.label})})}),p=a.story({args:{style:{width:340}},render:i=>e.jsx(o,{...i,items:c,children:t=>e.jsx(n,{id:t.id,icon:t.icon,description:t.description,children:t.label})})}),m=a.story({render:i=>{const[t,s]=b.useState(new Set(["react"]));return e.jsx(o,{...i,items:c,selectionMode:"single",selectedKeys:t,onSelectionChange:s,children:r=>e.jsx(n,{id:r.id,children:r.label})})}}),u=a.story({render:i=>{const[t,s]=b.useState(new Set(["react"]));return e.jsx(o,{...i,items:c,selectionMode:"single",selectedKeys:t,onSelectionChange:s,children:r=>e.jsx(n,{id:r.id,icon:r.icon,children:r.label})})}}),g=a.story({render:i=>{const[t,s]=b.useState(new Set(["react","typescript"]));return e.jsx(o,{...i,items:c,selectionMode:"multiple",selectedKeys:t,onSelectionChange:s,children:r=>e.jsx(n,{id:r.id,children:r.label})})}}),S=a.story({render:i=>{const[t,s]=b.useState(new Set(["react","typescript"]));return e.jsx(o,{...i,items:c,selectionMode:"multiple",selectedKeys:t,onSelectionChange:s,children:r=>e.jsx(n,{id:r.id,icon:r.icon,children:r.label})})}}),h=a.story({render:i=>e.jsx(o,{...i,items:c,disabledKeys:["typescript","rust"],children:t=>e.jsx(n,{id:t.id,children:t.label})})}),y=a.story({args:{style:{width:420}},render:i=>e.jsx(o,{...i,items:c,children:t=>e.jsx(n,{id:t.id,icon:t.icon,menuItems:R,children:t.label})})}),L=a.story({args:{style:{width:420}},render:i=>e.jsx(o,{...i,items:c,children:t=>e.jsx(n,{id:t.id,icon:t.icon,customActions:e.jsx(w,{"aria-label":`Tags for ${t.label}`,children:t.tags.map(s=>e.jsx(M,{children:s},s))}),children:t.label})})}),j=a.story({args:{style:{width:420}},render:i=>e.jsx(o,{...i,items:c,children:t=>e.jsx(n,{id:t.id,icon:t.icon,menuItems:R,customActions:e.jsx(w,{"aria-label":`Tags for ${t.label}`,children:t.tags.map(s=>e.jsx(M,{children:s},s))}),children:t.label})})});d.input.parameters={...d.input.parameters,docs:{...d.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...j.input.parameters?.docs?.source}}};const Oe=["Default","WithIcons","WithDescription","SelectionModeSingle","SelectionModeSingleWithIcons","SelectionModeMultiple","SelectionModeMultipleWithIcons","Disabled","WithActionsMenu","WithActionsTags","WithActionsMenuAndTags"];export{d as Default,h as Disabled,g as SelectionModeMultiple,S as SelectionModeMultipleWithIcons,m as SelectionModeSingle,u as SelectionModeSingleWithIcons,y as WithActionsMenu,j as WithActionsMenuAndTags,L as WithActionsTags,p as WithDescription,l as WithIcons,Oe as __namedExportsOrder};
