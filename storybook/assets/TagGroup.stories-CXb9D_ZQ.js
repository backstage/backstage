import{r as T,j as a,p as A,M as R}from"./iframe-COJz9F1o.js";import{p as w,h as B,e as k,g as D}from"./index-C7YuSWIQ.js";import{T as p,a as u}from"./TagGroup-BmPwQDkV.js";import{F as C}from"./Flex-Dx7nnyxH.js";import{B as F}from"./BUIProvider-DOZKrXfq.js";import"./preload-helper-PPVm8Dsz.js";import"./Button-D6Mw4SOw.js";import"./utils-Ca8VRlnk.js";import"./useObjectRef-BVWhO1QJ.js";import"./Label-Bje3-SKc.js";import"./Hidden-BUcIqtcd.js";import"./useGlobalListeners-B-mHHtEE.js";import"./openLink-D-7XJ3Oc.js";import"./useLabel-CzB85gF3.js";import"./useLabels-DX3CMU8G.js";import"./number-DOpROmP3.js";import"./I18nProvider-Cix8lVYp.js";import"./useButton-BjPKXG4Y.js";import"./usePress-DKjqoiSZ.js";import"./textSelection-B1xIHbhq.js";import"./useHover-d8OYsWaB.js";import"./useCollection-BOqwRVgc.js";import"./keyboard-DtR6oH2F.js";import"./FocusScope-hw_VMdoM.js";import"./useEvent-ptp_askm.js";import"./useControlledState-CYGiTDAh.js";import"./ListBox-6m2MzSCF.js";import"./getItemCount-Cf5ynn4r.js";import"./Autocomplete-BXjco31v.js";import"./useLocalizedStringFormatter-Uk8SorkE.js";import"./Text-Dur_mw8s.js";import"./useListState-Dq_Xc-F9.js";import"./useHighlightSelectionDescription-BReFoVMx.js";import"./useUpdateEffect-BjB_-CTC.js";import"./useHasTabbableChild-CbzB3QCp.js";import"./useField-BrLSuq_4.js";import"./getNodeText-CtPJcKCk.js";import"./useResolvedHref-B3FbQOe8.js";function $(o){let{initialItems:t=[],initialSelectedKeys:m,getKey:s=c=>c.id??c.key,filter:i,initialFilterText:e=""}=o,[r,n]=T.useState({items:t,selectedKeys:m==="all"?"all":new Set(m||[]),filterText:e}),l=T.useMemo(()=>i?r.items.filter(c=>i(c,r.filterText)):r.items,[r.items,r.filterText,i]);return{...r,items:l,...z({getKey:s},n),getItem(c){return r.items.find(d=>s(d)===c)}}}function z(o,t){let{cursor:m,getKey:s}=o;return{setSelectedKeys(i){t(e=>({...e,selectedKeys:i}))},addKeysToSelection(i){t(e=>e.selectedKeys==="all"?e:i==="all"?{...e,selectedKeys:"all"}:{...e,selectedKeys:new Set([...e.selectedKeys,...i])})},removeKeysFromSelection(i){t(e=>{if(i==="all")return{...e,selectedKeys:new Set};let r=e.selectedKeys==="all"?new Set(e.items.map(s)):new Set(e.selectedKeys);for(let n of i)r.delete(n);return{...e,selectedKeys:r}})},setFilterText(i){t(e=>({...e,filterText:i}))},insert(i,...e){t(r=>x(r,i,...e))},insertBefore(i,...e){t(r=>{let n=r.items.findIndex(l=>s?.(l)===i);if(n===-1)if(r.items.length===0)n=0;else return r;return x(r,n,...e)})},insertAfter(i,...e){t(r=>{let n=r.items.findIndex(l=>s?.(l)===i);if(n===-1)if(r.items.length===0)n=0;else return r;return x(r,n+1,...e)})},prepend(...i){t(e=>x(e,0,...i))},append(...i){t(e=>x(e,e.items.length,...i))},remove(...i){t(e=>{let r=new Set(i),n=e.items.filter(c=>!r.has(s(c))),l="all";if(e.selectedKeys!=="all"){l=new Set(e.selectedKeys);for(let c of i)l.delete(c)}return m==null&&n.length===0&&(l=new Set),{...e,items:n,selectedKeys:l}})},removeSelectedItems(){t(i=>{if(i.selectedKeys==="all")return{...i,items:[],selectedKeys:new Set};let e=i.selectedKeys,r=i.items.filter(n=>!e.has(s(n)));return{...i,items:r,selectedKeys:new Set}})},move(i,e){t(r=>{let n=r.items.findIndex(d=>s(d)===i);if(n===-1)return r;let l=r.items.slice(),[c]=l.splice(n,1);return l.splice(e,0,c),{...r,items:l}})},moveBefore(i,e){t(r=>{let n=r.items.findIndex(d=>s(d)===i);if(n===-1)return r;let c=(Array.isArray(e)?e:[...e]).map(d=>r.items.findIndex(S=>s(S)===d)).sort((d,S)=>d-S);return M(r,c,n)})},moveAfter(i,e){t(r=>{let n=r.items.findIndex(d=>s(d)===i);if(n===-1)return r;let c=(Array.isArray(e)?e:[...e]).map(d=>r.items.findIndex(S=>s(S)===d)).sort((d,S)=>d-S);return M(r,c,n+1)})},update(i,e){t(r=>{let n=r.items.findIndex(c=>s(c)===i);if(n===-1)return r;let l;return typeof e=="function"?l=e(r.items[n]):l=e,{...r,items:[...r.items.slice(0,n),l,...r.items.slice(n+1)]}})}}}function x(o,t,...m){return{...o,items:[...o.items.slice(0,t),...m,...o.items.slice(t)]}}function M(o,t,m){m-=t.filter(e=>e<m).length;let s=t.map(e=>({from:e,to:m++}));for(let e=0;e<s.length;e++){let r=s[e].from;for(let n=e;n<s.length;n++)s[n].from>r&&s[n].from--}for(let e=0;e<s.length;e++){let r=s[e];for(let n=s.length-1;n>e;n--){let l=s[n];l.from<r.to?r.to++:l.from++}}let i=o.items.slice();for(let e of s){let[r]=i.splice(e.from,1);i.splice(e.to,0,r)}return{...o,items:i}}const f=A.meta({title:"Backstage UI/TagGroup",component:p,argTypes:{selectionMode:{control:{type:"inline-radio"},options:["single","multiple"]},"aria-label":{control:{type:"text"}}},decorators:[o=>a.jsx(R,{children:a.jsx(F,{children:a.jsx(o,{})})})]}),g=[{id:"banana",name:"Banana",icon:a.jsx(w,{})},{id:"apple",name:"Apple",icon:a.jsx(B,{}),isDisabled:!0},{id:"orange",name:"Orange",icon:a.jsx(k,{}),isDisabled:!0},{id:"pear",name:"Pear",icon:a.jsx(D,{})},{id:"grape",name:"Grape",icon:a.jsx(w,{})},{id:"pineapple",name:"Pineapple",icon:a.jsx(k,{})},{id:"strawberry",name:"Strawberry",icon:a.jsx(D,{})}],y=f.story({args:{"aria-label":"Tag Group"},render:o=>a.jsx(p,{...o,children:g.map(t=>a.jsx(u,{children:t.name},t.id))})}),h=f.story({args:{...y.input.args},render:o=>a.jsxs(C,{direction:"column",children:[a.jsx(p,{...o,children:g.map(t=>a.jsx(u,{size:"small",icon:t.icon,children:t.name},t.id))}),a.jsx(p,{...o,children:g.map(t=>a.jsx(u,{size:"medium",icon:t.icon,children:t.name},t.id))})]})}),j=f.story({args:{selectionMode:"single","aria-label":"Tag Group"},render:o=>{const[t,m]=T.useState(new Set(["travel"]));return a.jsx(p,{...o,items:g,selectedKeys:t,onSelectionChange:m,children:s=>a.jsx(u,{children:s.name})})}}),v=f.story({args:{selectionMode:"multiple","aria-label":"Tag Group"},render:o=>{const[t,m]=T.useState(new Set(["travel","shopping"]));return a.jsx(p,{...o,items:g,selectedKeys:t,onSelectionChange:m,children:s=>a.jsx(u,{children:s.name})})}}),K=f.story({args:{...y.input.args},render:o=>a.jsx(p,{...o,children:g.map(t=>a.jsx(u,{icon:t.icon?t.icon:void 0,children:t.name},t.id))})}),G=f.story({render:o=>a.jsx(p,{...o,children:g.map(t=>a.jsx(u,{href:`/items/${t.id}`,children:t.name},t.id))})}),I=f.story({render:o=>a.jsx(p,{...o,children:g.map(t=>a.jsx(u,{isDisabled:t.isDisabled,children:t.name},t.id))})}),b=f.story({args:{...y.input.args},render:o=>{const[t,m]=T.useState(new Set(["travel"])),s=$({initialItems:g});return a.jsx(p,{...o,items:s.items,onRemove:i=>s.remove(...i),selectedKeys:t,onSelectionChange:m,children:i=>a.jsx(u,{children:i.name})})}}),L=f.story({args:{...y.input.args},render:o=>{const[t,m]=T.useState(new Set(["travel"])),s=$({initialItems:g});return a.jsx(p,{...o,items:s.items,onRemove:i=>s.remove(...i),selectedKeys:t,onSelectionChange:m,children:i=>a.jsx(u,{icon:i.icon?i.icon:void 0,children:i.name})})}});y.input.parameters={...y.input.parameters,docs:{...y.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...L.input.parameters?.docs?.source}}};const Ke=["Default","Sizes","SelectionModeSingle","SelectionModeMultiple","WithIcon","WithLink","Disabled","RemovingTags","WithIconAndRemoveButton"];export{y as Default,I as Disabled,b as RemovingTags,v as SelectionModeMultiple,j as SelectionModeSingle,h as Sizes,K as WithIcon,L as WithIconAndRemoveButton,G as WithLink,Ke as __namedExportsOrder};
