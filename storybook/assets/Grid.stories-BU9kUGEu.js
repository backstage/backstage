import{r as u,j as r}from"./iframe-CA0Xqitl.js";import{c as h}from"./clsx-B-dksMZM.js";import{u as f}from"./useStyles-DWCTEpsL.js";import{B as S}from"./Box-TuEfIAW3.js";import{F as w}from"./Flex-UeRHtQGJ.js";import"./preload-helper-PPVm8Dsz.js";const G={classNames:{root:"bui-Grid"},utilityProps:["columns","gap","m","mb","ml","mr","mt","mx","my","p","pb","pl","pr","pt","px","py"]},I={classNames:{root:"bui-GridItem"},utilityProps:["colSpan","colEnd","colStart","rowSpan"]},D={"bui-Grid":"_bui-Grid_12ez8_20"},b=u.forwardRef((s,n)=>{const{classNames:e,utilityClasses:d,style:m,cleanedProps:p}=f(G,{columns:"auto",gap:"4",...s}),{className:g,...x}=p;return r.jsx("div",{ref:n,className:h(e.root,d,D[e.root],g),style:m,...x})}),v=u.forwardRef((s,n)=>{const{classNames:e,utilityClasses:d,style:m,cleanedProps:p}=f(I,s),{className:g,...x}=p;return r.jsx("div",{ref:n,className:h(e.root,d,D[e.root],g),style:m,...x})}),o={Root:b,Item:v},B={title:"Backstage UI/Grid",component:o.Root},a=()=>r.jsx(S,{style:{background:"#eaf2fd",borderRadius:"4px",boxShadow:"0 0 0 1px #2563eb",height:"64px",backgroundImage:'url("data:image/svg+xml,%3Csvg%20width%3D%226%22%20height%3D%226%22%20viewBox%3D%220%200%206%206%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22%232563eb%22%20fill-opacity%3D%220.3%22%20fill-rule%3D%22evenodd%22%3E%3Cpath%20d%3D%22M5%200h1L0%206V5zM6%205v1H5z%22/%3E%3C/g%3E%3C/svg%3E")'}}),t={args:{children:r.jsxs(r.Fragment,{children:[r.jsx(a,{}),r.jsx(a,{}),r.jsx(a,{})]})}},i={args:{...t.args,gap:"64px"}},l={args:{columns:"12"},render:s=>r.jsx(w,{gap:"4",direction:"column",children:Array.from({length:11},(n,e)=>u.createElement(o.Root,{...s,key:e},r.jsx(o.Item,{colSpan:String(e+1),children:r.jsx(a,{})}),r.jsx(o.Item,{colSpan:String(11-e),children:r.jsx(a,{})})))})},c={args:{columns:"12"},render:s=>r.jsxs(o.Root,{...s,columns:"3",children:[r.jsx(o.Item,{colSpan:"1",rowSpan:"2",children:r.jsx(S,{style:{height:"100%",background:"#eaf2fd",borderRadius:"4px",boxShadow:"0 0 0 1px #2563eb",backgroundImage:'url("data:image/svg+xml,%3Csvg%20width%3D%226%22%20height%3D%226%22%20viewBox%3D%220%200%206%206%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22%232563eb%22%20fill-opacity%3D%220.3%22%20fill-rule%3D%22evenodd%22%3E%3Cpath%20d%3D%22M5%200h1L0%206V5zM6%205v1H5z%22/%3E%3C/g%3E%3C/svg%3E")'}})}),r.jsx(o.Item,{colSpan:"2",children:r.jsx(a,{})}),r.jsx(o.Item,{colSpan:"2",children:r.jsx(a,{})})]})};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    children: <>
        <FakeBox />
        <FakeBox />
        <FakeBox />
      </>
  }
}`,...t.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    gap: '64px'
  }
}`,...i.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
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
}`,...l.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
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
}`,...c.parameters?.docs?.source}}};const F=["Default","LargeGap","ColumnSizes","RowAndColumns"];export{l as ColumnSizes,t as Default,i as LargeGap,c as RowAndColumns,F as __namedExportsOrder,B as default};
