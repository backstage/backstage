import{r as T,j as a,p as A,M as R}from"./iframe-V0mCSmm6.js";import{p as w,h as B,e as k,g as D}from"./index-B_QuoT2r.js";import{T as p,a as u}from"./TagGroup-CMytl2yG.js";import{F as C}from"./Flex-BJTDjKle.js";import{B as F}from"./BUIProvider-D-6HxlFM.js";import"./preload-helper-PPVm8Dsz.js";import"./Button-iv42sllk.js";import"./utils-BDE85oZ4.js";import"./useObjectRef-Ds30v8Tp.js";import"./Label-Cr8bMF7C.js";import"./Hidden-CLW6bt9s.js";import"./useGlobalListeners-CKMdmYgV.js";import"./openLink-C69Yx9MB.js";import"./useLabel-CR4CoWQK.js";import"./useLabels-Bih5Ckwh.js";import"./number-DAvCLclB.js";import"./I18nProvider-mLa6b5wO.js";import"./useButton-Cz5c6zxA.js";import"./usePress-CfPKhABG.js";import"./textSelection-UrLfp6UX.js";import"./useHover-CFiSx20A.js";import"./useCollection-CMnOmfnB.js";import"./keyboard-DADT6wG6.js";import"./FocusScope-Bqg3Wzq4.js";import"./useEvent-EHtBNGAY.js";import"./useControlledState-MEnSdpzT.js";import"./ListBox-lJUPLbn3.js";import"./getItemCount-DxOT-chG.js";import"./Autocomplete-Csj1k8WT.js";import"./useLocalizedStringFormatter-C-gNs3QG.js";import"./Text-Cn_gwYjP.js";import"./useListState-BR2USGJH.js";import"./useHighlightSelectionDescription-B3R99mo1.js";import"./useUpdateEffect-DKKiFlfW.js";import"./useHasTabbableChild-C1noUa7X.js";import"./useField-DGxVmDro.js";import"./getNodeText-CN4JKa7F.js";function $(o){let{initialItems:t=[],initialSelectedKeys:m,getKey:s=c=>c.id??c.key,filter:i,initialFilterText:e=""}=o,[r,n]=T.useState({items:t,selectedKeys:m==="all"?"all":new Set(m||[]),filterText:e}),l=T.useMemo(()=>i?r.items.filter(c=>i(c,r.filterText)):r.items,[r.items,r.filterText,i]);return{...r,items:l,...z({getKey:s},n),getItem(c){return r.items.find(d=>s(d)===c)}}}function z(o,t){let{cursor:m,getKey:s}=o;return{setSelectedKeys(i){t(e=>({...e,selectedKeys:i}))},addKeysToSelection(i){t(e=>e.selectedKeys==="all"?e:i==="all"?{...e,selectedKeys:"all"}:{...e,selectedKeys:new Set([...e.selectedKeys,...i])})},removeKeysFromSelection(i){t(e=>{if(i==="all")return{...e,selectedKeys:new Set};let r=e.selectedKeys==="all"?new Set(e.items.map(s)):new Set(e.selectedKeys);for(let n of i)r.delete(n);return{...e,selectedKeys:r}})},setFilterText(i){t(e=>({...e,filterText:i}))},insert(i,...e){t(r=>x(r,i,...e))},insertBefore(i,...e){t(r=>{let n=r.items.findIndex(l=>s?.(l)===i);if(n===-1)if(r.items.length===0)n=0;else return r;return x(r,n,...e)})},insertAfter(i,...e){t(r=>{let n=r.items.findIndex(l=>s?.(l)===i);if(n===-1)if(r.items.length===0)n=0;else return r;return x(r,n+1,...e)})},prepend(...i){t(e=>x(e,0,...i))},append(...i){t(e=>x(e,e.items.length,...i))},remove(...i){t(e=>{let r=new Set(i),n=e.items.filter(c=>!r.has(s(c))),l="all";if(e.selectedKeys!=="all"){l=new Set(e.selectedKeys);for(let c of i)l.delete(c)}return m==null&&n.length===0&&(l=new Set),{...e,items:n,selectedKeys:l}})},removeSelectedItems(){t(i=>{if(i.selectedKeys==="all")return{...i,items:[],selectedKeys:new Set};let e=i.selectedKeys,r=i.items.filter(n=>!e.has(s(n)));return{...i,items:r,selectedKeys:new Set}})},move(i,e){t(r=>{let n=r.items.findIndex(d=>s(d)===i);if(n===-1)return r;let l=r.items.slice(),[c]=l.splice(n,1);return l.splice(e,0,c),{...r,items:l}})},moveBefore(i,e){t(r=>{let n=r.items.findIndex(d=>s(d)===i);if(n===-1)return r;let c=(Array.isArray(e)?e:[...e]).map(d=>r.items.findIndex(S=>s(S)===d)).sort((d,S)=>d-S);return M(r,c,n)})},moveAfter(i,e){t(r=>{let n=r.items.findIndex(d=>s(d)===i);if(n===-1)return r;let c=(Array.isArray(e)?e:[...e]).map(d=>r.items.findIndex(S=>s(S)===d)).sort((d,S)=>d-S);return M(r,c,n+1)})},update(i,e){t(r=>{let n=r.items.findIndex(c=>s(c)===i);if(n===-1)return r;let l;return typeof e=="function"?l=e(r.items[n]):l=e,{...r,items:[...r.items.slice(0,n),l,...r.items.slice(n+1)]}})}}}function x(o,t,...m){return{...o,items:[...o.items.slice(0,t),...m,...o.items.slice(t)]}}function M(o,t,m){m-=t.filter(e=>e<m).length;let s=t.map(e=>({from:e,to:m++}));for(let e=0;e<s.length;e++){let r=s[e].from;for(let n=e;n<s.length;n++)s[n].from>r&&s[n].from--}for(let e=0;e<s.length;e++){let r=s[e];for(let n=s.length-1;n>e;n--){let l=s[n];l.from<r.to?r.to++:l.from++}}let i=o.items.slice();for(let e of s){let[r]=i.splice(e.from,1);i.splice(e.to,0,r)}return{...o,items:i}}const f=A.meta({title:"Backstage UI/TagGroup",component:p,argTypes:{selectionMode:{control:{type:"inline-radio"},options:["single","multiple"]},"aria-label":{control:{type:"text"}}},decorators:[o=>a.jsx(R,{children:a.jsx(F,{children:a.jsx(o,{})})})]}),g=[{id:"banana",name:"Banana",icon:a.jsx(w,{})},{id:"apple",name:"Apple",icon:a.jsx(B,{}),isDisabled:!0},{id:"orange",name:"Orange",icon:a.jsx(k,{}),isDisabled:!0},{id:"pear",name:"Pear",icon:a.jsx(D,{})},{id:"grape",name:"Grape",icon:a.jsx(w,{})},{id:"pineapple",name:"Pineapple",icon:a.jsx(k,{})},{id:"strawberry",name:"Strawberry",icon:a.jsx(D,{})}],y=f.story({args:{"aria-label":"Tag Group"},render:o=>a.jsx(p,{...o,children:g.map(t=>a.jsx(u,{children:t.name},t.id))})}),h=f.story({args:{...y.input.args},render:o=>a.jsxs(C,{direction:"column",children:[a.jsx(p,{...o,children:g.map(t=>a.jsx(u,{size:"small",icon:t.icon,children:t.name},t.id))}),a.jsx(p,{...o,children:g.map(t=>a.jsx(u,{size:"medium",icon:t.icon,children:t.name},t.id))})]})}),j=f.story({args:{selectionMode:"single","aria-label":"Tag Group"},render:o=>{const[t,m]=T.useState(new Set(["travel"]));return a.jsx(p,{...o,items:g,selectedKeys:t,onSelectionChange:m,children:s=>a.jsx(u,{children:s.name})})}}),v=f.story({args:{selectionMode:"multiple","aria-label":"Tag Group"},render:o=>{const[t,m]=T.useState(new Set(["travel","shopping"]));return a.jsx(p,{...o,items:g,selectedKeys:t,onSelectionChange:m,children:s=>a.jsx(u,{children:s.name})})}}),K=f.story({args:{...y.input.args},render:o=>a.jsx(p,{...o,children:g.map(t=>a.jsx(u,{icon:t.icon?t.icon:void 0,children:t.name},t.id))})}),G=f.story({render:o=>a.jsx(p,{...o,children:g.map(t=>a.jsx(u,{href:`/items/${t.id}`,children:t.name},t.id))})}),I=f.story({render:o=>a.jsx(p,{...o,children:g.map(t=>a.jsx(u,{isDisabled:t.isDisabled,children:t.name},t.id))})}),b=f.story({args:{...y.input.args},render:o=>{const[t,m]=T.useState(new Set(["travel"])),s=$({initialItems:g});return a.jsx(p,{...o,items:s.items,onRemove:i=>s.remove(...i),selectedKeys:t,onSelectionChange:m,children:i=>a.jsx(u,{children:i.name})})}}),L=f.story({args:{...y.input.args},render:o=>{const[t,m]=T.useState(new Set(["travel"])),s=$({initialItems:g});return a.jsx(p,{...o,items:s.items,onRemove:i=>s.remove(...i),selectedKeys:t,onSelectionChange:m,children:i=>a.jsx(u,{icon:i.icon?i.icon:void 0,children:i.name})})}});y.input.parameters={...y.input.parameters,docs:{...y.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    'aria-label': 'Tag Group'
  },
  render: args => <TagGroup {...args}>
      {initialList.map(item => <Tag key={item.id}>{item.name}</Tag>)}
    </TagGroup>
})`,...y.input.parameters?.docs?.source}}};h.input.parameters={...h.input.parameters,docs:{...h.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Default.input.args
  },
  render: args => <Flex direction="column">
      <TagGroup {...args}>
        {initialList.map(item => <Tag key={item.id} size="small" icon={item.icon}>
            {item.name}
          </Tag>)}
      </TagGroup>
      <TagGroup {...args}>
        {initialList.map(item => <Tag key={item.id} size="medium" icon={item.icon}>
            {item.name}
          </Tag>)}
      </TagGroup>
    </Flex>
})`,...h.input.parameters?.docs?.source}}};j.input.parameters={...j.input.parameters,docs:{...j.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    selectionMode: 'single',
    'aria-label': 'Tag Group'
  },
  render: args => {
    const [selected, setSelected] = useState<Selection>(new Set(['travel']));
    return <TagGroup<ListItem> {...args} items={initialList} selectedKeys={selected} onSelectionChange={setSelected}>
        {item => <Tag>{item.name}</Tag>}
      </TagGroup>;
  }
})`,...j.input.parameters?.docs?.source}}};v.input.parameters={...v.input.parameters,docs:{...v.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    selectionMode: 'multiple',
    'aria-label': 'Tag Group'
  },
  render: args => {
    const [selected, setSelected] = useState<Selection>(new Set(['travel', 'shopping']));
    return <TagGroup<ListItem> {...args} items={initialList} selectedKeys={selected} onSelectionChange={setSelected}>
        {item => <Tag>{item.name}</Tag>}
      </TagGroup>;
  }
})`,...v.input.parameters?.docs?.source}}};K.input.parameters={...K.input.parameters,docs:{...K.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Default.input.args
  },
  render: args => <TagGroup {...args}>
      {initialList.map(item => <Tag key={item.id} icon={item.icon ? item.icon : undefined}>
          {item.name}
        </Tag>)}
    </TagGroup>
})`,...K.input.parameters?.docs?.source}}};G.input.parameters={...G.input.parameters,docs:{...G.input.parameters?.docs,source:{originalSource:`meta.story({
  render: args => <TagGroup {...args}>
      {initialList.map(item => <Tag key={item.id} href={\`/items/\${item.id}\`}>
          {item.name}
        </Tag>)}
    </TagGroup>
})`,...G.input.parameters?.docs?.source}}};I.input.parameters={...I.input.parameters,docs:{...I.input.parameters?.docs,source:{originalSource:`meta.story({
  render: args => <TagGroup {...args}>
      {initialList.map(item => <Tag key={item.id} isDisabled={item.isDisabled}>
          {item.name}
        </Tag>)}
    </TagGroup>
})`,...I.input.parameters?.docs?.source}}};b.input.parameters={...b.input.parameters,docs:{...b.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Default.input.args
  },
  render: args => {
    const [selected, setSelected] = useState<Selection>(new Set(['travel']));
    const list = useListData<ListItem>({
      initialItems: initialList
    });
    return <TagGroup<ListItem> {...args} items={list.items} onRemove={keys => list.remove(...keys)} selectedKeys={selected} onSelectionChange={setSelected}>
        {item => <Tag>{item.name}</Tag>}
      </TagGroup>;
  }
})`,...b.input.parameters?.docs?.source}}};L.input.parameters={...L.input.parameters,docs:{...L.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Default.input.args
  },
  render: args => {
    const [selected, setSelected] = useState<Selection>(new Set(['travel']));
    const list = useListData<ListItem>({
      initialItems: initialList
    });
    return <TagGroup<ListItem> {...args} items={list.items} onRemove={keys => list.remove(...keys)} selectedKeys={selected} onSelectionChange={setSelected}>
        {item => <Tag icon={item.icon ? item.icon : undefined}>{item.name}</Tag>}
      </TagGroup>;
  }
})`,...L.input.parameters?.docs?.source}}};const ve=["Default","Sizes","SelectionModeSingle","SelectionModeMultiple","WithIcon","WithLink","Disabled","RemovingTags","WithIconAndRemoveButton"];export{y as Default,I as Disabled,b as RemovingTags,v as SelectionModeMultiple,j as SelectionModeSingle,h as Sizes,K as WithIcon,L as WithIconAndRemoveButton,G as WithLink,ve as __namedExportsOrder};
