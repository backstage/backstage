import{r as u,j as e}from"./iframe-D-w6RxGv.js";import{c as h}from"./clsx-B-dksMZM.js";import{u as f}from"./useStyles-Cd9RkdK8.js";import{B as S}from"./Box-yiz_TE6h.js";import{F as D}from"./Flex-BiQL9uGd.js";import"./preload-helper-D9Z9MdNV.js";const w={"bui-Grid":"_bui-Grid_12ez8_20"},G=u.forwardRef((o,n)=>{const{classNames:r,utilityClasses:c,style:m,cleanedProps:g}=f("Grid",{columns:"auto",gap:"4",...o}),{className:p,...x}=g;return e.jsx("div",{ref:n,className:h(r.root,c,w[r.root],p),style:m,...x})}),I=u.forwardRef((o,n)=>{const{classNames:r,utilityClasses:c,style:m,cleanedProps:g}=f("GridItem",o),{className:p,...x}=g;return e.jsx("div",{ref:n,className:h(r.root,c,w[r.root],p),style:m,...x})}),s={Root:G,Item:I},R={title:"Backstage UI/Grid",component:s.Root},a=()=>e.jsx(S,{style:{background:"#eaf2fd",borderRadius:"4px",boxShadow:"0 0 0 1px #2563eb",height:"64px",backgroundImage:'url("data:image/svg+xml,%3Csvg%20width%3D%226%22%20height%3D%226%22%20viewBox%3D%220%200%206%206%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22%232563eb%22%20fill-opacity%3D%220.3%22%20fill-rule%3D%22evenodd%22%3E%3Cpath%20d%3D%22M5%200h1L0%206V5zM6%205v1H5z%22/%3E%3C/g%3E%3C/svg%3E")'}}),t={args:{children:e.jsxs(e.Fragment,{children:[e.jsx(a,{}),e.jsx(a,{}),e.jsx(a,{})]})}},i={args:{...t.args,gap:"64px"}},l={args:{columns:"12"},render:o=>e.jsx(D,{gap:"4",direction:"column",children:Array.from({length:11},(n,r)=>u.createElement(s.Root,{...o,key:r},e.jsx(s.Item,{colSpan:String(r+1),children:e.jsx(a,{})}),e.jsx(s.Item,{colSpan:String(11-r),children:e.jsx(a,{})})))})},d={args:{columns:"12"},render:o=>e.jsxs(s.Root,{...o,columns:"3",children:[e.jsx(s.Item,{colSpan:"1",rowSpan:"2",children:e.jsx(S,{style:{height:"100%",background:"#eaf2fd",borderRadius:"4px",boxShadow:"0 0 0 1px #2563eb",backgroundImage:'url("data:image/svg+xml,%3Csvg%20width%3D%226%22%20height%3D%226%22%20viewBox%3D%220%200%206%206%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22%232563eb%22%20fill-opacity%3D%220.3%22%20fill-rule%3D%22evenodd%22%3E%3Cpath%20d%3D%22M5%200h1L0%206V5zM6%205v1H5z%22/%3E%3C/g%3E%3C/svg%3E")'}})}),e.jsx(s.Item,{colSpan:"2",children:e.jsx(a,{})}),e.jsx(s.Item,{colSpan:"2",children:e.jsx(a,{})})]})};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
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
}`,...l.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
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
}`,...d.parameters?.docs?.source}}};const y=["Default","LargeGap","ColumnSizes","RowAndColumns"];export{l as ColumnSizes,t as Default,i as LargeGap,d as RowAndColumns,y as __namedExportsOrder,R as default};
