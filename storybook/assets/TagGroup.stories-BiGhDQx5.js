import{r as T,j as a,p as A,M as R}from"./iframe-BZbCHoUM.js";import{p as w,h as B,e as k,g as D}from"./index-BtTsKq3m.js";import{T as p,a as u}from"./TagGroup-Pue7Bw7I.js";import{F as C}from"./Flex-rox4gXnr.js";import{B as F}from"./BUIProvider-C3FBe102.js";import"./preload-helper-PPVm8Dsz.js";import"./Button-BO5hAs7f.js";import"./utils-CfGZ4Clr.js";import"./useObjectRef-FeXUk1rj.js";import"./Label-CwnVjHYj.js";import"./Hidden-DEC4QRIi.js";import"./useNumberFormatter-BSOGOm9v.js";import"./context-Binh1Hb9.js";import"./useFocusable-DMHJR1Ta.js";import"./openLink-DkamvTea.js";import"./useLabel-BQGxIH3x.js";import"./useLabels-6Oae5x4h.js";import"./useButton-CjOAcXK_.js";import"./usePress-CX5VBNce.js";import"./textSelection-D1bI-xuP.js";import"./useFocusRing-CMSP-eLx.js";import"./SelectionManager-BlWR_tcl.js";import"./useEvent-CsVv3YvT.js";import"./SelectionIndicator-BBNLkP1K.js";import"./useControlledState-_Te7eGF7.js";import"./ListBox-CoONP0uy.js";import"./Separator-DurFeesT.js";import"./RSPContexts-CQVxt2S3.js";import"./Text-CsQJ0nka.js";import"./useListState-BJxHwcbF.js";import"./useHighlightSelectionDescription-Cs8iLFur.js";import"./useLocalizedStringFormatter-B-68ChVz.js";import"./useHasTabbableChild-C7o8pIgt.js";import"./useField-1di9YIwZ.js";import"./getNodeText-BIXcWHu3.js";function $(o){let{initialItems:t=[],initialSelectedKeys:c,getKey:n=d=>{var m;return(m=d.id)!==null&&m!==void 0?m:d.key},filter:r,initialFilterText:e=""}=o,[i,s]=T.useState({items:t,selectedKeys:c==="all"?"all":new Set(c||[]),filterText:e}),l=T.useMemo(()=>r?i.items.filter(d=>r(d,i.filterText)):i.items,[i.items,i.filterText,r]);return{...i,items:l,...z({getKey:n},s),getItem(d){return i.items.find(m=>n(m)===d)}}}function z(o,t){let{cursor:c,getKey:n}=o;return{setSelectedKeys(r){t(e=>({...e,selectedKeys:r}))},addKeysToSelection(r){t(e=>e.selectedKeys==="all"?e:r==="all"?{...e,selectedKeys:"all"}:{...e,selectedKeys:new Set([...e.selectedKeys,...r])})},removeKeysFromSelection(r){t(e=>{if(r==="all")return{...e,selectedKeys:new Set};let i=e.selectedKeys==="all"?new Set(e.items.map(n)):new Set(e.selectedKeys);for(let s of r)i.delete(s);return{...e,selectedKeys:i}})},setFilterText(r){t(e=>({...e,filterText:r}))},insert(r,...e){t(i=>x(i,r,...e))},insertBefore(r,...e){t(i=>{let s=i.items.findIndex(l=>n?.(l)===r);if(s===-1)if(i.items.length===0)s=0;else return i;return x(i,s,...e)})},insertAfter(r,...e){t(i=>{let s=i.items.findIndex(l=>n?.(l)===r);if(s===-1)if(i.items.length===0)s=0;else return i;return x(i,s+1,...e)})},prepend(...r){t(e=>x(e,0,...r))},append(...r){t(e=>x(e,e.items.length,...r))},remove(...r){t(e=>{let i=new Set(r),s=e.items.filter(d=>!i.has(n(d))),l="all";if(e.selectedKeys!=="all"){l=new Set(e.selectedKeys);for(let d of r)l.delete(d)}return c==null&&s.length===0&&(l=new Set),{...e,items:s,selectedKeys:l}})},removeSelectedItems(){t(r=>{if(r.selectedKeys==="all")return{...r,items:[],selectedKeys:new Set};let e=r.selectedKeys,i=r.items.filter(s=>!e.has(n(s)));return{...r,items:i,selectedKeys:new Set}})},move(r,e){t(i=>{let s=i.items.findIndex(m=>n(m)===r);if(s===-1)return i;let l=i.items.slice(),[d]=l.splice(s,1);return l.splice(e,0,d),{...i,items:l}})},moveBefore(r,e){t(i=>{let s=i.items.findIndex(m=>n(m)===r);if(s===-1)return i;let d=(Array.isArray(e)?e:[...e]).map(m=>i.items.findIndex(S=>n(S)===m)).sort((m,S)=>m-S);return M(i,d,s)})},moveAfter(r,e){t(i=>{let s=i.items.findIndex(m=>n(m)===r);if(s===-1)return i;let d=(Array.isArray(e)?e:[...e]).map(m=>i.items.findIndex(S=>n(S)===m)).sort((m,S)=>m-S);return M(i,d,s+1)})},update(r,e){t(i=>{let s=i.items.findIndex(d=>n(d)===r);if(s===-1)return i;let l;return typeof e=="function"?l=e(i.items[s]):l=e,{...i,items:[...i.items.slice(0,s),l,...i.items.slice(s+1)]}})}}}function x(o,t,...c){return{...o,items:[...o.items.slice(0,t),...c,...o.items.slice(t)]}}function M(o,t,c){c-=t.filter(e=>e<c).length;let n=t.map(e=>({from:e,to:c++}));for(let e=0;e<n.length;e++){let i=n[e].from;for(let s=e;s<n.length;s++)n[s].from>i&&n[s].from--}for(let e=0;e<n.length;e++){let i=n[e];for(let s=n.length-1;s>e;s--){let l=n[s];l.from<i.to?i.to++:l.from++}}let r=o.items.slice();for(let e of n){let[i]=r.splice(e.from,1);r.splice(e.to,0,i)}return{...o,items:r}}const f=A.meta({title:"Backstage UI/TagGroup",component:p,argTypes:{selectionMode:{control:{type:"inline-radio"},options:["single","multiple"]},"aria-label":{control:{type:"text"}}},decorators:[o=>a.jsx(R,{children:a.jsx(F,{children:a.jsx(o,{})})})]}),g=[{id:"banana",name:"Banana",icon:a.jsx(w,{})},{id:"apple",name:"Apple",icon:a.jsx(B,{}),isDisabled:!0},{id:"orange",name:"Orange",icon:a.jsx(k,{}),isDisabled:!0},{id:"pear",name:"Pear",icon:a.jsx(D,{})},{id:"grape",name:"Grape",icon:a.jsx(w,{})},{id:"pineapple",name:"Pineapple",icon:a.jsx(k,{})},{id:"strawberry",name:"Strawberry",icon:a.jsx(D,{})}],y=f.story({args:{"aria-label":"Tag Group"},render:o=>a.jsx(p,{...o,children:g.map(t=>a.jsx(u,{children:t.name},t.id))})}),v=f.story({args:{...y.input.args},render:o=>a.jsxs(C,{direction:"column",children:[a.jsx(p,{...o,children:g.map(t=>a.jsx(u,{size:"small",icon:t.icon,children:t.name},t.id))}),a.jsx(p,{...o,children:g.map(t=>a.jsx(u,{size:"medium",icon:t.icon,children:t.name},t.id))})]})}),h=f.story({args:{selectionMode:"single","aria-label":"Tag Group"},render:o=>{const[t,c]=T.useState(new Set(["travel"]));return a.jsx(p,{...o,items:g,selectedKeys:t,onSelectionChange:c,children:n=>a.jsx(u,{children:n.name})})}}),j=f.story({args:{selectionMode:"multiple","aria-label":"Tag Group"},render:o=>{const[t,c]=T.useState(new Set(["travel","shopping"]));return a.jsx(p,{...o,items:g,selectedKeys:t,onSelectionChange:c,children:n=>a.jsx(u,{children:n.name})})}}),K=f.story({args:{...y.input.args},render:o=>a.jsx(p,{...o,children:g.map(t=>a.jsx(u,{icon:t.icon?t.icon:void 0,children:t.name},t.id))})}),G=f.story({render:o=>a.jsx(p,{...o,children:g.map(t=>a.jsx(u,{href:`/items/${t.id}`,children:t.name},t.id))})}),I=f.story({render:o=>a.jsx(p,{...o,children:g.map(t=>a.jsx(u,{isDisabled:t.isDisabled,children:t.name},t.id))})}),b=f.story({args:{...y.input.args},render:o=>{const[t,c]=T.useState(new Set(["travel"])),n=$({initialItems:g});return a.jsx(p,{...o,items:n.items,onRemove:r=>n.remove(...r),selectedKeys:t,onSelectionChange:c,children:r=>a.jsx(u,{children:r.name})})}}),L=f.story({args:{...y.input.args},render:o=>{const[t,c]=T.useState(new Set(["travel"])),n=$({initialItems:g});return a.jsx(p,{...o,items:n.items,onRemove:r=>n.remove(...r),selectedKeys:t,onSelectionChange:c,children:r=>a.jsx(u,{icon:r.icon?r.icon:void 0,children:r.name})})}});y.input.parameters={...y.input.parameters,docs:{...y.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    'aria-label': 'Tag Group'
  },
  render: args => <TagGroup {...args}>
      {initialList.map(item => <Tag key={item.id}>{item.name}</Tag>)}
    </TagGroup>
})`,...y.input.parameters?.docs?.source}}};v.input.parameters={...v.input.parameters,docs:{...v.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...v.input.parameters?.docs?.source}}};h.input.parameters={...h.input.parameters,docs:{...h.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...h.input.parameters?.docs?.source}}};j.input.parameters={...j.input.parameters,docs:{...j.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...j.input.parameters?.docs?.source}}};K.input.parameters={...K.input.parameters,docs:{...K.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...L.input.parameters?.docs?.source}}};const ve=["Default","Sizes","SelectionModeSingle","SelectionModeMultiple","WithIcon","WithLink","Disabled","RemovingTags","WithIconAndRemoveButton"];export{y as Default,I as Disabled,b as RemovingTags,j as SelectionModeMultiple,h as SelectionModeSingle,v as Sizes,K as WithIcon,L as WithIconAndRemoveButton,G as WithLink,ve as __namedExportsOrder};
