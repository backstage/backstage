import{r as h,j as r,a3 as y}from"./iframe-BY8lR-L8.js";import{c as f}from"./clsx-B-dksMZM.js";import{u as S}from"./useStyles-DPxfsz7Y.js";import{B as w}from"./Box-BoGdmCN9.js";import{F as G}from"./Flex-evfLyDkg.js";import"./preload-helper-PPVm8Dsz.js";const I={classNames:{root:"bui-Grid"},utilityProps:["columns","gap","m","mb","ml","mr","mt","mx","my","p","pb","pl","pr","pt","px","py"]},b={classNames:{root:"bui-GridItem"},utilityProps:["colSpan","colEnd","colStart","rowSpan"]},D={"bui-Grid":"_bui-Grid_12ez8_20"},v=h.forwardRef((s,i)=>{const{classNames:e,utilityClasses:p,style:d,cleanedProps:u}=S(I,{columns:"auto",gap:"4",...s}),{className:g,...x}=u;return r.jsx("div",{ref:i,className:f(e.root,p,D[e.root],g),style:d,...x})}),j=h.forwardRef((s,i)=>{const{classNames:e,utilityClasses:p,style:d,cleanedProps:u}=S(b,s),{className:g,...x}=u;return r.jsx("div",{ref:i,className:f(e.root,p,D[e.root],g),style:d,...x})}),o={Root:v,Item:j},m=y.meta({title:"Backstage UI/Grid",component:o.Root}),t=()=>r.jsx(w,{style:{background:"#eaf2fd",borderRadius:"4px",boxShadow:"0 0 0 1px #2563eb",height:"64px",backgroundImage:'url("data:image/svg+xml,%3Csvg%20width%3D%226%22%20height%3D%226%22%20viewBox%3D%220%200%206%206%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22%232563eb%22%20fill-opacity%3D%220.3%22%20fill-rule%3D%22evenodd%22%3E%3Cpath%20d%3D%22M5%200h1L0%206V5zM6%205v1H5z%22/%3E%3C/g%3E%3C/svg%3E")'}}),a=m.story({args:{children:r.jsxs(r.Fragment,{children:[r.jsx(t,{}),r.jsx(t,{}),r.jsx(t,{})]})}}),n=m.story({args:{...a.input.args,gap:"64px"}}),l=m.story({args:{columns:"12"},render:s=>r.jsx(G,{gap:"4",direction:"column",children:Array.from({length:11},(i,e)=>h.createElement(o.Root,{...s,key:e},r.jsx(o.Item,{colSpan:String(e+1),children:r.jsx(t,{})}),r.jsx(o.Item,{colSpan:String(11-e),children:r.jsx(t,{})})))})}),c=m.story({args:{columns:"12"},render:s=>r.jsxs(o.Root,{...s,columns:"3",children:[r.jsx(o.Item,{colSpan:"1",rowSpan:"2",children:r.jsx(w,{style:{height:"100%",background:"#eaf2fd",borderRadius:"4px",boxShadow:"0 0 0 1px #2563eb",backgroundImage:'url("data:image/svg+xml,%3Csvg%20width%3D%226%22%20height%3D%226%22%20viewBox%3D%220%200%206%206%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22%232563eb%22%20fill-opacity%3D%220.3%22%20fill-rule%3D%22evenodd%22%3E%3Cpath%20d%3D%22M5%200h1L0%206V5zM6%205v1H5z%22/%3E%3C/g%3E%3C/svg%3E")'}})}),r.jsx(o.Item,{colSpan:"2",children:r.jsx(t,{})}),r.jsx(o.Item,{colSpan:"2",children:r.jsx(t,{})})]})});a.input.parameters={...a.input.parameters,docs:{...a.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    children: <>
        <FakeBox />
        <FakeBox />
        <FakeBox />
      </>
  }
})`,...a.input.parameters?.docs?.source}}};n.input.parameters={...n.input.parameters,docs:{...n.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Default.input.args,
    gap: '64px'
  }
})`,...n.input.parameters?.docs?.source}}};l.input.parameters={...l.input.parameters,docs:{...l.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    columns: '12'
  },
  render: args => <Flex gap="4" direction="column">
      {Array.from({
      length: 11
    }, (_, i) => <Grid.Root {...args} key={i}>
          <Grid.Item colSpan={String(i + 1) as GridItemProps['colSpan']}>
            <FakeBox />
          </Grid.Item>
          <Grid.Item colSpan={String(11 - i) as GridItemProps['colSpan']}>
            <FakeBox />
          </Grid.Item>
        </Grid.Root>)}
    </Flex>
})`,...l.input.parameters?.docs?.source}}};c.input.parameters={...c.input.parameters,docs:{...c.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    columns: '12'
  },
  render: args => <Grid.Root {...args} columns="3">
      <Grid.Item colSpan="1" rowSpan="2">
        <Box style={{
        height: '100%',
        background: '#eaf2fd',
        borderRadius: '4px',
        boxShadow: '0 0 0 1px #2563eb',
        backgroundImage: 'url("data:image/svg+xml,%3Csvg%20width%3D%226%22%20height%3D%226%22%20viewBox%3D%220%200%206%206%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22%232563eb%22%20fill-opacity%3D%220.3%22%20fill-rule%3D%22evenodd%22%3E%3Cpath%20d%3D%22M5%200h1L0%206V5zM6%205v1H5z%22/%3E%3C/g%3E%3C/svg%3E")'
      }} />
      </Grid.Item>
      <Grid.Item colSpan="2">
        <FakeBox />
      </Grid.Item>
      <Grid.Item colSpan="2">
        <FakeBox />
      </Grid.Item>
    </Grid.Root>
})`,...c.input.parameters?.docs?.source}}};const z=["Default","LargeGap","ColumnSizes","RowAndColumns"];export{l as ColumnSizes,a as Default,n as LargeGap,c as RowAndColumns,z as __namedExportsOrder};
