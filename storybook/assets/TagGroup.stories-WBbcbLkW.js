import{j as a}from"./jsx-runtime-hv06LKfz.js";import{r as T}from"./index-D8-PC79C.js";import{n as p,o as g}from"./Menu-BTaEmCwW.js";import{I as w}from"./provider-C6Ma5UVL.js";import"./Box-BVb6FGyq.js";import"./Grid-5F3-jMFO.js";import{F as L}from"./Flex-C_LlPGvM.js";import"./Container-BDWVGwn5.js";import"./Button-DuK7rGK8.js";import"./Collapsible-MvKpiMGU.js";import"./FieldLabel-Bmb1Qquy.js";import"./ButtonIcon-Czjbh3pg.js";import"./ButtonLink-C3ySfNux.js";import"./RadioGroup-pWKy6t_x.js";import"./Tabs-DiJgBOHw.js";import"./Text-C2hFegYR.js";import"./TextField-B7gihE7X.js";import"./Tooltip-C-phT2Wk.js";import"./ScrollArea-QmcoF2ub.js";import"./SearchField-CwHyjEdM.js";import"./Link-DvAggwqx.js";import"./Select-D8aWg-w4.js";import"./Skeleton-CpBi-Xay.js";import"./Switch-Im2paJW1.js";import{M}from"./index-B7KODvs-.js";import"./clsx-B-dksMZM.js";import"./useStyles-Dc-DqJ_c.js";import"./useBaseUiId-D_SK3tu4.js";import"./Link-DKzhZnWJ.js";import"./utils-SVxEJA3c.js";import"./useFocusRing-CSBfGNH9.js";import"./usePress-BiO5y4q0.js";import"./index-DXvUqTe6.js";import"./index-BITTEREo.js";import"./Button-U0_f04OL.js";import"./Hidden-Bl3CD3Sw.js";import"./Collection-ep6p65Wv.js";import"./FocusScope-8zIF1xgC.js";import"./context-C8UuisDZ.js";import"./useControlledState-hFzvQclK.js";import"./SearchField-5B6KmH8T.js";import"./FieldError-1gSpcCTl.js";import"./useLabels-CXdioV2U.js";import"./Input-DmMKXuNi.js";import"./useFormReset-JKupIHyW.js";import"./Label-x6hg8m87.js";import"./VisuallyHidden-C9OzMNB-.js";import"./OverlayArrow-DE7RRCpW.js";import"./spacing.props-m9PQeFPu.js";import"./TextField-BWVKLr9c.js";function k(o){let{initialItems:e=[],initialSelectedKeys:c,getKey:n=d=>{var m;return(m=d.id)!==null&&m!==void 0?m:d.key},filter:i,initialFilterText:r=""}=o,[t,s]=T.useState({items:e,selectedKeys:c==="all"?"all":new Set(c||[]),filterText:r}),l=T.useMemo(()=>i?t.items.filter(d=>i(d,t.filterText)):t.items,[t.items,t.filterText,i]);return{...t,items:l,...$({getKey:n},s),getItem(d){return t.items.find(m=>n(m)===d)}}}function $(o,e){let{cursor:c,getKey:n}=o;return{setSelectedKeys(i){e(r=>({...r,selectedKeys:i}))},setFilterText(i){e(r=>({...r,filterText:i}))},insert(i,...r){e(t=>x(t,i,...r))},insertBefore(i,...r){e(t=>{let s=t.items.findIndex(l=>n?.(l)===i);if(s===-1)if(t.items.length===0)s=0;else return t;return x(t,s,...r)})},insertAfter(i,...r){e(t=>{let s=t.items.findIndex(l=>n?.(l)===i);if(s===-1)if(t.items.length===0)s=0;else return t;return x(t,s+1,...r)})},prepend(...i){e(r=>x(r,0,...i))},append(...i){e(r=>x(r,r.items.length,...i))},remove(...i){e(r=>{let t=new Set(i),s=r.items.filter(d=>!t.has(n(d))),l="all";if(r.selectedKeys!=="all"){l=new Set(r.selectedKeys);for(let d of i)l.delete(d)}return c==null&&s.length===0&&(l=new Set),{...r,items:s,selectedKeys:l}})},removeSelectedItems(){e(i=>{if(i.selectedKeys==="all")return{...i,items:[],selectedKeys:new Set};let r=i.selectedKeys,t=i.items.filter(s=>!r.has(n(s)));return{...i,items:t,selectedKeys:new Set}})},move(i,r){e(t=>{let s=t.items.findIndex(m=>n(m)===i);if(s===-1)return t;let l=t.items.slice(),[d]=l.splice(s,1);return l.splice(r,0,d),{...t,items:l}})},moveBefore(i,r){e(t=>{let s=t.items.findIndex(m=>n(m)===i);if(s===-1)return t;let d=(Array.isArray(r)?r:[...r]).map(m=>t.items.findIndex(S=>n(S)===m)).sort((m,S)=>m-S);return D(t,d,s)})},moveAfter(i,r){e(t=>{let s=t.items.findIndex(m=>n(m)===i);if(s===-1)return t;let d=(Array.isArray(r)?r:[...r]).map(m=>t.items.findIndex(S=>n(S)===m)).sort((m,S)=>m-S);return D(t,d,s+1)})},update(i,r){e(t=>{let s=t.items.findIndex(l=>n(l)===i);return s===-1?t:{...t,items:[...t.items.slice(0,s),r,...t.items.slice(s+1)]}})}}}function x(o,e,...c){return{...o,items:[...o.items.slice(0,e),...c,...o.items.slice(e)]}}function D(o,e,c){c-=e.filter(r=>r<c).length;let n=e.map(r=>({from:r,to:c++}));for(let r=0;r<n.length;r++){let t=n[r].from;for(let s=r;s<n.length;s++)n[s].from>t&&n[s].from--}for(let r=0;r<n.length;r++){let t=n[r];for(let s=n.length-1;s>r;s--){let l=n[s];l.from<t.to?t.to++:l.from++}}let i=o.items.slice();for(let r of n){let[t]=i.splice(r.from,1);i.splice(r.to,0,t)}return{...o,items:i}}const ke={title:"Backstage UI/TagGroup",component:p,argTypes:{selectionMode:{control:{type:"inline-radio"},options:["single","multiple"]},"aria-label":{control:{type:"text"}}},decorators:[o=>a.jsx(M,{children:a.jsx(o,{})})]},u=[{id:"banana",name:"Banana",icon:"bug"},{id:"apple",name:"Apple",icon:"account-circle",isDisabled:!0},{id:"orange",name:"Orange",icon:"eye",isDisabled:!0},{id:"pear",name:"Pear",icon:"heart"},{id:"grape",name:"Grape",icon:"bug"},{id:"pineapple",name:"Pineapple",icon:"eye"},{id:"strawberry",name:"Strawberry",icon:"heart"}],f={args:{"aria-label":"Tag Group"},render:o=>a.jsx(p,{...o,children:u.map(e=>a.jsx(g,{children:e.name},e.id))})},y={args:{...f.args},render:o=>a.jsxs(L,{direction:"column",children:[a.jsx(p,{...o,children:u.map(e=>a.jsx(g,{size:"small",icon:a.jsx(w,{name:e.icon}),children:e.name},e.id))}),a.jsx(p,{...o,children:u.map(e=>a.jsx(g,{size:"medium",icon:a.jsx(w,{name:e.icon}),children:e.name},e.id))})]})},h={args:{selectionMode:"single","aria-label":"Tag Group"},render:o=>{const[e,c]=T.useState(new Set(["travel"]));return a.jsx(p,{items:u,selectedKeys:e,onSelectionChange:c,...o,children:n=>a.jsx(g,{children:n.name})})}},v={args:{selectionMode:"multiple","aria-label":"Tag Group"},render:o=>{const[e,c]=T.useState(new Set(["travel","shopping"]));return a.jsx(p,{items:u,selectedKeys:e,onSelectionChange:c,...o,children:n=>a.jsx(g,{children:n.name})})}},j={args:{...f.args},render:o=>a.jsx(p,{...o,children:u.map(e=>a.jsx(g,{icon:e.icon?a.jsx(w,{name:e.icon}):void 0,children:e.name},e.id))})},G={render:o=>a.jsx(p,{...o,children:u.map(e=>a.jsx(g,{href:`/items/${e.id}`,children:e.name},e.id))})},b={render:o=>a.jsx(p,{...o,children:u.map(e=>a.jsx(g,{isDisabled:e.isDisabled,children:e.name},e.id))})},I={args:{...f.args},render:o=>{const[e,c]=T.useState(new Set(["travel"])),n=k({initialItems:u});return a.jsx(p,{items:n.items,onRemove:i=>n.remove(...i),selectedKeys:e,onSelectionChange:c,...o,children:i=>a.jsx(g,{children:i.name})})}},K={args:{...f.args},render:o=>{const[e,c]=T.useState(new Set(["travel"])),n=k({initialItems:u});return a.jsx(p,{items:n.items,onRemove:i=>n.remove(...i),selectedKeys:e,onSelectionChange:c,...o,children:i=>a.jsx(g,{icon:i.icon?a.jsx(w,{name:i.icon}):void 0,children:i.name})})}};f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    'aria-label': 'Tag Group'
  },
  render: args => <TagGroup {...args}>
      {initialList.map(item => <Tag key={item.id}>{item.name}</Tag>)}
    </TagGroup>
}`,...f.parameters?.docs?.source}}};y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args
  },
  render: args => <Flex direction="column">
      <TagGroup {...args}>
        {initialList.map(item => <Tag key={item.id} size="small" icon={<Icon name={item.icon} />}>
            {item.name}
          </Tag>)}
      </TagGroup>
      <TagGroup {...args}>
        {initialList.map(item => <Tag key={item.id} size="medium" icon={<Icon name={item.icon} />}>
            {item.name}
          </Tag>)}
      </TagGroup>
    </Flex>
}`,...y.parameters?.docs?.source}}};h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  args: {
    selectionMode: 'single',
    'aria-label': 'Tag Group'
  },
  render: args => {
    const [selected, setSelected] = useState<Selection>(new Set(['travel']));
    return <TagGroup items={initialList} selectedKeys={selected} onSelectionChange={setSelected} {...args}>
        {item => <Tag>{item.name}</Tag>}
      </TagGroup>;
  }
}`,...h.parameters?.docs?.source}}};v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  args: {
    selectionMode: 'multiple',
    'aria-label': 'Tag Group'
  },
  render: args => {
    const [selected, setSelected] = useState<Selection>(new Set(['travel', 'shopping']));
    return <TagGroup items={initialList} selectedKeys={selected} onSelectionChange={setSelected} {...args}>
        {item => <Tag>{item.name}</Tag>}
      </TagGroup>;
  }
}`,...v.parameters?.docs?.source}}};j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args
  },
  render: args => <TagGroup {...args}>
      {initialList.map(item => <Tag key={item.id} icon={item.icon ? <Icon name={item.icon} /> : undefined}>
          {item.name}
        </Tag>)}
    </TagGroup>
}`,...j.parameters?.docs?.source}}};G.parameters={...G.parameters,docs:{...G.parameters?.docs,source:{originalSource:`{
  render: args => <TagGroup {...args}>
      {initialList.map(item => <Tag key={item.id} href={\`/items/\${item.id}\`}>
          {item.name}
        </Tag>)}
    </TagGroup>
}`,...G.parameters?.docs?.source}}};b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  render: args => <TagGroup {...args}>
      {initialList.map(item => <Tag key={item.id} isDisabled={item.isDisabled}>
          {item.name}
        </Tag>)}
    </TagGroup>
}`,...b.parameters?.docs?.source}}};I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args
  },
  render: args => {
    const [selected, setSelected] = useState<Selection>(new Set(['travel']));
    const list = useListData({
      initialItems: initialList
    });
    return <TagGroup items={list.items} onRemove={keys => list.remove(...keys)} selectedKeys={selected} onSelectionChange={setSelected} {...args}>
        {item => <Tag>{item.name}</Tag>}
      </TagGroup>;
  }
}`,...I.parameters?.docs?.source}}};K.parameters={...K.parameters,docs:{...K.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args
  },
  render: args => {
    const [selected, setSelected] = useState<Selection>(new Set(['travel']));
    const list = useListData({
      initialItems: initialList
    });
    return <TagGroup items={list.items} onRemove={keys => list.remove(...keys)} selectedKeys={selected} onSelectionChange={setSelected} {...args}>
        {item => <Tag icon={item.icon ? <Icon name={item.icon} /> : undefined}>
            {item.name}
          </Tag>}
      </TagGroup>;
  }
}`,...K.parameters?.docs?.source}}};const Le=["Default","Sizes","SelectionModeSingle","SelectionModeMultiple","WithIcon","WithLink","Disabled","RemovingTags","WithIconAndRemoveButton"];export{f as Default,b as Disabled,I as RemovingTags,v as SelectionModeMultiple,h as SelectionModeSingle,y as Sizes,j as WithIcon,K as WithIconAndRemoveButton,G as WithLink,Le as __namedExportsOrder,ke as default};
